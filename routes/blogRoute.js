/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog, news, and trends posts
 */

/**
 * @swagger
 * /api/v1/blog:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Array of all blog posts sorted newest first
 */

/**
 * @swagger
 * /api/v1/blog/trends:
 *   get:
 *     summary: Get all trends posts
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Array of trends posts
 */

/**
 * @swagger
 * /api/v1/blog/news:
 *   get:
 *     summary: Get all news posts
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Array of news posts
 */

/**
 * @swagger
 * /api/v1/blog/{id}:
 *   get:
 *     summary: Get a blog post by ID or slug
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Blog post object
 *       404:
 *         description: Blog not found
 */

/**
 * @swagger
 * /api/v1/blog/create:
 *   post:
 *     summary: Create a new blog post (admin only)
 *     tags: [Blogs]
 *     security:
 *       - TokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, description, author, category]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               author: { type: string }
 *               category:
 *                 type: string
 *                 enum: [blog, trends, news]
 *               cloudinary_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Blog created
 *       400:
 *         description: Validation error or missing image
 */

/**
 * @swagger
 * /api/v1/blog/update/{id}:
 *   put:
 *     summary: Update a blog post (admin only)
 *     tags: [Blogs]
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               author: { type: string }
 *               category: { type: string }
 *               cloudinary_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Blog updated
 */

/**
 * @swagger
 * /api/v1/blog/{id}:
 *   delete:
 *     summary: Delete a blog post (admin only)
 *     tags: [Blogs]
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Blog deleted
 *       404:
 *         description: Blog not found
 */

const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const storage = require("../lib/multer");
const { verifyToken } = require("../middleware/Admin");
const validate = require("../middleware/validate");
const { createBlogSchema, updateBlogSchema } = require("../validators/blogValidator");
const { cache, clearCache } = require("../middleware/cache");


// Cache blog lists for 5 minutes

router.get("/trends", cache(300), blogController.getTrends);
router.get("/news", cache(300), blogController.getNews);
router.get("/", cache(300), blogController.getBlogs);
router.get("/:id", cache(300), blogController.getBlogId);
router.get("/news/:id", cache(300), blogController.getNewsById);
router.get("/trends/:id", cache(300), blogController.getTrendsById);

router.post("/create", verifyToken, storage.single("cloudinary_image"), validate(createBlogSchema), blogController.createBlog);
router.put("/update/:id", verifyToken, storage.single("cloudinary_image"), validate(updateBlogSchema), blogController.updateBlogId);
router.delete("/:id", verifyToken, blogController.deleteBlogId);

module.exports = router;
