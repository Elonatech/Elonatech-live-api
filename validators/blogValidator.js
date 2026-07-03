const { z } = require("zod");

const VALID_CATEGORIES = ["blog", "trends", "news"];

const categoryEnum = z.enum(VALID_CATEGORIES, {
  errorMap: () => ({ message: "Category must be blog, trends, or news" }),
});

// Handles all the ways category can arrive:
//   - '["trends"]'   → JSON-stringified array (from blogWrite.jsx)
//   - '"news"'       → JSON-stringified plain string
//   - 'news'         → raw plain string (from blogUpdate.jsx)
//   - ''             → empty string when admin skips (treated as undefined for update)
const parseCategory = (val) => {
  if (val === "" || val == null) return undefined;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return val; }
  }
  return val;
};

const createBlogSchema = z.object({
  title: z.string({ required_error: "Title is required" }).trim().min(3, "Title must be at least 3 characters"),
  description: z.string({ required_error: "Description is required" }).trim().min(10, "Description is too short"),
  author: z.string({ required_error: "Author is required" }).trim().min(1, "Author is required"),
  // Required on create — cannot be undefined or empty
  category: z.preprocess(
    parseCategory,
    z.union([
      categoryEnum,
      z.array(categoryEnum).min(1),
    ])
  ),
});

const updateBlogSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().trim().min(10, "Description is too short").optional(),
  author: z.string().trim().min(1, "Author is required").optional(),
  // Optional on update — empty string or missing means "don't change category"
  category: z.preprocess(
    parseCategory,
    z.union([
      categoryEnum,
      z.array(categoryEnum).min(1),
    ]).optional()
  ),
});

module.exports = { createBlogSchema, updateBlogSchema };
