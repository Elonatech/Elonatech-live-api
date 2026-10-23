const mongoose = require("mongoose");

// The signature and the company stamp, one document each, either the default
// ("signature", "stamp") or for a single programme ("stamp:Core", "signature:Ignite").
// The image is stored ENCRYPTED (see lib/assetCrypto.js); there is deliberately
// no way to read it back out of the API. It is only ever used to draw finished
// certificates. Which kinds are allowed is checked in lib/certificateAssets.js.
const certificateAssetSchema = new mongoose.Schema(
  {
    kind: { type: String, required: true, unique: true },
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
