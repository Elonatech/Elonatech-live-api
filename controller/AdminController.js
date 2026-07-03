const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const config = require("../config/key");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../model/refreshTokenModel");
const logger = require("../lib/logger");

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

    const payload = { id: admin._id, role: admin.role };
    // Admin jwt
    const accessToken = jwt.sign(payload, config.token_key, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, config.refresh_token_key, { expiresIn: "7d" });


    // Save refresh token to DB
    await RefreshToken.create({
      adminId: admin._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Send refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "Login Successful", email: admin.email, access: accessToken, role: admin.role });
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

    const payload = { id: decoded.id, role: decoded.role };
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
      sameSite: "strict",
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
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error("Logout error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const encryptedPassword = await bcrypt.hash(password, 10)
    const admin = await Admin.create({ name, email, password: encryptedPassword, role })
    return res.status(201).json({ success: true, message: "Admin created successfully", data: admin })
  } catch (error) {
    logger.error("Create admin error", { error });
    return res.status(500).json({ sucess: false, message: "Internal Server Error" })
  }
}

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, "name email role createdAt");
    return res.status(200).json({ admins });
  } catch (error) {
    logger.error("Get all admins error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (admin.role === "superAdmin") {
      return res.status(403).json({ message: "Cannot delete super admin" });
    }
    await Admin.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    logger.error("Delete admin error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};


module.exports = { adminRegister, adminLogin, verifyAdmin, refreshAccessToken, logout, createAdmin, getAllAdmins, deleteAdmin };