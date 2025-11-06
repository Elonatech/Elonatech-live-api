const Blog = require("../model/blogModel");
const cloudinary = require("../lib/cloudinary");
const mongoose = require("mongoose");
const streamifier = require('streamifier');

const createBlog = async (req, res) => {
  try {
    const { title, description, author, category } = req.body;

    if (!title || !description || !author || !category) {
      return res.status(400).json({ message: "All fields are required" });
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

    const newBlog = await Blog.create({
      title,
      description,
      author,
      category,
      cloudinary_image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    console.log('new-blog', newBlog);
    

    return res.status(201).json({
      message: "Blog Created Successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}

// Get All Blogs
const getBlogs = async (req, res) => {
  const getAllBlogs = await Blog.find().sort({ createdAt: -1 });

  if (!getAllBlogs) {
    return res.status(400).send("Bad request");
  }
  return res.status(200).json({ getAllBlogs });
};

// Get blogs by trends
const getTrends = async (req, res) => {
  const getAllTrends = await Blog.find({ category: "trends" }).sort({ createdAt: -1 });

  if (!getAllTrends) {
    return res.status(400).send("Bad request");
  }
  return res.status(200).json({ getAllTrends });
};

// Get blogs by news
const getNews = async (req, res) => {
  const getAllNews = await Blog.find({ category: "news" }).sort({ createdAt: -1 });

  if (!getAllNews) {
    return res.status(400).send("Bad request");
  }
  return res.status(200).json({ getAllNews });
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
    const identifier = req.params.id; ``
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
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// const getTrendsById = async (req, res) => {
//   try {
//     const { id } = req.params; // Extract ID from request parameters
//     const trends = await Blog.findById(id); // Find news by ID

//     if (!trends) {
//       return res.status(404).send("news not found");
//     }

//     return res.status(200).json(trends);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Server Error");
//   }
// };

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
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};


// const getBlogId = async (req, res) => {
//   // Find Blog by Id
//   const getId = await Blog.findById(req.params.id);
//   if (!getId) {
//     return res.status(404).send({ message: "Blog Not Found" });
//   }
//   const getBlogById = await Blog.findById(getId);
//   return res.status(200).json({ getBlogById });
// };


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
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};



const updateBlogId = async (req, res) => {
  let user = await Blog.findById(req.params.id);
  // Check if the user is found
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  await cloudinary.uploader.destroy(user.cloudinary_id);
  let result;
  if (req.file) {
    result = await cloudinary.uploader.upload(req.file.path);
  } else {
    return res.send("cloudinary path is undefined");
  }
  const data = {
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    category: req.body.category,
    cloudinary_id: result.secure_url
  };
  user = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });
  res.json(user);
};

const deleteBlogId = async (req, res) => {
  // Find Blog by Id
  let blog = await Blog.findById(req.params.id);
  // Delete image from cloudinary
  await cloudinary.uploader.destroy(blog.cloudinary_id);
  // Delete user from db
  await blog.deleteOne();
  return res.status(200).send("Blog Successfully Deleted");
};

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
