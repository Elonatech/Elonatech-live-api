const mongoose = require("mongoose")

const RefreshTokenSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.ObjectId,
    ref: "Admin",
    required: true,
  },

  token: {
    type: String,
    required: true,
    unique: true,
  },

  expiresAt: {
    type: Date,
    required: true,
  },

}, { timestamps: true })


// MongoDB will auto-delete documents once expiresAt is reached
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema)
module.exports = RefreshToken