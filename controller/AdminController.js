const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const config = require("../config/key");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../model/refreshTokenModel");
const logger = require("../lib/logger");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const logAudit = require("../lib/logAudit");

// Sign Up
const adminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    const oldadmin = await Admin.findOne({ email });
    if (oldadmin) {
      return res.status(409).json({ message: "Admin Already Exist" });
    }
    //Encrypt admin password
    const encryptedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: encryptedPassword });
    return res.status(201).json({ admin });
  } catch (error) {
    logger.error("Register error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

//  Sign In
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if Admin exist
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // compare passwords
    const passwordValid = await bcrypt.compare(password, admin.password);
    if (!passwordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Only the master account uses 2FA — check if it's the master AND has 2FA turned on
    if (admin.isMaster && admin.totpEnabled) {
      // Don't issue the JWT yet — tell the frontend to ask for the 6-digit code
      // adminId is sent so the frontend can pass it back in the next request
      return res.status(200).json({ requireTotp: true, adminId: admin._id });
    }

    // Not a master account (or 2FA not set up yet) — issue the JWT normally
    await logAudit({ action: "LOGIN", performedBy: { id: admin._id, name: admin.name, email: admin.email }, details: "Logged in successfully" });
    return await issueTokens(admin, res);
  } catch (error) {
    logger.error("Login error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const verifyAdmin = async (req, res) => {
  try {
    // Verify the token
    const decoded = req.user;

    // Find the admin based on the decoded ID
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({ isAdmin: false, message: "Admin not found" });
    }

    // Return the admin status
    return res.status(200).json({ isAdmin: true });
  } catch (error) {
    logger.error("Verify admin error", { error });
    return res.status(500).json({ isAdmin: false, message: "Error verifying admin" });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // Verify the token signature and expiry
    let decoded;
    try {
      decoded = jwt.verify(token, config.refresh_token_key);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    // Check it exists in DB (not revoked)
    const stored = await RefreshToken.findOne({ token });
    if (!stored) {
      return res.status(401).json({ message: "Refresh token has been revoked" });
    }

    // Token rotation — delete old, create new
    await RefreshToken.deleteOne({ token });

    const admin = await Admin.findById(decoded.id).select("name email role");
    const payload = { id: decoded.id, role: decoded.role, name: admin?.name, email: admin?.email };
    const newAccessToken = jwt.sign(payload, config.token_key, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign(payload, config.refresh_token_key, { expiresIn: "7d" });

    await RefreshToken.create({
      adminId: decoded.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ access: newAccessToken });
  } catch (error) {
    logger.error("Refresh token error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await RefreshToken.deleteOne({ token });
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });
    // Log the logout — req.user is set by verifyToken if the route uses it, otherwise skip
    if (req.user) {
      await logAudit({ action: "LOGOUT", performedBy: { id: req.user.id, name: req.user.name, email: req.user.email }, details: "Logged out" });
    }
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error("Logout error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const existing = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (existing) return res.status(409).json({ message: "An admin with that email already exists" });
    const encryptedPassword = await bcrypt.hash(password, 10)
    const admin = await Admin.create({ name, email, password: encryptedPassword, role })
    await logAudit({ action: "CREATE_ADMIN", performedBy: { id: req.user.id, name: req.user.name, email: req.user.email }, target: { id: admin._id, name: admin.name, email: admin.email }, details: `Created ${role} account for ${email}` });
    return res.status(201).json({ success: true, message: "Admin created successfully", data: admin })
  } catch (error) {
    logger.error("Create admin error", { error });
    return res.status(500).json({ sucess: false, message: "Internal Server Error" })
  }
}

const getAllAdmins = async (req, res) => {
  try {
    const requester = await Admin.findById(req.user.id);
    let filter = {};
    if (requester.role === "admin") {
      filter = { role: "admin" };                    // hides super admins (and master, who is one)
    } else if (requester.role === "superAdmin" && !requester.isMaster) {
      filter = { isMaster: { $ne: true } };            // hides master from non-master super admins
    }
    // requester.isMaster === true → no filter, sees everyone
    const admins = await Admin.find(filter, "name email role isMaster totpEnabled createdAt");
    return res.status(200).json({ admins });
  } catch (error) {
    logger.error("Get all admins error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const requester = await Admin.findById(req.user.id);
    const target = await Admin.findById(req.params.id);

    if (!target) return res.status(404).json({ message: "Admin not found" });

    if (req.user.id === req.params.id) {
      return res.status(403).json({ message: "Cannot delete your own account" });
    }

    if (target.role === "superAdmin" && !requester.isMaster) {
      return res.status(403).json({ message: "Only the master admin can delete super admins" });
    }

    await Admin.findByIdAndDelete(req.params.id);
    await logAudit({ action: "DELETE_ADMIN", performedBy: { id: req.user.id, name: req.user.name, email: req.user.email }, target: { id: target._id, name: target.name, email: target.email }, details: `Deleted ${target.role} account: ${target.email}` });
    return res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    logger.error("Delete admin error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const requester = await Admin.findById(req.user.id);
    const target = await Admin.findById(req.params.id);
    if (!target) return res.status(404).json({ message: "Admin not found" });

    // Master cannot be edited by anyone except themselves
    if (target.isMaster && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "The master account cannot be edited" });
    }

    // Super admins cannot be edited by normal admins or other super admins (only master can)
    if (target.role === "superAdmin" && !requester.isMaster && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Only the master admin can edit super admins" });
    }

    const updates = {};

    if (name !== undefined) {
      if (name.trim().length < 2) return res.status(400).json({ message: "Name must be at least 2 characters" });
      updates.name = name.trim();
    }

    if (email !== undefined) {
      const existing = await Admin.findOne({ email: email.trim().toLowerCase(), _id: { $ne: req.params.id } });
      if (existing) return res.status(409).json({ message: "Email already in use by another admin" });
      updates.email = email.trim().toLowerCase();
    }

    if (password !== undefined && password.trim() !== "") {
      if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
      updates.password = await bcrypt.hash(password, 10);
    }

    if (role !== undefined) {
      if (!["admin", "superAdmin"].includes(role)) return res.status(400).json({ message: "Invalid role" });
      updates.role = role;
    }

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, select: "name email role isMaster" }
    );
    const changedFields = Object.keys(updates).filter(k => k !== "password").join(", ");
    await logAudit({ action: "UPDATE_ADMIN", performedBy: { id: req.user.id, name: req.user.name, email: req.user.email }, target: { id: target._id, name: target.name, email: target.email }, details: `Updated fields: ${changedFields || "password"}` });
    return res.status(200).json({ message: "Admin updated successfully", admin });
  } catch (error) {
    logger.error("Update admin error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// ─── Shared helper ────────────────────────────────────────────────────────────
// issueTokens is called after login is fully verified (password + TOTP if needed)
// It creates both tokens, stores the refresh token in the DB, and sends the response
const issueTokens = async (admin, res) => {
  const payload = { id: admin._id, role: admin.role, name: admin.name, email: admin.email };

  // Sign a short-lived access token (15 min) — used in request headers as x-access-token
  const accessToken = jwt.sign(payload, config.token_key, { expiresIn: "15m" });

  // Sign a long-lived refresh token (7 days) — used only to get a new access token
  const refreshToken = jwt.sign(payload, config.refresh_token_key, { expiresIn: "7d" });

  // Save the refresh token to the database so we can revoke it on logout
  await RefreshToken.create({
    adminId: admin._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  });

  // Send the refresh token as an httpOnly cookie — the browser stores it automatically
  // httpOnly means JavaScript on the page cannot read it (protects against XSS attacks)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only sent over HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // lax in dev so cookies work across ports (3000 → 8000)
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Send the access token in the response body — the frontend stores this in localStorage
  return res.status(200).json({
    message: "Login Successful",
    email: admin.email,
    access: accessToken,
    role: admin.role,
  });
};

// ─── TOTP Step 1: Setup ───────────────────────────────────────────────────────
// Called when the master admin clicks "Setup 2FA" on the dashboard
// Generates a secret key and returns a QR code image — does NOT enable 2FA yet
const setupTotp = async (req, res) => {
  try {
    // Find the logged-in admin using the id from the decoded JWT (set by verifyToken middleware)
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    logger.info(`TOTP setup started for admin: ${admin.email}`);

    // generateSecret creates a unique key tied to this admin account
    // The "name" is what shows up as the label inside Google Authenticator
    const secret = speakeasy.generateSecret({
      name: `Elonatech Admin (${admin.email})`,
    });

    // Save the base32 version of the secret to the database
    // base32 is the format speakeasy uses to verify codes later
    // totpEnabled stays false — we only enable it after they confirm it works
    admin.totpSecret = secret.base32;
    admin.totpEnabled = false; // reset in case they're redoing setup
    await admin.save();

    logger.info(`TOTP secret saved for admin: ${admin.email} — awaiting confirmation`);

    // Convert the secret into a QR code image (base64 string)
    // otpauth_url is a standard URL format that authenticator apps understand
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    // Return the QR code to the frontend — the frontend renders it as an <img> tag
    return res.status(200).json({ qrCode });
  } catch (error) {
    logger.error("Setup TOTP error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// ─── TOTP Step 2: Enable ──────────────────────────────────────────────────────
// Called after the admin scans the QR code and submits their first 6-digit code
// This confirms the app is linked correctly before we turn 2FA on
const enableTotp = async (req, res) => {
  try {
    // The 6-digit code the admin typed from Google Authenticator
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Verification code is required" });
    }

    // Find the logged-in admin
    const admin = await Admin.findById(req.user.id);

    // If there's no secret saved, they haven't run setup yet
    if (!admin || !admin.totpSecret) {
      logger.warn(`TOTP enable attempted without setup — admin id: ${req.user.id}`);
      return res.status(400).json({ message: "Run setup first before enabling 2FA" });
    }

    logger.info(`TOTP enable attempt for admin: ${admin.email} — verifying code`);

    // Verify the code against the stored secret
    // window: 2 allows a 60-second drift either side (accounts for clock differences between server and phone)
    const isValid = speakeasy.totp.verify({
      secret: admin.totpSecret,
      encoding: "base32", // must match how we stored it
      token: code,
      window: 2,
    });

    if (!isValid) {
      logger.warn(`TOTP enable failed — wrong code for admin: ${admin.email}`);
      return res.status(400).json({ message: "Invalid code — try again with a fresh code from the app" });
    }

    // Code matched — officially turn on 2FA for this account
    admin.totpEnabled = true;
    await admin.save();

    logger.info(`TOTP successfully enabled for admin: ${admin.email}`);
    await logAudit({ action: "TOTP_ENABLED", performedBy: { id: admin._id, name: admin.name, email: admin.email }, details: "2FA enabled on account" });
    return res.status(200).json({ message: "2FA enabled successfully" });
  } catch (error) {
    logger.error("Enable TOTP error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// ─── TOTP Step 3: Login verification ─────────────────────────────────────────
// Called on the login page after password check — the admin enters their 6-digit code here
// No auth middleware on this route because the admin doesn't have a JWT yet at this point
const verifyTotp = async (req, res) => {
  try {
    // adminId was sent by the frontend from the first login response (requireTotp: true, adminId: ...)
    // token is the 6-digit code from  Authenticator
    const { adminId, token } = req.body;

    // Basic check — both fields must be present
    if (!adminId || !token) {
      return res.status(400).json({ message: "adminId and token are required" });
    }

    // Find the admin by the id we sent in the first login response
    const admin = await Admin.findById(adminId);

    // If admin doesn't exist or 2FA isn't actually enabled, reject the request
    if (!admin || !admin.totpEnabled) {
      return res.status(400).json({ message: "Invalid request" });
    }

    logger.info(`TOTP login attempt for admin: ${admin.email}`);

    // Verify the 6-digit code against the stored secret — same as enableTotp
    const isValid = speakeasy.totp.verify({
      secret: admin.totpSecret,
      encoding: "base32",
      token,
      window: 2,
    });

    // Wrong code — tell them to try again (the code refreshes every 30 seconds)
    if (!isValid) {
      logger.warn(`TOTP login failed — wrong code for admin: ${admin.email}`);
      return res.status(400).json({ message: "Invalid code — try again" });
    }

    logger.info(`TOTP login successful for admin: ${admin.email}`);
    await logAudit({ action: "TOTP_LOGIN", performedBy: { id: admin._id, name: admin.name, email: admin.email }, details: "Logged in with 2FA code" });

    // Code is correct — now issue the JWT and log them in fully
    return await issueTokens(admin, res);
  } catch (error) {
    logger.error("Verify TOTP login error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};



const disableTotp = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (!admin.totpEnabled) return res.status(400).json({ message: "2FA is not enabled" });

    admin.totpEnabled = false;
    admin.totpSecret = undefined;
    await admin.save();

    await logAudit({
      action: "TOTP_DISABLED",
      performedBy: { id: admin._id, name: admin.name, email: admin.email },
      details: "Disabled two-factor authentication"
    });

    return res.status(200).json({ message: "2FA disabled successfully" });
  } catch (error) {
    logger.error("Disable TOTP error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { adminRegister, adminLogin, verifyAdmin, refreshAccessToken, logout, createAdmin, getAllAdmins, deleteAdmin, updateAdmin, setupTotp, enableTotp, verifyTotp, disableTotp };