const { z } = require("zod");

// Login schema — both fields required, email must be valid format
// .trim() removes accidental whitespace, .toLowerCase() normalises the email
const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),

  password: z
    .string({ required_error: "Password is required"})
    .min(1, "Password is required"),
});

// Create admin schema — same as login but role must be one of the two allowed values
const createAdminSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),

  role: z.enum(["admin", "superAdmin"], {
    errorMap: () => ({ message: "Role must be either 'admin' or 'superAdmin'" }),
  }),
});


// Register is the same as createAdmin — email, password, and role required
const registerSchema = createAdminSchema;

module.exports = { loginSchema, createAdminSchema, registerSchema };

