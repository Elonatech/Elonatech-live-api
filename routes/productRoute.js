const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const upload = require('../lib/multer');

router.post("/create",  productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/computers", productController.getComputers);
router.get("/filter", productController.getProductsByFilter);
router.get("/filter/all", productController.getAllProductsByFilterForAllCategories);
router.get("/brand", productController.getUniqueBrandsAndPriceRange)
router.get("/:id", productController.getProductById);
router.put("/:id/update", productController.updateProduct);
router.put("/:id/update/image", productController.updateProductImage);
router.delete("/:id", productController.deleteProduct);
router.get("/:id/next", productController.getNextProduct);
router.get("/:id/related", productController.getRelatedProducts);
router.get("/products/recently-viewed", productController.getRecentlyViewedProducts);



module.exports = router;

// upload.array('images'),