const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    number: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    project: { type: String, required: true },
    location: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Responded", "Closed"],
      default: "Pending",
    },

    emailSent: { type: Boolean, default: false },

  },
  { timestamps: true }

);

const Quote = mongoose.model("Quote", quoteSchema);

module.exports = Quote;
