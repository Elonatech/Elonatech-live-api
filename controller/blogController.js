const Blog = require("../model/blogModel");
const cloudinary = require("../lib/cloudinary");
const mongoose = require("mongoose");
const streamifier = require('streamifier');
const sanitizeHtml = require("sanitize-html");
const { clearCache } = require("../middleware/cache");
const logger = require("../lib/logger");
const logAudit = require("../lib/logAudit");

// Strips HTML tags from the rich-text description and truncates on a word
// boundary, for use as a short card preview without shipping full HTML.
const makeExcerpt = (html, maxLength = 150) => {
  const plainText = sanitizeHtml(html || "", { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
};

// Query filter for what public-facing endpoints should return —
// hides drafts and future-scheduled posts.
const visibleToPublic = () => ({
  status: { $in: ["scheduled", "published"] },
  publishAt: { $lte: new Date() },
});

// Flips any due "scheduled" post over to "published" in the DB.
// Public visibility is already correct without this (visibleToPublic() checks
// publishAt directly), but the stored status field otherwise only updates the
// next time that document happens to be saved — so an admin could see a post
// stuck reading "scheduled" long after it actually went live. Called from the
// admin routes (self-healing on read) so no separate cron/scheduler is needed.
const settleDuePosts = () =>
  Blog.updateMany(
    { status: "scheduled", publishAt: { $lte: new Date() } },
    { $set: { status: "published" } }
  );

const createBlog = async (req, res) => {
  try {
    let { title, description, author, category, publishAt } = req.body;

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

    const scheduledDate = publishAt ? new Date(publishAt) : new Date();
    const status = scheduledDate > new Date() ? "scheduled" : "published";

    const newBlog = await Blog.create({
      title,
      description,
      author,
      category,
      cloudinary_id: result.secure_url,
      publishAt: scheduledDate,
      status,
    });

    await logAudit({
      action: status === "scheduled" ? "SCHEDULE_BLOG" : "CREATE_BLOG",
      performedBy: { id: req.user.id, name: req.user.name, email: req.user.email },
      details:
        status === "scheduled"
          ? `Scheduled blog: "${title}" for ${scheduledDate.toISOString()}`
          : `Created blog: "${title}"`,
    });
    logger.info("Blog created", { blogId: newBlog._id, title: newBlog.title, status });

    if (status === "published") {
      await clearCache("/api/v1/blog");
    }

    return res.status(201).json({
      message: status === "scheduled" ? "Blog Scheduled Successfully" : "Blog Created Successfully",
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

// Get All Blogs (admin) — every status, every category, no cache.
// Deliberately a separate route from the public GET / so the public cache
// (keyed only by URL) can never end up serving an admin's unfiltered
// response to a public visitor.
const getBlogsAdmin = async (req, res) => {
  try {
    await settleDuePosts();
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    logger.error("Get blogs (admin) error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get one blog by id/slug (admin) — unfiltered, for populating the edit form
// regardless of status. Not cached, same reasoning as getBlogsAdmin above.
const getBlogByIdAdmin = async (req, res) => {
  try {
    await settleDuePosts();
    const identifier = req.params.id;
    const blog = mongoose.Types.ObjectId.isValid(identifier)
      ? await Blog.findById(identifier)
      : await Blog.findOne({ slug: identifier });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    logger.error("Get blog by id (admin) error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// The 5 static list-endpoint cache keys. Per-post "/:id" caches aren't
// included — Upstash's free tier blocks the KEYS command (see middleware/cache.js),
// so we can't enumerate/wildcard-clear those; they just expire on their own
// 5-minute TTL. This covers the case that actually matters: a post edited or
// deleted straight in the database (bypassing the API, so the normal
// create/update/delete cache-busting never ran) still showing up in a listing.
const BLOG_LIST_CACHE_KEYS = [
  "/api/v1/blog",
  "/api/v1/blog/trends",
  "/api/v1/blog/news",
  "/api/v1/blog/info",
  "/api/v1/blog/editorial",
];

const clearBlogCaches = async (req, res) => {
  try {
    await Promise.all(BLOG_LIST_CACHE_KEYS.map((key) => clearCache(key)));
    logger.info("Blog list caches cleared manually", {
      by: { id: req.user.id, name: req.user.name, email: req.user.email },
    });
    return res.status(200).json({ success: true, message: "Blog list caches cleared", keys: BLOG_LIST_CACHE_KEYS });
  } catch (error) {
    logger.error("Clear blog caches error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get All Blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find(visibleToPublic()).sort({ createdAt: -1 }).lean();
    const getAllBlogs = blogs.map(({ description, ...rest }) => ({
      ...rest,
      excerpt: makeExcerpt(description),
    }));
    return res.status(200).json({ success: true, count: getAllBlogs.length, getAllBlogs });
  } catch (error) {
    logger.error("Get blogs error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get blogs by trends
const getTrends = async (req, res) => {
  try {
    const getAllTrends = await Blog.find({ category: "trends", ...visibleToPublic() }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: getAllTrends.length, getAllTrends });
  } catch (error) {
    logger.error("Get Trends error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get blogs by news
const getNews = async (req, res) => {
  try {
    const getAllNews = await Blog.find({ category: "news", ...visibleToPublic() }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: getAllNews.length, getAllNews });
  } catch (error) {
    logger.error("Get News error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get blogs by info
const getInfo = async (req, res) => {
  try {
    const getAllInfo = await Blog.find({ category: "info", ...visibleToPublic() }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: getAllInfo.length, getAllInfo });
  } catch (error) {
    logger.error("Get Info error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get blogs by editorial
const getEditorial = async (req, res) => {
  try {
    const getAllEditorial = await Blog.find({ category: "editorial", ...visibleToPublic() }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: getAllEditorial.length, getAllEditorial });
  } catch (error) {
    logger.error("Get Editorial error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get news by id — public read, so visibility filter applies to BOTH lookup branches
const getNewsById = async (req, res) => {
  try {
    const identifier = req.params.id;
    let news;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      news = await Blog.findOne({ _id: identifier, ...visibleToPublic() });
    } else {
      news = await Blog.findOne({ slug: identifier, ...visibleToPublic() });
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

const getTrendsById = async (req, res) => {
  try {
    const identifier = req.params.id;
    let trends;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      trends = await Blog.findOne({ _id: identifier, ...visibleToPublic() });
    } else {
      trends = await Blog.findOne({ slug: identifier, ...visibleToPublic() });
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

const getInfoById = async (req, res) => {
  try {
    const identifier = req.params.id;
    let info;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      info = await Blog.findOne({ _id: identifier, ...visibleToPublic() });
    } else {
      info = await Blog.findOne({ slug: identifier, ...visibleToPublic() });
    }

    if (!info) {
      return res.status(404).json({ message: "Info Not Found" });
    }

    return res.status(200).json(info);
  } catch (error) {
    logger.error("Get info by id error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

const getEditorialById = async (req, res) => {
  try {
    const identifier = req.params.id;
    let editorial;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      editorial = await Blog.findOne({ _id: identifier, ...visibleToPublic() });
    } else {
      editorial = await Blog.findOne({ slug: identifier, ...visibleToPublic() });
    }

    if (!editorial) {
      return res.status(404).json({ message: "Editorial Not Found" });
    }

    return res.status(200).json(editorial);
  } catch (error) {
    logger.error("Get editorial by id error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

const getBlogId = async (req, res) => {
  try {
    const identifier = req.params.id;
    let blog;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      blog = await Blog.findOne({ _id: identifier, ...visibleToPublic() });
    } else {
      blog = await Blog.findOne({ slug: identifier, ...visibleToPublic() });
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

// Admin edit — deliberately NO visibility filter here.
// An admin must be able to open a draft or future-scheduled post to edit/reschedule it.
const updateBlogId = async (req, res) => {
  try {
    logger.info("REQ FILE:", { file: req.file });

    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    let result;

    if (req.file) {
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
      cloudinary_id: result ? result.secure_url : blog.cloudinary_id,
    };

    // Only touch scheduling if the request actually includes it —
    // otherwise a normal content edit shouldn't accidentally reschedule the post.
    if (req.body.publishAt) {
      const newPublishAt = new Date(req.body.publishAt);
      data.publishAt = newPublishAt;
      data.status = newPublishAt > new Date() ? "scheduled" : "published";
    } else if (req.body.status && ["draft", "scheduled", "published"].includes(req.body.status)) {
      // allow explicit status changes too, e.g. admin manually publishing a draft early
      data.status = req.body.status;
      if (req.body.status === "published") {
        data.publishAt = new Date();
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });

    await clearCache("/api/v1/blog");
    await clearCache(`/api/v1/blog/${req.params.id}`);

    await logAudit({
      action: data.status && data.status !== blog.status ? "RESCHEDULE_BLOG" : "UPDATE_BLOG",
      performedBy: { id: req.user.id, name: req.user.name, email: req.user.email },
      details:
        data.status && data.status !== blog.status
          ? `Changed blog "${updatedBlog.title}" status: ${blog.status} → ${data.status}`
          : `Updated blog: "${updatedBlog.title}"`,
    });

    res.status(200).json({ success: true, data: updatedBlog });
  } catch (error) {
    logger.error("Update blog error", { error });
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

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
  getBlogsAdmin,
  getBlogByIdAdmin,
  clearBlogCaches,
  getBlogId,
  updateBlogId,
  deleteBlogId,
  getTrends,
  getNews,
  getInfo,
  getEditorial,
  getNewsById,
  getTrendsById,
  getInfoById,
  getEditorialById
};