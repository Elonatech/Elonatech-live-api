const mongoose = require("mongoose");

// One settings document for the certificates: who signs them. Printed under
// the signature line (the signature image itself lives in CertificateAsset).
const certificateSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    signatoryName: { type: String, trim: true, default: "" },
    signatoryTitle: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CertificateSettings", certificateSettingsSchema);
