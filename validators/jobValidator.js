const { z } = require("zod");

const JOB_EMPLOYMENTTYPE = ["Full-Time", "Part-Time", "Contract", "Internship", "Freelance", "Mentorship", "Volunteer", "Other"];
const JOB_STATUSES = ["Active", "Draft", "Closed"];
const JOB_WORKPLACETYPE = ["On-site", "Hybrid", "Remote"];
const JOB_JOBLEVEL = ["No Experience", "Internship & Graduate", "Entry-level", "Mid-level", "Senior-level", "Executive-level"];
const JOB_HIRINGTIMELINE = ["2 weeks", "1 Month", "2 Months", "3 Months"];

const createJobSchema = z.object({
  title: z.string({ required_error: "Title is required" }).trim().min(2, "Title must be at least 2 characters"),

  location: z.string({ required_error: "Location is required" }).trim().min(2, "Location is required"),

  numberOfOpenings: z.coerce
    .number({ required_error: "Number of openings is required" })
    .int("Number of openings must be a whole number")
    .min(1, "Number of openings must be at least 1"),

  employmentType: z.enum(JOB_EMPLOYMENTTYPE, { errorMap: () => ({ message: `Employment type must be one of: ${JOB_EMPLOYMENTTYPE.join(", ")}` }) }),

  workplaceType: z.enum(JOB_WORKPLACETYPE, { errorMap: () => ({ message: `Workplace type must be one of: ${JOB_WORKPLACETYPE.join(", ")}` }) }),

  jobLevel: z.enum(JOB_JOBLEVEL, { errorMap: () => ({ message: `Job level must be one of: ${JOB_JOBLEVEL.join(", ")}` }) }),

  minimumQualification: z.string({ required_error: "Minimum qualification is required" }).trim().min(2, "Minimum qualification is required"),

  jobSummary: z.string({ required_error: "Job summary is required" }).trim().min(10, "Job summary is too short"),

  jobDescription: z.string({ required_error: "Job description is required" }).trim().min(10, "Job description is too short"),

  status: z.enum(JOB_STATUSES, { errorMap: () => ({ message: `Status must be one of: ${JOB_STATUSES.join(", ")}` }) }).optional(),

  hiringTimeline: z.enum(JOB_HIRINGTIMELINE, { errorMap: () => ({ message: `Hiring timeline must be one of: ${JOB_HIRINGTIMELINE.join(", ")}` }) }).optional(),
});

const updateJobSchema = createJobSchema.partial();

module.exports = { createJobSchema, updateJobSchema };
