const mongoose = require("mongoose");

// One line item captured at checkout time — name and price are stored as a
// snapshot so the order still reads correctly even if the product later
// changes price or is deleted.
const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    company: { type: String },
    email: { type: String, required: true },
    number: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String },
    postal: { type: String },
    notes: { type: String },

    items: { type: [orderItemSchema], default: [] },
    cartTotal: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Cancelled"],
      default: "Pending",
    },

    // Tracks whether the confirmation email actually went out — lets admins
    // see at a glance which orders may need a manual follow-up if email failed.
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
