const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true,
  },
  visitDate: {
    type: Date,
    default: Date.now,
    required: true,
  }
});

visitorSchema.index({ visitDate: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;