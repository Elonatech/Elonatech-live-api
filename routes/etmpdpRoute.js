const express = require("express");
const router = express.Router();
const etmpdpController = require("../controller/etmpdpController");
const { verifyToken } = require("../middleware/Admin");

router.get("/all", verifyToken, etmpdpController.getAllApplications);
router.get("/:id", verifyToken, etmpdpController.getApplicationById);
router.patch("/:id", verifyToken, etmpdpController.updateApplicationStatus);
router.delete("/:id", verifyToken, etmpdpController.deleteApplication);

module.exports = router;
