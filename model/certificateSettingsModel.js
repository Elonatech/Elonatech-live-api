const mongoose = require("mongoose");

const signatorySchema = new mongoose.Schema(
  {
    signatoryName: { type: String, trim: true, default: "" },
    signatoryTitle: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// One settings document for the certificates: who signs them. Printed under
// the signature line (the signature image itself lives in CertificateAsset).
// The top-level name and title are the default; `programs` holds an optional
// different signatory per programme (e.g. programs.Ignite).
const certificateSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    signatoryName: { type: String, trim: true, default: "" },
    signatoryTitle: { type: String, trim: true, default: "" },
    programs: { type: Map, of: signatorySchema, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CertificateSettings", certificateSettingsSchema);
