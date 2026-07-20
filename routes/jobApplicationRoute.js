const express = require("express");
const router = express.Router();
const jobApplicationController = require("../controller/jobApplicationController");
const { verifyToken } = require("../middleware/Admin");

router.get("/all", verifyToken, jobApplicationController.getAllApplications);
router.get("/:id", verifyToken, jobApplicationController.getApplicationById);
router.patch("/:id", verifyToken, jobApplicationController.updateApplicationStatus);
router.delete("/:id", verifyToken, jobApplicationController.deleteApplication);

module.exports = router;
