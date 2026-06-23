// This file defines the routes for admin-related operations, including registration, login, and verification. It uses Express.js to create a router and connects the routes to the corresponding controller functions in AdminController. The verify-admin route is protected by the verifyToken middleware to ensure that only authenticated admins can access it.
// adminRoute.js
// routes\adminRoute.js

const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Please try again in 15 minutes." }
});



const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");
const verifyToken = require("../middleware/Admin");

router.post("/register", AdminController.adminRegister);
router.post("/login", loginLimiter, AdminController.adminLogin);
router.post("/verify-admin", verifyToken, AdminController.verifyAdmin);

module.exports = router;
