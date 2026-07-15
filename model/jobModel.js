const mongoose = require("mongoose");
const slugify = require("slugify");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Internship", "Freelance"],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["Active", "Draft", "Closed"],
      default: "Draft"
    },

    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

jobSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();
  const base = slugify(this.title, { lower: true, strict: true });
  let slug = base;
  let count = 1;
  while (await mongoose.model("Job").exists({ slug, _id: { $ne: this._id } })) {
    slug = `${base}-${count++}`;
  }
  this.slug = slug;
  next();
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
