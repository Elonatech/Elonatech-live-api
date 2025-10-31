const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const { token_key } = require("../config/key");
const jwt = require("jsonwebtoken");

// Sign Up
const adminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Fill All Field" });
    }
    // check if admin already exist
    const oldadmin = await Admin.findOne({ email });
    if (oldadmin) {
      return res.status(409).json({ message: "Admin Already Exist" });
    }
    //Encrypt admin password
    const encryptedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: encryptedPassword });
    return res.status(201).json({ admin });
  } catch (error) {
    console.log(error);
  }
};

//  Sign In
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Fill All Required Fields");
  }

  // check if Admin exist
  const admin = await Admin.findOne({ email: email });
  if (!admin) {
    return res.status(400).send("Admin does not exist");
  }

  // compare passwords
  const passwordValid = await bcrypt.compare(password, admin.password);
  if (!passwordValid) {
    return res.status(400).send("Incorrect Email or Password");
  }

  const payload = { id: Admin._id };
  // Admin jwt
  const token = jwt.sign(payload, token_key, { expiresIn: "3600" });
  return res
    .status(200)
    .json({ message: "Login Successful", email: admin.email, access: token });
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
    console.error("Error verifying admin:", error);
    return res.status(500).json({ isAdmin: false, message: "Error verifying admin" });
  }
};

module.exports = { adminRegister, adminLogin, verifyAdmin };