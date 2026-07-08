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
      enum: ["blog", "trends", "news"],
      default: ["blog"],
      required: true
    },

    slug: {
      type: String,
      unique: true,
    },


    cloudinary_id: {
      type: String,
      required: true
    },

  },
  { timestamps: true }
);

blogSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();
  const base = slugify(this.title, { lower: true, strict: true });
  let slug = base;
  let count = 1;
  while (await mongoose.model("Blog").exists({ slug, _id: { $ne: this._id } })) {
    slug = `${base}-${count++}`;
  }
  this.slug = slug;
  next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
