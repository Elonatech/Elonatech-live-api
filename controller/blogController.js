const Blog = require("../model/blogModel");
const cloudinary = require("../lib/cloudinary");
const mongoose = require("mongoose");
const streamifier = require('streamifier');
const { clearCache } = require("../middleware/cache");
const logger = require("../lib/logger");
const logAudit = require("../lib/logAudit");


const createBlog = async (req, res) => {
  try {
    let { title, description, author, category } = req.body;

    // Parse category if it's JSON stringified (since you're using form-data)
    if (typeof category === "string") {
      try {
        category = JSON.parse(category);
      } catch {
        category = [category];
      }
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload to Cloudinary
    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "Blogs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await uploadToCloudinary(req.file.buffer);

    // ✅ Save only the image URL to DB
    const newBlog = await Blog.create({
      title,
      description,
      author,
      category,
      cloudinary_id: result.secure_url,
    });
    await logAudit({ action: "CREATE_BLOG", performedBy: { id: req.user.id, name: req.user.name, email: req.user.email }, details: `Created blog: "${title}"` });
    logger.info("Blog created", { blogId: newBlog._id, title: newBlog.title });

    await clearCache("/api/v1/blog");
    return res.status(201).json({
      message: "Blog Created Successfully",
      data: newBlog,
    });
  } catch (error) {
    logger.error("CreateBlogError:", { error });
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get All Blogs
const getBlogs = async (req, res) => {
  try {
    const getAllBlogs = await Blog.find().sort({ createdAt: -1 }).select("-description");
    return res.status(200).json({ success: true, count: getAllBlogs.length, getAllBlogs });
  } catch (error) {
    logger.error("Get blogs error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get blogs by trends
const getTrends = async (req, res) => {
  try {
    const getAllTrends = await Blog.find({ category: "trends" }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: getAllTrends.length, getAllTrends });
  } catch (error) {
    logger.error("Get Trends error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get blogs by news
const getNews = async (req, res) => {
  try {
    const getAllNews = await Blog.find({ category: "news" }).sort({ createdAt: -1 });


    return res.status(200).json({ success: true, count: getAllNews.length, getAllNews });
  } catch (error) {
    logger.error("Get News error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

//get news by id

// const getNewsById = async (req, res) => {
//   try {
//     const { id } = req.params; // Extract ID from request parameters
//     const news = await Blog.findById(id); // Find news by ID

//     if (!news) {
//       return res.status(404).send("news not found");
//     }

//     return res.status(200).json(news);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Server Error");
//   }
// };

const getNewsById = async (req, res) => {
  try {
    const identifier = req.params.id;
    let news;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      news = await Blog.findById(identifier);
    } else {
      news = await Blog.findOne({ slug: identifier });
    }

    if (!news) {
      return res.status(404).json({ message: "News Not Found" });
    }

    return res.status(200).json(news);
  } catch (error) {
    logger.error("Get news by id error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get Blog By Id

const getTrendsById = async (req, res) => {
  try {
    const identifier = req.params.id;
    let trends;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      trends = await Blog.findById(identifier);
    } else {
      trends = await Blog.findOne({ slug: identifier });
    }

    if (!trends) {
      return res.status(404).json({ message: "Trends Not Found" });
    }

    return res.status(200).json(trends);
  } catch (error) {
    logger.error("Get trends by id error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

const getBlogId = async (req, res) => {
  try {
    const identifier = req.params.id;
    let blog;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      blog = await Blog.findById(identifier);
    } else {
      blog = await Blog.findOne({ slug: identifier });
    }

    if (!blog) {
      return res.status(404).json({ message: "Blog Not Found" });
    }

    return res.status(200).json(blog);
  } catch (error) {
    logger.error("Get blog by id error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateBlogId = async (req, res) => {
  try {
    logger.info("REQ FILE:", { file: req.file });

    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    let result;

    if (req.file) {
      // Upload file from buffer using streamifier
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) resolve(result);
            else reject(error);
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      result = await streamUpload(req);
    }

    const data = {
      title: req.body.title || blog.title,
      description: req.body.description || blog.description,
      author: req.body.author || blog.author,
      category: req.body.category || blog.category,
      cloudinary_id: result ? result.secure_url : blog.cloudinary_id, // keep old image if no new file
    };

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });
    await clearCache("/api/v1/blog");
    await clearCache(`/api/v1/blog/${req.params.id}`);
    await logAudit({ action: "UPDATE_BLOG", performedBy: { id: req.user.id, name: req.user.name, email: req.user.email }, details: `Updated blog: "${updatedBlog.title}"` });
    res.status(200).json({ success: true, data: updatedBlog });
  } catch (error) {
    logger.error("Update blog error", { error });
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// const deleteBlogId = async (req, res) => {
//   let blog = await Blog.findById(req.params.id);
//   await cloudinary.uploader.destroy(blog.cloudinary_id);
//   await blog.deleteOne();
//   return res.status(200).send("Blog Successfully Deleted");
// };

const deleteBlogId = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    const title = blog.title;
    await cloudinary.uploader.destroy(blog.cloudinary_id)
    await blog.deleteOne()
    await clearCache("/api/v1/blog");
    await clearCache(`/api/v1/blog/${req.params.id}`);
    await logAudit({ action: "DELETE_BLOG", performedBy: { id: req.user.id, name: req.user.name, email: req.user.email }, details: `Deleted blog: "${title}"` });
    return res.status(200).json({ message: "Blog Successfully Deleted" });
  } catch (error) {
    logger.error("Delete blog error", { error });
    return res.status(500).json({ message: "Server Error" });

  }
}

module.exports = {
  createBlog,
  getBlogs,
  getBlogId,
  updateBlogId,
  deleteBlogId,
  getTrends,
  getNews,
  getNewsById,
  getTrendsById
};
