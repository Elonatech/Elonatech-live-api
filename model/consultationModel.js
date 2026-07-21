const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    occupation: { type: String, required: true },
    challenge: { type: String, required: true },
    business: { type: String, required: true },
    cost: { type: String, required: true },
    invest: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Responded", "Closed"],
      default: "Pending",
    },

    emailSent: { type: Boolean, default: false },

  },
  { timestamps: true }

);

const Consultation = mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;
