const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },

    // Snapshot of the job title at time of application, so the record still
    // reads correctly even if the posting is later edited or deleted.
    jobTitle: { type: String },

    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    number: { type: String, required: true },
    gender: { type: String },
    address: { type: String },
    dob: { type: String },
    skill: { type: [String], default: [] },
    letter: { type: String },

    // The applicant's current employment status from the form (e.g.
    // "Unemployed"). Deliberately NOT `status` — that field below is the
    // admin's review workflow and has its own enum.
    employmentStatus: { type: String },

    cv_url: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending"
    },

    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

module.exports = JobApplication;
