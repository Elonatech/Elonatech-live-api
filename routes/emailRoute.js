// This file defines the routes for handling various email-related operations in an Express.js application. It imports the necessary modules, including Express, email utility functions, Mailchimp utility functions, and a file upload middleware for handling career PDF uploads. The router defines several POST routes for different types of emails (job applications, quotes, consultations, contact messages, reasons for contact, checkout emails, retainership emails, and session emails) and connects them to the corresponding functions in the email utility module. Finally, the router is exported for use in other parts of the application.
// emailRoute.js
const express = require("express");
const router = express.Router();
const email = require("../utils/email");
// import * as email from "../utils/email.js";
const mailchimp = require("../utils/mailChip");
const upload = require("../lib/careerPdf");

router.post("/job", upload.single("file"), email.jobEmail);
router.post("/quote", email.quoteEmail);
router.post("/consult", email.consultEmail);
router.post("/contact", email.contactEmail);
router.post("/reason", email.reasonContactEmail);
router.post("/mailchimp", mailchimp.mailChimp);
router.post("/checkout", email.checkoutEmail);
router.post("/retainership", email.retainerEmail);
router.post("/session", email.sessionEmail);

module.exports = router;
  