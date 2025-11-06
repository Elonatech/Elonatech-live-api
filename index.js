const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://elonatech-official-website.vercel.app",
      "https://elonatech.com.ng",
      "http://localhost:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS", "PUT", "PATCH"]
  })
);

const adminRoutes = require("./routes/adminRoute");
const blogRoutes = require("./routes/blogRoute");
const newsRoute = require("./routes/newsRoute");
const visitorRoutes = require("./routes/visitorRoutes");
const logVisitor = require("./middleware/visitorMiddleware");
const productRoutes = require("./routes/productRoute");
const emailRoutes = require("./routes/emailRoute");
const { connectMongodb } = require("./config/database");
const PORT = process.env.PORT || 8000;
const pingServer = require("./keepAlive");
const RecentlyViewed = require("./model/recentlyviewesModel");
const Product = require("./model/productModel");
const crawlerMiddleware = require('./middleware/crawlerMiddleware');
const metaTagsMiddleware = require('./middleware/metaTagsMiddleware');
const commentRoutes = require('./routes/blogCommentRoute');
const replyRoutes = require('./routes/blogCommentRoute');
const renderApi = require('./routes/ping');

// DATABASE
connectMongodb();

// Visitor Tracking Middleware
app.use(logVisitor);
app.use(crawlerMiddleware);
app.use(metaTagsMiddleware);

app.use("/api/v1/product", productRoutes);

app.use("/api/v1/blog", blogRoutes);

// JSON
// Now safely use JSON parser for other routes
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));

// Social Media Crawler Middleware - Place before routes
app.use(async (req, res, next) => {
  const userAgent = req.get('user-agent') || '';
  const isSocialMediaCrawler = /facebookexternalhit|twitterbot|whatsapp|linkedin|slackbot/i.test(userAgent);

  // Match your frontend product URLs
  const match = req.url.match(/\/product\/[^\/]+\/([a-f0-9]{24})/); // captures the MongoDB ObjectId at end

  if (isSocialMediaCrawler && match) {
    const productId = match[1];

    try {
      const product = await Product.findById(productId);

      if (product) {
        const imageUrl = product.images?.[0]?.url || 'https://elonatech.com.ng/default-image.jpg';
        const description = (product.description || '').replace(/(<([^>]+)>)/gi, '').substring(0, 200) + '...';

        const html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8" />
            <title>${product.name} - Elonatech Nigeria Limited</title>

            <!-- Open Graph -->
            <meta property="og:title" content="${product.name}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:image" content="${imageUrl}" />
            <meta property="og:url" content="https://elonatech.com.ng/product/${product.slug}/${product._id}" />
            <meta property="og:type" content="product" />
            <meta property="og:site_name" content="Elonatech Nigeria Limited" />

            <!-- Twitter -->
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${product.name}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="twitter:image" content="${imageUrl}" />
          </head>
          <body>
            <h1>${product.name}</h1>
            <p>${description}</p>
            <img src="${imageUrl}" alt="${product.name}" />
          </body>
          </html>
        `;

        return res.send(html);
      }
    } catch (err) {
      console.error('Error generating preview:', err);
    }
  }

  next(); // continue normally for browsers
});

// Base route
app.get("/", (req, res) => {
  res.send("ELONATECH API RUNNING");
});

// Routes
app.use("/api/v1/auth", adminRoutes);
// app.use("/api/v1/blog", blogRoutes);

// app.use("/api/v1/product", productRoutes);

app.use("/api/v1/email", emailRoutes);
app.use("/api/v1/visitors", visitorRoutes);
app.use('/api/v1', commentRoutes);
app.use('/api/v1', replyRoutes);

app.use('/api/v2', renderApi);

// PORT
app.listen(PORT, () => {
  console.log(`PORT STARTED AT ${PORT}`);
});

pingServer();