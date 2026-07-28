/**
 * @swagger
 * tags:
 *   name: Email
 *   description: Send various types of emails — enquiries, job applications, quotes, etc.
 */

/**
 * @swagger
 * /api/v1/email/contact:
 *   post:
 *     summary: Send a general contact message
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               message: { type: string }
 *     responses:
 *       200:
 *         description: Email sent
 */

/**
 * @swagger
 * /api/v1/email/quote:
 *   post:
 *     summary: Request a price quote
 *     tags: [Email]
 *     responses:
 *       200:
 *         description: Quote request sent
 */

/**
 * @swagger
 * /api/v1/email/consult:
 *   post:
 *     summary: Book a consultation
 *     tags: [Email]
 *     responses:
 *       200:
 *         description: Consultation request sent
 */

/**
 * @swagger
 * /api/v1/email/job:
 *   post:
 *     summary: Submit a job application (with CV/PDF upload)
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Application submitted
 */

/**
 * @swagger
 * /api/v1/email/checkout:
 *   post:
 *     summary: Send a checkout confirmation email
 *     tags: [Email]
 *     responses:
 *       200:
 *         description: Checkout email sent
 */

/**
 * @swagger
 * /api/v1/email/retainership:
 *   post:
 *     summary: Send a retainership enquiry email
 *     tags: [Email]
 *     responses:
 *       200:
 *         description: Retainership email sent
 */

/**
 * @swagger
 * /api/v1/email/session:
 *   post:
 *     summary: Book a session
 *     tags: [Email]
 *     responses:
 *       200:
 *         description: Session booking email sent
 */

/**
 * @swagger
 * /api/v1/email/mailchimp:
 *   post:
 *     summary: Subscribe to newsletter via Mailchimp
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Subscribed successfully
 */

// emailRoute.js
const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const email = require("../utils/email");
// import * as email from "../utils/email.js";
const mailchimp = require("../utils/mailChip");
const upload = require("../lib/careerPdf");

// Every route here is public (no login required) and triggers a Cloudinary
// upload and/or an outbound Brevo email per request, so it's the part of the
// API most exposed to anonymous spam/abuse. 10 requests per 15 minutes per IP
// is generous for a genuine visitor filling out one form, but blocks scripted
// spam of the mailbox/upload quota.
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many submissions from this address. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(formLimiter);

router.post("/job", upload.single("file"), email.jobEmail);
router.post("/quote", email.quoteEmail);
router.post("/consult", email.consultEmail);
router.post("/contact", email.contactEmail);
router.post("/reason", email.reasonContactEmail);
router.post("/mailchimp", mailchimp.mailChimp);
router.post("/checkout", email.checkoutEmail);
router.post("/retainership", email.retainerEmail);
router.post("/session", email.sessionEmail);
router.post("/emptdp", upload.single("file"), email.emptdpEmail);
router.post(
  "/ignite",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "siwesLetter", maxCount: 1 },
  ]),
  email.igniteEmail
);

module.exports = router;
 