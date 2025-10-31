const express = require("express");
const router = express.Router();
const email = require("../utils/email");
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
