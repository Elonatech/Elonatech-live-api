const mongoose = require("mongoose");
const Certificate = require("../model/certificateModel");
const { generateCode, normalizeCode } = require("../lib/certificateCode");
const { PROGRAMS } = require("../lib/certificatePrograms");
const logger = require("../lib/logger");
const logAudit = require("../lib/logAudit");

const performedBy = (req) => ({ id: req.user.id, name: req.user.name, email: req.user.email });

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Codes are random, so a collision is astronomically unlikely, but the unique
// index is the real guarantee: on a duplicate-key error just draw a new code.
const createWithUniqueCode = async (data) => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await Certificate.create({ ...data, code: generateCode(data.program) });
    } catch (error) {
      if (error.code !== 11000) throw error;
    }
  }
  throw new Error("Could not generate a unique certificate code");
};

// POST /api/v1/certificates — issue one certificate (admin)
const createCertificate = async (req, res) => {
  try {
    const { fullName, program, completionDate, enrollmentDate, issueDate, duration, pathwayLevel, specialization, specialFocus } = req.body;
    const certificate = await createWithUniqueCode({
      fullName,
      program,
      completionDate,
      enrollmentDate,
      issueDate,
      duration,
      pathwayLevel,
      specialization,
      specialFocus,
      issuedBy: performedBy(req),
    });

    await logAudit({
      action: "CREATE_CERTIFICATE",
      performedBy: performedBy(req),
      details: `Issued ${program} certificate ${certificate.code} to "${fullName}"`,
    });

    return res.status(201).json({ success: true, message: "Certificate created successfully", data: certificate });
  } catch (error) {
    logger.error("Create certificate error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// POST /api/v1/certificates/bulk — issue a whole cohort at once (admin)
const createCertificatesBulk = async (req, res) => {
  try {
    const created = [];
    const failed = [];

    for (const [index, row] of req.body.certificates.entries()) {
      try {
        created.push(await createWithUniqueCode({ ...row, issuedBy: performedBy(req) }));
      } catch (error) {
        logger.error("Bulk certificate row failed", { error, row: index });
        failed.push({ row: index + 1, fullName: row.fullName });
      }
    }

    if (created.length) {
      await logAudit({
        action: "CREATE_CERTIFICATE",
        performedBy: performedBy(req),
        details: `Issued ${created.length} certificate(s) in bulk`,
      });
    }

    return res.status(failed.length && !created.length ? 500 : 201).json({
      success: created.length > 0,
      message: `${created.length} certificate(s) created${failed.length ? `, ${failed.length} failed` : ""}`,
      data: created,
      failed,
    });
  } catch (error) {
    logger.error("Bulk create certificates error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

const SORTABLE = ["createdAt", "fullName", "completionDate", "program", "status"];

// GET /api/v1/certificates/all — admin list. ?q= matches name or code;
// ?program= and ?status= filter; ?sortBy=&sortOrder=; ?page=&limit=.
const getAllCertificatesAdmin = async (req, res) => {
  try {
    const filter = {};
    if (PROGRAMS.includes(req.query.program)) filter.program = req.query.program;
    if (["valid", "revoked"].includes(req.query.status)) filter.status = req.query.status;

    const q = String(req.query.q || "").trim().slice(0, 100);
    if (q) {
      const pattern = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ fullName: pattern }, { code: pattern }];
    }

    const sortBy = SORTABLE.includes(req.query.sortBy) ? req.query.sortBy : "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));

    const [certificates, total] = await Promise.all([
      Certificate.find(filter)
        .sort({ [sortBy]: sortOrder, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Certificate.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      certificates,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    logger.error("Get certificates (admin) error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// PATCH /api/v1/certificates/:id — edit details, or revoke / restore (admin).
// The code itself can never change: it is already printed on the certificate.
const updateCertificate = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    const existing = await Certificate.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Certificate not found" });

    const { status, revokedReason, ...details } = req.body;
    const update = { $set: { ...details }, $unset: {} };

    if (status === "revoked") {
      update.$set.status = "revoked";
      update.$set.revokedAt = existing.revokedAt || new Date();
      if (revokedReason !== undefined) update.$set.revokedReason = revokedReason;
    } else if (status === "valid") {
      update.$set.status = "valid";
      update.$unset = { revokedAt: "", revokedReason: "" };
    } else if (revokedReason !== undefined) {
      update.$set.revokedReason = revokedReason;
    }
    if (!Object.keys(update.$unset).length) delete update.$unset;

    const updated = await Certificate.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    const statusChanged = status && status !== existing.status;
    await logAudit({
      action: statusChanged && status === "revoked" ? "REVOKE_CERTIFICATE" : "UPDATE_CERTIFICATE",
      performedBy: performedBy(req),
      details: statusChanged
        ? `Changed certificate ${existing.code} status: ${existing.status} → ${status}`
        : `Updated certificate ${existing.code} ("${updated.fullName}")`,
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    logger.error("Update certificate error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// DELETE /api/v1/certificates/:id — for entries made by mistake (admin).
// Revoking is the normal way to withdraw a real certificate.
const deleteCertificate = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) return res.status(404).json({ message: "Certificate not found" });

    await logAudit({
      action: "DELETE_CERTIFICATE",
      performedBy: performedBy(req),
      details: `Deleted certificate ${certificate.code} ("${certificate.fullName}")`,
    });

    return res.status(200).json({ success: true, message: "Certificate deleted" });
  } catch (error) {
    logger.error("Delete certificate error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/v1/certificates/verify/:code — PUBLIC. What a scanned QR code
// opens. Returns only what the verify page shows (name, programme, dates) —
// never the internal id, issuer, or anything else on the record.
const verifyCertificate = async (req, res) => {
  // Always fresh: a revoked certificate must stop verifying immediately.
  res.set("Cache-Control", "no-store");
  try {
    const code = normalizeCode(req.params.code);
    if (!code) {
      return res.status(400).json({ success: false, valid: false, message: "This is not a valid certificate code" });
    }

    const certificate = await Certificate.findOne({ code }).lean();
    if (!certificate) {
      return res.status(404).json({ success: false, valid: false, message: "No certificate found for this code" });
    }

    if (certificate.status === "revoked") {
      return res.status(200).json({ success: true, valid: false, revoked: true, code });
    }

    return res.status(200).json({
      success: true,
      valid: true,
      // Exactly what is printed on the certificate itself
      certificate: {
        code: certificate.code,
        fullName: certificate.fullName,
        program: certificate.program,
        enrollmentDate: certificate.enrollmentDate || null,
        completionDate: certificate.completionDate,
        issueDate: certificate.issueDate || certificate.createdAt,
        duration: certificate.duration || "",
        pathwayLevel: certificate.pathwayLevel || "",
        specialization: certificate.specialization || "",
        specialFocus: certificate.specialFocus || "",
      },
    });
  } catch (error) {
    logger.error("Verify certificate error", { error });
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET /api/v1/certificates/public — PUBLIC, but only reachable in practice
// through the unlisted list page (it is not linked from the site and is
// marked noindex). Lists valid certificates only: a revoked one disappears
// from the list at once. Each row carries just what the verify page already
// shows publicly — name, programme, completion date, code. ?q= matches name
// or code; results are paged so the whole list can't be pulled in one request.
const listPublicCertificates = async (req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    const filter = { status: "valid" };
    if (PROGRAMS.includes(req.query.program)) filter.program = req.query.program;

    const q = String(req.query.q || "").trim().slice(0, 100);
    if (q) {
      const pattern = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ fullName: pattern }, { code: pattern }];
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));

    const [certificates, total, byProgram] = await Promise.all([
      Certificate.find(filter)
        .select("code fullName program completionDate -_id")
        .sort({ completionDate: -1, fullName: 1, _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Certificate.countDocuments(filter),
      // Headline numbers for the list page, regardless of the search/filter
      Certificate.aggregate([
        { $match: { status: "valid" } },
        { $group: { _id: "$program", count: { $sum: 1 } } },
      ]),
    ]);

    const counts = Object.fromEntries(PROGRAMS.map((p) => [p, 0]));
    byProgram.forEach(({ _id, count }) => {
      if (_id in counts) counts[_id] = count;
    });
    counts.all = PROGRAMS.reduce((sum, p) => sum + counts[p], 0);

    return res.status(200).json({
      success: true,
      certificates,
      total,
      counts,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    logger.error("List public certificates error", { error });
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  listPublicCertificates,
  createCertificate,
  createCertificatesBulk,
  getAllCertificatesAdmin,
  updateCertificate,
  deleteCertificate,
  verifyCertificate,
};
