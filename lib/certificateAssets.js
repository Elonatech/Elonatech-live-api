const { createCanvas, loadImage } = require("@napi-rs/canvas");
const CertificateAsset = require("../model/certificateAssetModel");
const CertificateSettings = require("../model/certificateSettingsModel");
const { encrypt, decrypt } = require("./assetCrypto");

// The signature and stamp live in MongoDB only as encrypted bytes. This file is
// the one place that puts them back together, in memory, to draw a certificate.
//
// Each of the two images has a default ("signature", "stamp") and an optional
// override per programme ("stamp:Core", "signature:Ignite"). A programme without
// its own image uses the default. Adding a programme is one word in PROGRAMS.

const BASE_KINDS = ["signature", "stamp"];
const { PROGRAMS } = require("../validators/certificateValidator");
const KINDS = BASE_KINDS.flatMap((base) => [base, ...PROGRAMS.map((p) => `${base}:${p}`)]);
const isValidKind = (kind) => KINDS.includes(kind);

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

const signatory = (doc) => ({ signatoryName: doc?.signatoryName || "", signatoryTitle: doc?.signatoryTitle || "" });

// { signatoryName, signatoryTitle, programs: { Core: {...}, Ignite: {...} } }
const getSettings = async () => {
  const doc = await CertificateSettings.findOne({ key: "main" }).lean();
  const stored = doc?.programs || {};
  const programs = {};
  PROGRAMS.forEach((p) => {
    programs[p] = signatory(stored instanceof Map ? stored.get(p) : stored[p]);
  });
  return { ...signatory(doc), programs };
};

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

// program: one of PROGRAMS, or empty for the default signatory
const saveSettings = async ({ program, signatoryName, signatoryTitle }) => {
  const set = program
    ? { [`programs.${program}`]: { signatoryName, signatoryTitle } }
    : { signatoryName, signatoryTitle };
  await CertificateSettings.findOneAndUpdate(
    { key: "main" },
    { $set: set, $setOnInsert: { key: "main" } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

// Decoded images are kept for a short while so a burst of downloads (an export
// of a whole cohort) does not decrypt the same images hundreds of times.
let cache = { at: 0, value: null };
const CACHE_MS = 60 * 1000;
const clearCache = () => {
  cache = { at: 0, value: null };
};

// Everything stored, decoded: { images: { kind: Image }, settings }. An image
// that IS stored but cannot be decrypted throws: better to refuse than to hand
// out a certificate that silently lacks the real signature.
const loadRenderAssets = async () => {
  if (cache.value && Date.now() - cache.at < CACHE_MS) return cache.value;

  const [rows, settings] = await Promise.all([CertificateAsset.find(), getSettings()]); // not lean: Mongoose hands back real Buffers
  const images = {};
  for (const row of rows) {
    images[row.kind] = await loadImage(decrypt({ data: row.data, iv: row.iv, tag: row.tag }));
  }
  const value = { images, settings };
  cache = { at: Date.now(), value };
  return value;
};

// What the renderer needs for one programme: its own signature / stamp / signer
// where it has them, otherwise the default. An image that was never uploaded is
// null (the drawn placeholder is used).
const resolveFor = ({ images, settings }, program) => {
  const own = settings.programs?.[program];
  return {
    signature: images[`signature:${program}`] || images.signature || null,
    stamp: images[`stamp:${program}`] || images.stamp || null,
    settings: own?.signatoryName ? own : { signatoryName: settings.signatoryName, signatoryTitle: settings.signatoryTitle },
  };
};

module.exports = {
  KINDS,
  PROGRAMS,
  isValidKind,
  saveAsset,
  removeAsset,
  getStatus,
  getSettings,
  saveSettings,
  loadRenderAssets,
  resolveFor,
  clearCache,
};
