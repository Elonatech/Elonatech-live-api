const express = require("express");
const router = express.Router();
const retainerController = require("../controller/retainerController");
const { verifyToken } = require("../middleware/Admin");

router.post("/", verifyToken, retainerController.createRetainer);
router.get("/all", verifyToken, retainerController.getAllRetainers);
router.get("/:id", verifyToken, retainerController.getRetainerById);
router.patch("/:id", verifyToken, retainerController.updateRetainerStatus);
router.delete("/:id", verifyToken, retainerController.deleteRetainer);

module.exports = router;
