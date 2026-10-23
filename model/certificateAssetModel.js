const mongoose = require("mongoose");

// The signature and the company stamp, one document each. The image is stored
// ENCRYPTED (see lib/assetCrypto.js); there is deliberately no way to read it
// back out of the API. It is only ever used to draw finished certificates.
const certificateAssetSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ["signature", "stamp"], required: true, unique: true },
    data: { type: Buffer, required: true },
    iv: { type: Buffer, required: true },
    tag: { type: Buffer, required: true },
    uploadedBy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      name: { type: String },
      email: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CertificateAsset", certificateAssetSchema);
