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

  computerProperty: z.string().optional(),
});

const computerPropertyFields = z.object({
  series: z.string().optional(),
  model: z.string().optional(),
  weight: z.string().optional(),
  dimension: z.string().optional(),
  item: z.string().optional(),
  color: z.string().optional(),
  hardware: z.string().optional(),
  os: z.string().optional(),
  processor: z.string().optional(),
  number: z.string().optional(),
  memory: z.string().optional(),
  ram: z.string().optional(),
  drive: z.string().optional(),
  display: z.string().optional(),
  resolution: z.string().optional(),
  graphics: z.string().optional(),
  voltage: z.string().optional(),
  battery: z.string().optional(),
  wireless: z.string().optional(),
});

// Update allows all fields to be optional — you might only update price or description
const updateProductSchema = createProductSchema.partial().merge(computerPropertyFields);

module.exports = { createProductSchema, updateProductSchema };