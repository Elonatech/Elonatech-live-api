const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const storage = require("../lib/multer");

router.get("/trends", blogController.getTrends);
router.get("/news", blogController.getNews);
router.get("/", blogController.getBlogs);
router.get("/:id", blogController.getBlogId);
router.get("/news/:id", blogController.getNewsById);
router.get("/trends/:id", blogController.getTrendsById);

router.post(
  "/create",
  storage.single("cloudinary_image"),
  blogController.createBlog
);
router.put(
  "/update/:id",
  storage.single("cloudinary_image"),
  blogController.updateBlogId
);
router.delete("/:id", blogController.deleteBlogId);

module.exports = router;
