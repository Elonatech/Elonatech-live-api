const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  blogId: {
    type: String,
    required: true
  },
  commentId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  website: {
    type: String,
    default: ''
  },
  // Flags replies posted by an admin from the dashboard, so the public
  // blog page can show an "Elonatech Team" badge instead of a regular name.
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reply', replySchema);
