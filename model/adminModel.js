const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ""
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
  }
});

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;