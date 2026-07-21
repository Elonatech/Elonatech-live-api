const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },


    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Responded", "Closed"],
      default: "Pending",
    },

    emailSent: { type: Boolean, default: false },

  },
  { timestamps: true }

);

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = Subscriber;
