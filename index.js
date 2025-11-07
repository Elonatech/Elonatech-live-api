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

// Connect Database
connectMongodb();

// ✅ FIXED: Compression with crawler handling
const shouldCompress = (req, res) => {
  const userAgent = req.get("user-agent") || "";
  const isCrawler = /facebookexternalhit|twitterbot|whatsapp|linkedin|slackbot/i.test(userAgent);

  // Don't compress for crawlers
  if (isCrawler) {
    return false;
  }

  // Fallback to standard compression
  return compression.filter(req, res);
};

app.use(compression({ filter: shouldCompress }));

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

app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/product", productRoutes);

// JSON parser should come BEFORE custom middleware
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));

// Visitor tracking and other middleware
app.use(logVisitor);
app.use(crawlerMiddleware);
app.use(metaTagsMiddleware);

// ✅ FIXED: Single, clean OG Middleware for product pages
app.use(async (req, res, next) => {
  const userAgent = req.get("user-agent") || "";
  const isCrawler = /facebookexternalhit|twitterbot|whatsapp|linkedinbot|slackbot/i.test(userAgent);

  if (!isCrawler) {
    return next();
  }

  // Match product URLs like /product/.../productId
  const match = req.url.match(/\/product\/[^\/]+\/([a-f0-9]{24})/);

  if (!match) {
    return next();
  }

  const productId = match[1];
  console.log(`🕷️  Crawler detected (${userAgent}), generating OG tags for product:`, productId);

  try {
    const product = await Product.findById(productId).lean();
    if (!product) {
      console.log("Product not found for ID:", productId);
      return next();
    }

    // ✅ FIXED: Better image URL handling
    let imageUrl;
    if (product.images?.[0]?.url) {
      if (product.images[0].url.startsWith("http")) {
        // External URL - use as is
        imageUrl = product.images[0].url;
      } else {
        // Cloudinary path - ensure proper transformation
        const cloudinaryPath = product.images[0].url.replace("/upload/", "/upload/f_jpg,q_auto:best,w_1200,h_630,c_fill/");
        imageUrl = `https://res.cloudinary.com/elonatech${cloudinaryPath}`;
      }
    } else {
      // Fallback image
      imageUrl = "https://res.cloudinary.com/elonatech/image/upload/f_jpg,q_auto:best,w_1200,h_630,c_fill/v1700000000/default-product-image.jpg";
    }

    // ✅ FIXED: Better description handling
    const rawDescription = product.description || product.shortDescription || "High-quality product from Elonatech Nigeria Limited";
    const cleanDescription = rawDescription
      .replace(/(<([^>]+)>)/gi, "")
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 160) + (rawDescription.length > 160 ? "..." : "");

    // ✅ FIXED: Correct canonical URL (without fromPage parameter)
    const canonicalUrl = `https://elonatech.com.ng/product/${product.slug || 'product'}/${productId}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>${product.name} - Elonatech Nigeria Limited</title>
    <meta name="description" content="${cleanDescription}" />

    <!-- Open Graph -->
    <meta property="og:title" content="${product.name}" />
    <meta property="og:description" content="${cleanDescription}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="Elonatech Nigeria Limited" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${product.name}" />
    <meta name="twitter:description" content="${cleanDescription}" />
    <meta name="twitter:image" content="${imageUrl}" />

    <!-- Canonical -->
    <link rel="canonical" href="${canonicalUrl}" />
</head>
<body>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1>${product.name}</h1>
        <img 
            src="${imageUrl}" 
            alt="${product.name}" 
            style="max-width: 100%; height: auto;" 
        />
        <p>${cleanDescription}</p>
        <p><strong>Price:</strong> ₦${product.price || 'Contact for price'}</p>
        <p>
            <a href="${canonicalUrl}">
                View Product on Elonatech
            </a>
        </p>
    </div>
</body>
</html>
`;
    console.log(`✅ Generated OG preview for: ${product.name}`);
    return res.status(200).send(html);

  } catch (err) {
    console.error("❌ Error generating OG preview:", err);
    return next();
  }
});

// Routes
app.use("/api/v1/auth", adminRoutes);

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