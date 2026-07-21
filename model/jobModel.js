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

    numberOfOpenings: {
      type: Number,
      required: true
    },

    employmentType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Internship", "Freelance", "Mentorship", "Volunteer", "Other"],
      required: true
    },

    workplaceType: {
      type: String,
      enum: ["On-site", "Hybrid", "Remote"],
      required: true
    },

    jobSummary: {
      type: String,
      required: true
    },

    jobLevel: {
      type: String,
      enum: ["No Experience", "Internship & Graduate", "Entry-level", "Mid-level", "Senior-level", "Executive-level"],
      required: true
    },

    minimumQualification: {
      type: String,
      required: true
    },


    jobDescription: {
      type: String,
      required: true
    },

    // Rich content sections — optional so existing postings still validate.
    // Admins type bullet points / paragraphs; the public page preserves the
    // line breaks.
    responsibilities: {
      type: String
    },

    requirements: {
      type: String
    },

    benefits: {
      type: String
    },

    status: {
      type: String,
      enum: ["Active", "Draft", "Closed"],
      default: "Draft"
    },

     hiringTimeline: {
      type: String,
      enum: ["2 weeks", "1 Month", "2 Months", "3 Months"],
      default: "2 weeks"
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
