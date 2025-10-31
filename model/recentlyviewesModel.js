const mongoose = require("mongoose");

const recentlyViewedSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ]
  },
  { timestamps: true }
);

const RecentlyViewed = mongoose.model("RecentlyViewed", recentlyViewedSchema);

module.exports = RecentlyViewed;