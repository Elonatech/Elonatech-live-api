const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const compression = require("compression");
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

connectMongodb();

// ✅ Compression & user agent handling
app.use((req, res, next) => {
  const userAgent = req.get("user-agent") || "";
  const isCrawler = /facebookexternalhit|twitterbot|whatsapp|linkedin|slackbot/i.test(userAgent);

  if (isCrawler) {
    // disable compression for crawlers
    res.removeHeader("Content-Encoding");
    res.setHeader("Content-Encoding", "identity");
    res.setHeader("Transfer-Encoding", "");
    res.setHeader("Cache-Control", "no-transform");
    return next();
  }

  compression()(req, res, next);
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://elonatech-official-website.vercel.app",
      "https://elonatech.com.ng",
    ],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS", "PUT", "PATCH"],
  })
);

app.use(logVisitor);

app.get("/og/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).lean();

    if (!product) return res.status(404).send("Product not found");

    let imageUrl = product.images?.[0]?.url || "https://res.cloudinary.com/elonatech/image/upload/v1700000000/default.jpg";

    // Ensure proper Cloudinary optimization and format
    if (!imageUrl.startsWith("https://")) {
      imageUrl = `https://res.cloudinary.com/elonatech/image/upload/${imageUrl}`;
    }
    imageUrl = imageUrl.replace("/upload/", "/upload/f_auto,q_auto:eco/");
    if (!/\.(jpg|jpeg|png|webp)$/i.test(imageUrl)) imageUrl += ".jpg";

    const description =
      (product.description || "").replace(/(<([^>]+)>)/gi, "").substring(0, 200).trim() + "...";

    const productUrl = `https://elonatech.com.ng/product/${product.slug}/${product._id}`;

    // Force plain HTML response
    res.removeHeader("Content-Encoding");
    res.removeHeader("Transfer-Encoding");
    res.setHeader("Content-Encoding", "identity");
    res.setHeader("Cache-Control", "no-transform, no-cache, no-store");
    res.setHeader("Content-Type", "text/html; charset=utf-8");

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${product.name} - Elonatech Nigeria Limited</title>

        <!-- Open Graph -->
        <meta property="og:title" content="${product.name}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="${productUrl}" />
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
        <img src="${imageUrl}" alt="${product.name}" width="400" />
        <p>${description}</p>
      </body>
      </html>
    `;

    return res.status(200).send(html);
  } catch (err) {
    console.error("OG generation failed:", err);
    res.status(500).send("Server error");
  }
});

// ✅ Normal middlewares (after OG handler)
app.use(crawlerMiddleware);
app.use(metaTagsMiddleware);

app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/product", productRoutes);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use("/api/v1/auth", adminRoutes);
app.use("/api/v1/email", emailRoutes);
app.use("/api/v1/visitors", visitorRoutes);
app.use("/api/v1", commentRoutes);
app.use("/api/v1", replyRoutes);
app.use("/api/v2", renderApi);


app.get("/", (req, res) => {
  res.send("ELONATECH API RUNNING 🚀");
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

pingServer();