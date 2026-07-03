/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalogue — list, filter, create, update, delete
 */

/**
 * @swagger
 * /api/v1/product:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Array of all products
 */

/**
 * @swagger
 * /api/v1/product/computers:
 *   get:
 *     summary: Get all computer products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Array of computer products
 */

/**
 * @swagger
 * /api/v1/product/filter:
 *   get:
 *     summary: Filter products by category, brand, price etc.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: brand
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Filtered product list
 */

/**
 * @swagger
 * /api/v1/product/brand:
 *   get:
 *     summary: Get unique brands and price range
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Brands and min/max price
 */

/**
 * @swagger
 * /api/v1/product/{id}:
 *   get:
 *     summary: Get a product by ID or slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: MongoDB ObjectId or slug string
 *     responses:
 *       200:
 *         description: Product object
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/v1/product/{id}/related:
 *   get:
 *     summary: Get related products for a given product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Array of related products
 */

/**
 * @swagger
 * /api/v1/product/create:
 *   post:
 *     summary: Create a new product (admin only)
 *     tags: [Products]
 *     security:
 *       - TokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, price, category]
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               category: { type: string }
 *               brand: { type: string }
 *               description: { type: string }
 *               quantity: { type: number }
 *               images:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/product/{id}/update:
 *   put:
 *     summary: Update product details (admin only)
 *     tags: [Products]
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               category: { type: string }
 *     responses:
 *       200:
 *         description: Product updated
 */

/**
 * @swagger
 * /api/v1/product/{id}:
 *   delete:
 *     summary: Delete a product (admin only)
 *     tags: [Products]
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */

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