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
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female']
  },
  userImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

replySchema.pre('save', function (next) {
  if (this.gender === 'male') {
    this.userImage = 'https://c8.alamy.com/comp/2G7FT9B/default-avatar-photo-placeholder-grey-profile-picture-icon-man-in-t-shirt-2G7FT9B.jpg';
  } else {
    this.userImage = 'https://static.vecteezy.com/system/resources/previews/039/845/007/non_2x/placeholder-avatar-female-person-default-woman-avatar-image-gray-profile-anonymous-face-picture-illustration-isolated-on-white-vector.jpg';
  }
  next();
});

module.exports = mongoose.model('Reply', replySchema);