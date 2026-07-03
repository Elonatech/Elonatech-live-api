const { z } = require("zod");

const createBlogSchema = z.object({
  title: z.string({ required_error: "Title is required" }).trim().min(3, "Title must be at least 3 characters"),

  description: z.string({ required_error: "Description is required" }).trim().min(10, "Description is too short"),

  author: z.string({ required_error: "Author is required" }).trim().min(1, "Author is required"),

  // category arrives from form-data as a JSON string e.g. '["trends"]'
  // preprocess parses it first so the enum check gets the real value
  category: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try { return JSON.parse(val); } catch { return val; }
      }
      return val;
    },
    z.union([
      z.enum(["blog", "trends", "news"], { errorMap: () => ({ message: "Category must be blog, trends, or news" }) }),
      z.array(z.enum(["blog", "trends", "news"], { errorMap: () => ({ message: "Category must be blog, trends, or news" }) })).min(1),
    ])
  ),
});

// Update allows partial fields
const updateBlogSchema = createBlogSchema.partial();

module.exports = { createBlogSchema, updateBlogSchema };

// elonatechnigeria@gmail.com