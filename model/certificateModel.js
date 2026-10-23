const mongoose = require("mongoose");

// One record per ETMPDP certificate. The public verify page looks a
// certificate up by `code` only; nothing here is ever exposed except the
// fields the controller chooses to return.
const certificateSchema = new mongoose.Schema(
  {
    // ETMPDP-XXXXXXXX-CC — generated server-side, never changes once issued,
    // because it is printed on the certificate (inside the QR code).
    code: { type: String, required: true, unique: true, index: true },

    fullName: { type: String, required: true, trim: true },

    // The two certificate designs: Core and Ignite.
    program: { type: String, enum: ["Core", "Ignite"], required: true },

    enrollmentDate: { type: Date },
    completionDate: { type: Date, required: true },

    // Printed on the certificate. issueDate is the "Date of Issue" line; when
    // it is not set the record's creation date is used.
    issueDate: { type: Date },
    duration: { type: String, trim: true },
    // Ignite certificates carry two more lines; Core ignores them.
    pathwayLevel: { type: String, trim: true },
    specialization: { type: String, trim: true },
    // Core only: the track the person developed most during the programme
    // (optional; chosen by the admin, not taken from the application).
    specialFocus: { type: String, trim: true },

    // "revoked" keeps the record (and the printed QR still resolves to a clear
    // "no longer valid" page) instead of silently deleting it.
    status: { type: String, enum: ["valid", "revoked"], default: "valid" },
    revokedAt: { type: Date },
    revokedReason: { type: String, trim: true },

    issuedBy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      name: { type: String },
      email: { type: String },
    },
  },
  { timestamps: true }
);

certificateSchema.index({ createdAt: -1 });
certificateSchema.index({ fullName: 1 });

module.exports = mongoose.model("Certificate", certificateSchema);
