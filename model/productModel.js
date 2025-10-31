const mongoose = require("mongoose");

// 🔹 Basic slug generator
function generateSlug(name) {
  return name
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// 🔹 Subschema for computer specs
const computerPropertySchema = new mongoose.Schema({
  series: String,
  model: String,
  weight: String,
  dimension: String,
  item: String,
  color: String,
  hardware: String,
  os: String,
  processor: String,
  number: String,
  memory: String,
  ram: String,
  drive: String,
  display: String,
  resolution: String,
  graphics: String,
  voltage: String,
  battery: String,
  wireless: String,
});

// 🔹 Main product schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    description: String,
    price: { type: Number, required: true, min: [1, "Price must be at least 1"] },
    odd: String,
    brand: { type: String, required: true },
    quantity: String,
    id: Number,
    category: { type: String, required: true },
    computerProperty: [computerPropertySchema],
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Unique slug generator (needs schema to exist first)
productSchema.statics.generateUniqueSlug = async function (name, existingId = null) {
  let slug = generateSlug(name);
  let uniqueSlug = slug;
  let counter = 1;

  while (await this.findOne({ slug: uniqueSlug, _id: { $ne: existingId } })) {
    uniqueSlug = `${slug}-${counter++}`;
  }

  return uniqueSlug;
};

// ✅ Pre-save hook (auto-slug)
productSchema.pre("save", async function (next) {
  if (!this.slug || this.isModified("name")) {
    this.slug = await this.constructor.generateUniqueSlug(this.name, this._id);
  }
  next();
});

// ✅ Compile model AFTER everything
const Product = mongoose.model("Product", productSchema);

module.exports = Product;