const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      "LOGIN",
      "LOGOUT",
      "CREATE_ADMIN",
      "UPDATE_ADMIN",
      "DELETE_ADMIN",
      "TOTP_SETUP",
      "TOTP_ENABLED",
      "TOTP_LOGIN",
      "CREATE_BLOG",
      "UPDATE_BLOG",
      "DELETE_BLOG",
      "CREATE_PRODUCT",
      "UPDATE_PRODUCT",
      "DELETE_PRODUCT"
    ]
  },
  performedBy: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    name: { type: String },
    email: { type: String }
  },
  target: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    name: { type: String },
    email: { type: String }
  },
  details: { type: String, default: "" }
}, { timestamps: true });

// Auto-delete logs older than 90 days
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const AuditLog = mongoose.model("AuditLog", AuditLogSchema);
module.exports = AuditLog;
