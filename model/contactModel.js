const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    number: { type: String, required: true },
    message: { type: String, required: true },
    

    status: {
      type: String,
      enum: ["New", "Read", "Replied", "Closed"],
      default: "New",
    },

    emailSent: { type: Boolean, default: false },

  },
  { timestamps: true }

);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
