const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  blogId: {
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

commentSchema.pre('save', function (next) {
  if (this.gender === 'male') {
    this.userImage = 'https://img.freepik.com/premium-photo/default-male-user-icon-blank-profile-image-green-background-profile-picture-icon_962764-98402.jpg';
  } else {
    this.userImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD3OmwXK7xXXVWJZiocRJOasPkHLK27kGGOQ&s';
  }
  next();
});

module.exports = mongoose.model('Comment', commentSchema);
