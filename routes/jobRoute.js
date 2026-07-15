const express = require("express");
const router = express.Router();
const jobController = require("../controller/jobController");
const { verifyToken } = require("../middleware/Admin");
const validate = require("../middleware/validate");
const { createJobSchema, updateJobSchema } = require("../validators/jobValidator");

router.get("/all", verifyToken, jobController.getAllJobsAdmin);
router.get("/", jobController.getActiveJobs);
router.get("/:id", jobController.getJobById);

router.post("/", verifyToken, validate(createJobSchema), jobController.createJob);
router.patch("/:id", verifyToken, validate(updateJobSchema), jobController.updateJob);
router.delete("/:id", verifyToken, jobController.deleteJob);

module.exports = router;
