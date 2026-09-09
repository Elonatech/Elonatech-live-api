const mongoose = require("mongoose");

// One collection holds applications from BOTH feeder forms — ETMPDP Regular
// and ETMPDP Ignite — distinguished by `program`. Fields that only apply to
// one form (areaOfInterest / specialization / programTrack) stay empty on the
// other.
const etmpdpApplicationSchema = new mongoose.Schema(
  {
    // "Regular" is retained for historical records; the Core form now
    // submits "Core".
    program: {
      type: String,
      enum: ["Regular", "Core", "Ignite"],
      required: true,
    },

    // Common fields (both forms)
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    qualification: { type: String },
    statement: { type: String },

    // Interest in the optional Residential Experience (both forms).
    // "" when the applicant left it unanswered.
    residentialInterest: { type: String, default: "" },

    // Regular-only
    areaOfInterest: { type: String },

    // Ignite-only
    specialization: { type: String },
    programTrack: { type: String },

    // Uploaded files (Cloudinary URLs) — CV is required; Siwes letter is
    // optional and only ever supplied by the Ignite form.
    cv_url: { type: String, required: true },
    siwesLetter_url: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending",
    },

    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const EtmpdpApplication = mongoose.model("EtmpdpApplication", etmpdpApplicationSchema);

module.exports = EtmpdpApplication;
