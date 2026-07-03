/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Admin authentication — login, token refresh, logout, and admin management
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login as admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@elonatech.com.ng
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful — returns accessToken and sets httpOnly refresh cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 email: { type: string }
 *                 access: { type: string, description: "JWT access token (15 min)" }
 *                 role: { type: string }
 *       400:
 *         description: Invalid email or password
 *       429:
 *         description: Too many login attempts (rate limited)
 */

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Get a new access token using the refresh cookie
 *     tags: [Auth]
 *     description: Reads the httpOnly refreshToken cookie. Rotates the token on each call.
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access: { type: string }
 *       401:
 *         description: No refresh token, invalid, or revoked
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout — revokes refresh token and clears cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

/**
 * @swagger
 * /api/v1/auth/verify-admin:
 *   post:
 *     summary: Verify the current JWT is valid and belongs to an admin
 *     tags: [Auth]
 *     security:
 *       - TokenAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Token missing or invalid
 */

/**
 * @swagger
 * /api/v1/auth/create:
 *   post:
 *     summary: Create a new admin (super admin only)
 *     tags: [Auth]
 *     security:
 *       - TokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, role]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [admin, superAdmin] }
 *     responses:
 *       201:
 *         description: Admin created
 *       403:
 *         description: Forbidden — super admin only
 */

/**
 * @swagger
 * /api/v1/auth/all:
 *   get:
 *     summary: Get all admins (super admin only)
 *     tags: [Auth]
 *     security:
 *       - TokenAuth: []
 *     responses:
 *       200:
 *         description: List of all admin accounts
 */

/**
 * @swagger
 * /api/v1/auth/{id}:
 *   delete:
 *     summary: Delete an admin by ID (super admin only)
 *     tags: [Auth]
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Admin deleted
 *       403:
 *         description: Cannot delete super admin
 *       404:
 *         description: Admin not found
 */

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
