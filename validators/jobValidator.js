const { z } = require("zod");

const JOB_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship", "Freelance"];
const JOB_STATUSES = ["Active", "Draft", "Closed"];

const createJobSchema = z.object({
  title: z.string({ required_error: "Title is required" }).trim().min(2, "Title must be at least 2 characters"),
  location: z.string({ required_error: "Location is required" }).trim().min(2, "Location is required"),
  type: z.enum(JOB_TYPES, { errorMap: () => ({ message: `Type must be one of: ${JOB_TYPES.join(", ")}` }) }),
  description: z.string({ required_error: "Description is required" }).trim().min(10, "Description is too short"),
  status: z.enum(JOB_STATUSES, { errorMap: () => ({ message: `Status must be one of: ${JOB_STATUSES.join(", ")}` }) }).optional(),
});

const updateJobSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").optional(),
  location: z.string().trim().min(2, "Location is required").optional(),
  type: z.enum(JOB_TYPES, { errorMap: () => ({ message: `Type must be one of: ${JOB_TYPES.join(", ")}` }) }).optional(),
  description: z.string().trim().min(10, "Description is too short").optional(),
  status: z.enum(JOB_STATUSES, { errorMap: () => ({ message: `Status must be one of: ${JOB_STATUSES.join(", ")}` }) }).optional(),
});

module.exports = { createJobSchema, updateJobSchema };
