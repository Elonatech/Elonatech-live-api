const mongoose = require("mongoose");
const Certificate = require("../model/certificateModel");
const { normalizeCode } = require("../lib/certificateCode");
const { renderCertificateJpeg, renderCertificatePdf } = require("../lib/certificateRenderer");
const assets = require("../lib/certificateAssets");
const { keyIsConfigured, keyProblem } = require("../lib/assetCrypto");
const logger = require("../lib/logger");
const logAudit = require("../lib/logAudit");

const performedBy = (req) => ({ id: req.user.id, name: req.user.name, email: req.user.email });

const isPdf = (req) => req.path.endsWith("/pdf");

// Sends the finished picture or PDF. The signature and stamp are decrypted only
// inside loadRenderAssets and only ever leave this server baked into the result.
const sendRendered = async (req, res, cert, { pdf: wantsPdf, forceAttachment = false }) => {
  try {
    const loaded = assets.resolveFor(await assets.loadRenderAssets(), cert.program);
    const body = wantsPdf ? await renderCertificatePdf(cert, loaded) : await renderCertificateJpeg(cert, loaded);

    res.set("Content-Type", wantsPdf ? "application/pdf" : "image/jpeg");
    // Revoking has to take effect at once, so nothing is cached
    res.set("Cache-Control", "no-store");
    if (wantsPdf) {
      const download = forceAttachment || req.query.download === "1";
      res.set("Content-Disposition", `${download ? "attachment" : "inline"}; filename="ETMPDP-${cert.program}-Certificate-${cert.code}.pdf"`);
    }
    return res.status(200).send(body);
  } catch (error) {
    logger.error("Render certificate error", { error });
    return res.status(503).json({ message: "The certificate could not be produced right now" });
  }
};

// GET /api/v1/certificates/render/:code/(image|pdf) — PUBLIC. Valid
// certificates only, same as the verify page.
const renderPublic = async (req, res) => {
  const code = normalizeCode(req.params.code);
  if (!code) return res.status(400).json({ message: "This is not a valid certificate code" });
  const cert = await Certificate.findOne({ code, status: "valid" }).lean();
  if (!cert) return res.status(404).json({ message: "No certificate found for this code" });
  return sendRendered(req, res, cert, { pdf: isPdf(req) });
};

// GET /api/v1/certificates/:id/(image|pdf) — super admin. Works for revoked ones too.
const renderAdmin = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ message: "Certificate not found" });
  const cert = await Certificate.findById(req.params.id).lean();
  if (!cert) return res.status(404).json({ message: "Certificate not found" });
  return sendRendered(req, res, cert, { pdf: isPdf(req), forceAttachment: true });
};

// GET /api/v1/certificates/assets/preview?program= — a made-up certificate drawn
// with whatever is currently uploaded, so the admin can check how it looks.
const renderSample = async (req, res) => {
  const program = req.query.program === "Ignite" ? "Ignite" : "Core";
  const sample = {
    fullName: "Sample Recipient",
    program,
    code: "ETMPDP-SAMPLE00-00",
    enrollmentDate: new Date("2026-01-12"),
    completionDate: new Date("2026-07-10"),
    issueDate: new Date(),
    ...(program === "Ignite"
      ? { pathwayLevel: "Ignite Professional", duration: "4 months", specialization: "Software Engineering" }
      : { specialFocus: "Software Engineering" }),
  };
  return sendRendered(req, res, sample, { pdf: isPdf(req) });
};

// GET /api/v1/certificates/assets — what is uploaded (never the images)
const getAssetStatus = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    return res.status(200).json({ success: true, keyConfigured: keyIsConfigured(), keyProblem: keyProblem(), ...(await assets.getStatus()) });
  } catch (error) {
    logger.error("Certificate asset status error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// PUT /api/v1/certificates/assets/:kind — upload the signature or stamp (PNG)
const uploadAsset = async (req, res) => {
  try {
    const { kind } = req.params;
    if (!assets.isValidKind(kind)) return res.status(404).json({ message: "Unknown image type" });
    if (!keyIsConfigured()) {
      return res.status(503).json({ message: keyProblem() === "invalid" ? "Image storage key is not valid: CERT_ASSETS_KEY must be 32 random bytes, base64-encoded" : "Image storage is not set up yet (CERT_ASSETS_KEY is missing on the server)" });
    }
    if (!req.file) return res.status(400).json({ message: "Choose a PNG image to upload" });

    try {
      await assets.saveAsset(kind, req.file.buffer, performedBy(req));
    } catch (error) {
      if (error.code === "BAD_IMAGE") return res.status(400).json({ message: error.message });
      throw error;
    }
    assets.clearCache();

    await logAudit({
      action: "UPDATE_CERTIFICATE_ASSETS",
      performedBy: performedBy(req),
      details: `Uploaded the certificate ${kind}`,
    });
    return res.status(200).json({ success: true, ...(await assets.getStatus()) });
  } catch (error) {
    logger.error("Upload certificate asset error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// DELETE /api/v1/certificates/assets/:kind
const deleteAsset = async (req, res) => {
  try {
    const { kind } = req.params;
    if (!assets.isValidKind(kind)) return res.status(404).json({ message: "Unknown image type" });
    await assets.removeAsset(kind);
    assets.clearCache();
    await logAudit({
      action: "UPDATE_CERTIFICATE_ASSETS",
      performedBy: performedBy(req),
      details: `Removed the certificate ${kind}`,
    });
    return res.status(200).json({ success: true, ...(await assets.getStatus()) });
  } catch (error) {
    logger.error("Delete certificate asset error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// PUT /api/v1/certificates/settings — signatory name and title
const updateSettings = async (req, res) => {
  try {
    await assets.saveSettings(req.body);
    assets.clearCache();
    await logAudit({
      action: "UPDATE_CERTIFICATE_ASSETS",
      performedBy: performedBy(req),
      details: `Set the ${req.body.program || "default"} certificate signatory to "${req.body.signatoryName}"`,
    });
    return res.status(200).json({ success: true, ...(await assets.getStatus()) });
  } catch (error) {
    logger.error("Update certificate settings error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { renderPublic, renderAdmin, renderSample, getAssetStatus, uploadAsset, deleteAsset, updateSettings };
