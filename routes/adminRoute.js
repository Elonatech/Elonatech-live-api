const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");
const verifyToken = require("../middleware/Admin");

router.post("/register", AdminController.adminRegister);
router.post("/login", AdminController.adminLogin);
router.post("/verify-admin", verifyToken, AdminController.verifyAdmin);

module.exports = router;
