const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(

  {
    type: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, required: true },
    relatedId: { type: String, required: true },
    read: { type: Boolean, default: false },
  },

  { timestamps: true }
);


const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;