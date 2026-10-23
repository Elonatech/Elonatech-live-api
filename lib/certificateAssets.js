const { createCanvas, loadImage } = require("@napi-rs/canvas");
const CertificateAsset = require("../model/certificateAssetModel");
const CertificateSettings = require("../model/certificateSettingsModel");
const { encrypt, decrypt } = require("./assetCrypto");

// The signature and stamp live in MongoDB only as encrypted bytes. This file is
// the one place that puts them back together, in memory, to draw a certificate.

const KINDS = ["signature", "stamp"];
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
// Plenty for a signature or stamp printed ~4cm wide at 300dpi, and keeps the
// stored file small.
const MAX_SIDE = 1200;

// Checks the upload really is a PNG, shrinks it if it is huge, and re-encodes
// it, which also drops any hidden metadata the file came with.
const normalizePng = async (buffer) => {
  if (buffer.length < 8 || !buffer.subarray(0, 8).equals(PNG_MAGIC)) {
    const error = new Error("The image must be a PNG file");
    error.code = "BAD_IMAGE";
    throw error;
  }
  let image;
  try {
    image = await loadImage(buffer);
  } catch {
    const error = new Error("The image could not be read");
    error.code = "BAD_IMAGE";
    throw error;
  }
  const ratio = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * ratio));
  const height = Math.max(1, Math.round(image.height * ratio));
  const canvas = createCanvas(width, height);
  canvas.getContext("2d").drawImage(image, 0, 0, width, height);
  return canvas.toBuffer("image/png");
};

const saveAsset = async (kind, buffer, uploadedBy) => {
  const png = await normalizePng(buffer);
  const sealed = encrypt(png);
  await CertificateAsset.findOneAndUpdate(
    { kind },
    { kind, ...sealed, uploadedBy },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const removeAsset = (kind) => CertificateAsset.deleteOne({ kind });

// What the admin screen may know: whether each image exists and when it was
// last changed. Never the image itself.
const getStatus = async () => {
  const [rows, settings] = await Promise.all([
    CertificateAsset.find().select("kind updatedAt uploadedBy.name -_id").lean(),
    getSettings(),
  ]);
  const status = {};
  KINDS.forEach((kind) => {
    const row = rows.find((r) => r.kind === kind);
    status[kind] = row ? { uploaded: true, updatedAt: row.updatedAt, uploadedBy: row.uploadedBy?.name || "" } : { uploaded: false };
  });
  return { ...status, settings };
};

const getSettings = async () => {
  const doc = await CertificateSettings.findOne({ key: "main" }).lean();
  return { signatoryName: doc?.signatoryName || "", signatoryTitle: doc?.signatoryTitle || "" };
};

const saveSettings = async ({ signatoryName, signatoryTitle }) => {
  await CertificateSettings.findOneAndUpdate(
    { key: "main" },
    { key: "main", signatoryName, signatoryTitle },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

// Decoded images are kept for a short while so a burst of downloads (an export
// of a whole cohort) does not decrypt the same two images hundreds of times.
let cache = { at: 0, value: null };
const CACHE_MS = 60 * 1000;
const clearCache = () => {
  cache = { at: 0, value: null };
};

// { signature, stamp, settings } ready to hand to the renderer. An image that
// was never uploaded is null (the drawn placeholder is used). An image that IS
// stored but cannot be decrypted throws: better to refuse than to hand out a
// certificate that silently lacks the real signature.
const loadRenderAssets = async () => {
  if (cache.value && Date.now() - cache.at < CACHE_MS) return cache.value;

  const [rows, settings] = await Promise.all([CertificateAsset.find(), getSettings()]); // not lean: Mongoose hands back real Buffers
  const value = { signature: null, stamp: null, settings };
  for (const row of rows) {
    value[row.kind] = await loadImage(decrypt({ data: row.data, iv: row.iv, tag: row.tag }));
  }
  cache = { at: Date.now(), value };
  return value;
};

module.exports = { KINDS, saveAsset, removeAsset, getStatus, getSettings, saveSettings, loadRenderAssets, clearCache };
