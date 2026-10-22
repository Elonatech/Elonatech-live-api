const { z } = require("zod");

const PROGRAMS = ["Core", "Ignite"];
const STATUSES = ["valid", "revoked"];

const nameField = z
  .string({ required_error: "Full name is required" })
  .trim()
  .min(2, "Full name must be at least 2 characters")
  .max(100, "Full name must be at most 100 characters");

const programField = z.enum(PROGRAMS, {
  errorMap: () => ({ message: `Program must be one of: ${PROGRAMS.join(", ")}` }),
});

// A certificate can't be issued for a date that hasn't happened yet. A day of
// slack keeps a late-evening entry in another timezone from being refused.
const completionDateField = z.coerce
  .date({ invalid_type_error: "Completion date is not a valid date", required_error: "Completion date is required" })
  .refine((d) => d.getTime() <= Date.now() + 24 * 60 * 60 * 1000, "Completion date can't be in the future");

const enrollmentDateField = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.coerce.date({ invalid_type_error: "Enrollment date is not a valid date" }).optional()
);

// Free-text lines on the certificate. An empty string is allowed (it clears
// the field), so the form can remove a value that was entered by mistake.
const textLine = (label, max) =>
  z.string().trim().max(max, `${label} must be at most ${max} characters`).optional();

const issueDateField = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.coerce.date({ invalid_type_error: "Date of issue is not a valid date" }).optional()
);

const certificateFields = {
  fullName: nameField,
  program: programField,
  completionDate: completionDateField,
  enrollmentDate: enrollmentDateField,
  issueDate: issueDateField,
  duration: textLine("Duration", 40),
  pathwayLevel: textLine("Pathway level", 80),
  specialization: textLine("Specialization", 120),
};

const createCertificateSchema = z
  .object(certificateFields)
  .refine((d) => !d.enrollmentDate || d.enrollmentDate <= d.completionDate, {
    message: "Enrollment date must be on or before the completion date",
    path: ["enrollmentDate"],
  });

// A whole cohort in one request.
const bulkCertificateSchema = z.object({
  certificates: z
    .array(z.object(certificateFields), { required_error: "certificates must be a list" })
    .min(1, "Add at least one certificate")
    .max(200, "Add at most 200 certificates at a time"),
});

const updateCertificateSchema = z
  .object({
    fullName: nameField,
    program: programField,
    completionDate: completionDateField,
    enrollmentDate: enrollmentDateField,
    issueDate: issueDateField,
    duration: textLine("Duration", 40),
    pathwayLevel: textLine("Pathway level", 80),
    specialization: textLine("Specialization", 120),
    status: z.enum(STATUSES, {
      errorMap: () => ({ message: `Status must be one of: ${STATUSES.join(", ")}` }),
    }),
    revokedReason: z.string().trim().max(300, "Reason must be at most 300 characters").optional(),
  })
  .partial();

module.exports = { createCertificateSchema, bulkCertificateSchema, updateCertificateSchema, PROGRAMS, STATUSES };
