const { z } = require("zod");

// Fields required when creating a product
// price and quantity come as strings from multipart/form-data so we coerce them to numbers
const createProductSchema = z.object({
  name: z.string({ required_error: "Product name is required" }).trim().min(2, "Name must be at least 2 characters"),

  brand: z.string({ required_error: "Brand is required" }).trim().min(1, "Brand is required"),

  price: z.coerce.number({ required_error: "Price is required"}).positive("Price must be a positive number"),

  category: z.string({ required_error: "Category is required"}).trim().min(1, "Category is required"),

  quantity: z.coerce.number().int().nonnegative("Quantity cannot be negative").optional(),

  description: z.string().trim().optional(),

  odd: z.string().trim().optional(),
});

// Update allows all fields to be optional — you might only update price or description
const updateProductSchema = createProductSchema.partial();

module.exports = { createProductSchema, updateProductSchema };