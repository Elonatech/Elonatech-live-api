const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const storage = require("../lib/multer");

router.get("/", blogController.getBlogs);
router.get("/:id", blogController.getNewsById);
router.post(
  "/create",
  storage.single("cloudinary_id"),
  blogController.createBlog
);
router.put(
  "/update/:id",
  storage.single("cloudinary_id"),
  blogController.updateBlogId
);
router.delete("/:id", blogController.deleteBlogId);

module.exports = router;
