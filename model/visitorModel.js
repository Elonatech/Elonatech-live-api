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
    required: true
  }
});

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;