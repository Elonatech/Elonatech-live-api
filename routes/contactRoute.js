const express = require("express");
const router = express.Router();
const contactController = require("../controller/contactController");
const { verifyToken } = require("../middleware/Admin");

router.post("/", verifyToken, contactController.createContact);
router.get("/all", verifyToken, contactController.getAllContacts);
router.get("/:id", verifyToken, contactController.getContactById);
router.patch("/:id", verifyToken, contactController.updateContactStatus);
router.delete("/:id", verifyToken, contactController.deleteContact);

module.exports = router;
