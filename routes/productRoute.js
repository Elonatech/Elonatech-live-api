const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const upload = require('../lib/multer');
const verifyToken = require("../middleware/Admin");

router.post("/create", verifyToken, upload.array('images'), productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/computers", productController.getComputers);
router.get("/filter", productController.getProductsByFilter);
router.get("/filter/all", productController.getAllProductsByFilterForAllCategories);
router.get("/brand", productController.getUniqueBrandsAndPriceRange);
router.get("/products/recently-viewed", productController.getRecentlyViewedProducts);
router.get("/:id/next", productController.getNextProduct);
router.get("/:id/related", productController.getRelatedProducts);
router.get("/:id", productController.getProductById);
router.put("/:id/update", verifyToken, productController.updateProduct);
router.put("/:id/update/image", verifyToken, upload.array('images'), productController.updateProductImage);
router.delete("/:id", verifyToken, productController.deleteProduct);



module.exports = router;