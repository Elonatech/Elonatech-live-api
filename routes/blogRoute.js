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
