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

// MongoDB deletes notifications on its own once they're 60 days old, so the
// bell doesn't fill up with months-old items. Mongoose creates this index at
// startup; the TTL check itself runs in the database roughly once a minute.
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 24 * 60 * 60 });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;