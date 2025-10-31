const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
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
const RecentlyViewed = require("./model/recentlyViewesModel");
const Product = require("./model/productModel");
const crawlerMiddleware = require('./middleware/crawlerMiddleware');
const metaTagsMiddleware = require('./middleware/metaTagsMiddleware');
const commentRoutes = require('./routes/blogCommentRoute');
const replyRoutes = require('./routes/blogCommentRoute');

// JSON
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: "true" }));

// CORS
app.use(
  cors({
    origin: "*",
    credentials: "",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"]
  })
);

// DATABASE
connectMongodb();

// Visitor Tracking Middleware
app.use(logVisitor);
app.use(crawlerMiddleware);
app.use(metaTagsMiddleware);

// Social Media Crawler Middleware - Place before routes
app.use(async (req, res, next) => {
  const userAgent = req.get('user-agent');
  const isSocialMediaCrawler = /facebookexternalhit|twitterbot|whatsapp|linkedin/i.test(userAgent);

  if (isSocialMediaCrawler) {
    // Update the regex to match your actual product route pattern
    const match = req.url.match(/\/api\/v1\/product\/([^\/]+)/);
    if (match) {
      const productId = match[1];
      try {
        const product = await Product.findById(productId);

        if (product) {
          // Generate HTML with proper meta tags
          const html = `
            <!DOCTYPE html>
            <html>
              <head>
                <title>${product.name} - Elonatech Nigeria Limited</title>
                
                <!-- Open Graph Meta Tags -->
                <meta property="og:title" content="${product.name}" />
                <meta property="og:description" content="${product.description ? product.description.substring(0, 200) + '...' : ''}" />
                <meta property="og:image" content="${product.images && product.images.length > 0 ? product.images[0].url : ''}" />
                <meta property="og:url" content="/product/${productId}" />
                <meta property="og:type" content="product" />
                <meta property="og:site_name" content="Elonatech Nigeria Limited" />
                
                <!-- Twitter Card Meta Tags -->
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@elonatech" />
                <meta name="twitter:title" content="${product.name}" />
                <meta name="twitter:description" content="${product.description ? product.description.substring(0, 200) + '...' : ''}" />
                <meta name="twitter:image" content="${product.images && product.images.length > 0 ? product.images[0].url : ''}" />
              </head>
              <body>
                <h1>${product.name}</h1>
                ${product.images && product.images.length > 0 ?
              `<img src="${product.images[0].url}" alt="${product.name}" />` : ''}
                <p>${product.description || ''}</p>
              </body>
            </html>
          `;
          return res.send(html);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        // Don't block the request on error, continue to normal handling
        return next();
      }
    }
  }
  next();
});

// Base route
app.get("/", (req, res) => {
  res.send("ELONATECH API RUNNING");
});

// Routes
app.use("/api/v1/auth", adminRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/email", emailRoutes);
app.use("/api/v1/visitors", visitorRoutes);
app.use('/api/v1', commentRoutes);
app.use('/api/v1', replyRoutes);

// PORT
app.listen(PORT, () => {
  console.log(`PORT STARTED AT ${PORT}`);
});

pingServer();