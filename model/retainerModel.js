const mongoose = require("mongoose");

const retainerSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, required: true },
    number: { type: String, required: true },
    service: { type: String, required: true },
    days: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
    contract: { type: String },
    frequency: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Responded", "Closed"],
      default: "Pending",
    },

    emailSent: { type: Boolean, default: false },

  },
  { timestamps: true }

);

const Retainer = mongoose.model("Retainer", retainerSchema);

module.exports = Retainer;
