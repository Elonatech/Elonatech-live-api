const express = require("express");
const router = express.Router();
const consultationController = require("../controller/consultationController");
const { verifyToken } = require("../middleware/Admin");

router.post("/", verifyToken, consultationController.createConsultation);
router.get("/all", verifyToken, consultationController.getAllConsultations);
router.get("/:id", verifyToken, consultationController.getConsultationById);
router.patch("/:id", verifyToken, consultationController.updateConsultationStatus);
router.delete("/:id", verifyToken, consultationController.deleteConsultation);

module.exports = router;
