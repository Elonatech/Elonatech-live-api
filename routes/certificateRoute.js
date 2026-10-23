const express = require("express");
const rateLimit = require("express-rate-limit"); 
const router = express.Router();
const multer = require("multer");
const certificateController = require("../controller/certificateController");
const renderController = require("../controller/certificateRenderController");
const { verifySuperAdmin } = require("../middleware/Admin");
const validate = require("../middleware/validate");
const {
  createCertificateSchema,
  bulkCertificateSchema,
  updateCertificateSchema,
  certificateSettingsSchema,
} = require("../validators/certificateValidator");

// The verify endpoint is public, so cap how fast one address can try codes.
// A real scan or lookup is one request; this only stops guessing at scale.
const verifyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, valid: false, message: "Too many attempts. Please try again in a minute." },
});

// Public — what the QR code on a certificate opens
router.get("/verify/:code", verifyLimiter, certificateController.verifyCertificate);

// Public list behind the unlisted /etmpdp-certificates page (hidden, not
// password-protected). Searching and paging make more requests than a single
// verify, so it gets a higher cap of its own.
const listLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 90,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again in a minute." },
});
router.get("/public", listLimiter, certificateController.listPublicCertificates);

// Drawing a certificate is the heaviest thing this API does, so the public
// copy (what the verify page shows) is capped well below the lookup endpoints.
const renderLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again in a minute." },
});
router.get("/render/:code/image", renderLimiter, renderController.renderPublic);
router.get("/render/:code/pdf", renderLimiter, renderController.renderPublic);

// The signature and stamp: PNG only, small, held in memory just long enough to be encrypted
const uploadPng = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => (file.mimetype === "image/png" ? cb(null, true) : cb(new Error("The image must be a PNG file"))),
}).single("image");
const pngUpload = (req, res, next) =>
  uploadPng(req, res, (error) => (error ? res.status(400).json({ message: error.message }) : next()));

// Admin: certificates are managed by super admins only. A normal admin gets 403 on every one of these.
router.get("/assets", verifySuperAdmin, renderController.getAssetStatus);
router.get("/assets/preview/image", verifySuperAdmin, renderController.renderSample);
router.get("/assets/preview/pdf", verifySuperAdmin, renderController.renderSample);
router.put("/assets/:kind", verifySuperAdmin, pngUpload, renderController.uploadAsset);
router.delete("/assets/:kind", verifySuperAdmin, renderController.deleteAsset);
router.put("/settings", verifySuperAdmin, validate(certificateSettingsSchema), renderController.updateSettings);
router.get("/:id/image", verifySuperAdmin, renderController.renderAdmin);
router.get("/:id/pdf", verifySuperAdmin, renderController.renderAdmin);
router.get("/all", verifySuperAdmin, certificateController.getAllCertificatesAdmin);
router.post("/", verifySuperAdmin, validate(createCertificateSchema), certificateController.createCertificate);
router.post("/bulk", verifySuperAdmin, validate(bulkCertificateSchema), certificateController.createCertificatesBulk);
router.patch("/:id", verifySuperAdmin, validate(updateCertificateSchema), certificateController.updateCertificate);
router.delete("/:id", verifySuperAdmin, certificateController.deleteCertificate);

module.exports = router;
