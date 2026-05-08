// This file defines the routes for admin-related operations, including registration, login, and verification. It uses Express.js to create a router and connects the routes to the corresponding controller functions in AdminController. The verify-admin route is protected by the verifyToken middleware to ensure that only authenticated admins can access it.
// adminRoute.js
// routes\adminRoute.js
const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");
const verifyToken = require("../middleware/Admin");

router.post("/register", AdminController.adminRegister);
router.post("/login", AdminController.adminLogin);
router.post("/verify-admin", verifyToken, AdminController.verifyAdmin);

module.exports = router;
