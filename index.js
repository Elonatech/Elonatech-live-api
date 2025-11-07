const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const compression = require("compression"); // ✅ Add this
const { connectMongodb } = require("./config/database");
const Product = require("./model/productModel");
const logVisitor = require("./middleware/visitorMiddleware");
const crawlerMiddleware = require("./middleware/crawlerMiddleware");
const metaTagsMiddleware = require("./middleware/metaTagsMiddleware");

// ROUTES
const adminRoutes = require("./routes/adminRoute");
const blogRoutes = require("./routes/blogRoute");
const productRoutes = require("./routes/productRoute");
const newsRoute = require("./routes/newsRoute");
const visitorRoutes = require("./routes/visitorRoutes");
const emailRoutes = require("./routes/emailRoute");
const commentRoutes = require("./routes/blogCommentRoute");
const replyRoutes = require("./routes/blogCommentRoute");
const renderApi = require("./routes/ping");

const pingServer = require("./keepAlive");
const PORT = process.env.PORT || 8000;

// Connect Database
connectMongodb();

app.use(compression({
  filter: (req, res) => {
    const userAgent = req.get("user-agent") || "";
    const isCrawler = /facebookexternalhit|twitterbot|whatsapp|linkedin|slackbot/i.test(userAgent);
    // Disable compression for social crawlers (they sometimes fail on Brotli/gzip)
    return !isCrawler;
  },
}));

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

// ✅ Gzip compression — must come early (before routes and responses)
app.use(compression());  // 👈 This is the key fix

// Visitor tracking and other middleware
app.use(logVisitor);
app.use(crawlerMiddleware);
app.use(metaTagsMiddleware);

// ✅ Social Media Crawler OG Middleware — PLACE HERE
app.use(async (req, res, next) => {
  const userAgent = req.get("user-agent") || "";
  const isCrawler = /facebookexternalhit|twitterbot|whatsapp|linkedin|slackbot/i.test(userAgent);

  if (isCrawler) res.setHeader("Content-Encoding", "identity");

  const match = req.url.match(/\/product\/[^\/]+\/([a-f0-9]{24})/);

  if (isCrawler && match) {
    const productId = match[1];

    try {
      const product = await Product.findById(productId).lean();
      if (product) {
        const imageUrl =
          (product.images?.[0]?.url || "https://elonatech.com.ng/default-image.jpg")
            .replace("/upload/", "/upload/f_jpg/"); // Convert WebP → JPG

        const description = (product.description || "")
          .replace(/(<([^>]+)>)/gi, "")
          .substring(0, 200) + "...";

        const html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8" />
            <title>${product.name} - Elonatech Nigeria Limited</title>

            <meta property="og:title" content="${product.name}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:image" content="${imageUrl}" />
            <meta property="og:url" content="https://elonatech.com.ng${req.url}" />
            <meta property="og:type" content="product" />
            <meta property="og:site_name" content="Elonatech Nigeria Limited" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${product.name}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="twitter:image" content="${imageUrl}" />
          </head>
          <body>
            <h1>${product.name}</h1>
            <img src="${imageUrl}" alt="${product.name}" width="400" />
            <p>${description}</p>
          </body>
          </html>
        `;
        return res.status(200).send(html);
      }
    } catch (err) {
      console.error("Error generating OG preview:", err);
    }
  }

  next();
});


app.use("/api/v1/blog", blogRoutes);
// app.use("/api/v1/product", productRoutes);

// JSON parser AFTER OG handler
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", adminRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/email", emailRoutes);
app.use("/api/v1/visitors", visitorRoutes);
app.use("/api/v1", commentRoutes);
app.use("/api/v1", replyRoutes);
app.use("/api/v2", renderApi);

// Base route
app.get("/", (req, res) => {
  res.send("ELONATECH API RUNNING");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

pingServer();