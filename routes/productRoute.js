const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const upload = require('../lib/multer');
const { verifyToken } = require("../middleware/Admin");
const validate = require("../middleware/validate");
const { createProductSchema, updateProductSchema } = require("../validators/productValidator");
const { cache, clearCache } = require("../middleware/cache");

// Cache product list for 5 minutes (300 seconds)
// After 300s Redis auto-expires the entry and the next request refreshes it
router.get("/", cache(300), productController.getAllProducts);
router.get("/computers", cache(300), productController.getComputers);
router.get("/filter", cache(120), productController.getProductsByFilter);
router.get("/filter/all", cache(120), productController.getAllProductsByFilterForAllCategories);
router.get("/brand", cache(300), productController.getUniqueBrandsAndPriceRange);
router.get("/products/recently-viewed", cache(300), productController.getRecentlyViewedProducts);
router.get("/:id/next", cache(300), productController.getNextProduct);
router.get("/:id/related", cache(300), productController.getRelatedProducts);
router.get("/:id", cache(300), productController.getProductById);

// After any write operation, clear all product cache so users see fresh data

router.post("/create", verifyToken, upload.array('images'), validate(createProductSchema), productController.createProduct);

router.put("/:id/update", verifyToken, validate(updateProductSchema), productController.updateProduct);
router.put("/:id/update/image", verifyToken, upload.array('images'), productController.updateProductImage);
router.delete("/:id", verifyToken, productController.deleteProduct);



module.exports = router;