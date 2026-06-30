// This file defines the routes for admin-related operations, including registration, login, and verification. It uses Express.js to create a router and connects the routes to the corresponding controller functions in AdminController. The verify-admin route is protected by the verifyToken middleware to ensure that only authenticated admins can access it.
// adminRoute.js
// routes\adminRoute.js

const rateLimit = require("express-rate-limit");
const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");
const { verifyToken, verifySuperAdmin } = require("../middleware/Admin");
const validate = require("../middleware/validate");
const { loginSchema, createAdminSchema } = require("../validators/adminValidators");

// Limits login attempts to 10 per 15 minutes per IP
// Protects against brute force password attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { message: "Too many login attempts. Please try again in 15 minutes." }
});


router.post("/login", loginLimiter, validate(loginSchema), AdminController.adminLogin);
// Uses the httpOnly cookie automatically sent by the browser
// Issues a new access token + rotates the refresh token
router.post("/refresh", AdminController.refreshAccessToken);
// Deletes the refresh token from DB and clears the cookie
router.post("/logout", AdminController.logout);
router.post("/verify-admin", verifyToken, AdminController.verifyAdmin);

router.post("/register", verifySuperAdmin, AdminController.adminRegister);
router.post("/create", verifySuperAdmin, validate(createAdminSchema), AdminController.createAdmin)
router.get("/all", verifySuperAdmin, AdminController.getAllAdmins);
router.delete("/:id", verifySuperAdmin, AdminController.deleteAdmin);


module.exports = router;
