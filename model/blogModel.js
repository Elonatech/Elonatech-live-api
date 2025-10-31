const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    author: {
      type: String,
      required: true
    },

    category: {
      type: [String],
      required: true
    },

    slug: {
      type: String,
      unique: true,
    },

    cloudinary_id: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
