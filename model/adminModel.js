const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ""
  },
  isMaster: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "superAdmin"],
    default: "admin"
  },
  totpSecret: {
    type: String,
    default: ""
  },

  totpEnabled: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;