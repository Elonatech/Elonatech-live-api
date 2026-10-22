const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const certificateController = require("../controller/certificateController");
const { verifyToken } = require("../middleware/Admin");
const validate = require("../middleware/validate");
const {
  createCertificateSchema,
  bulkCertificateSchema,
  updateCertificateSchema,
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

// Admin
router.get("/all", verifyToken, certificateController.getAllCertificatesAdmin);
router.post("/", verifyToken, validate(createCertificateSchema), certificateController.createCertificate);
router.post("/bulk", verifyToken, validate(bulkCertificateSchema), certificateController.createCertificatesBulk);
router.patch("/:id", verifyToken, validate(updateCertificateSchema), certificateController.updateCertificate);
router.delete("/:id", verifyToken, certificateController.deleteCertificate);

module.exports = router;
