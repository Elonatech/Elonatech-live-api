const express = require("express");
const app = express();
// Tell Express to trust Render's proxy so rate limiting works correctly
app.set('trust proxy', 1);
require("dotenv").config();
const cors = require("cors");
const compression = require("compression");
const { connectMongodb } = require("./config/database");
const Product = require("./model/productModel");


const logVisitor = require("./middleware/visitorMiddleware");
const crawlerMiddleware = require("./middleware/crawlerMiddleware");
const metaTagsMiddleware = require("./middleware/metaTagsMiddleware");

const adminRoutes = require("./routes/adminRoute");
const blogRoutes = require("./routes/blogRoute");
const productRoutes = require("./routes/productRoute");
const jobRoutes = require("./routes/jobRoute");
const orderRoutes = require("./routes/orderRoute");
const jobApplicationRoutes = require("./routes/jobApplicationRoute");
const notificationRoutes = require("./routes/notificationRoute");
const quoteRoutes = require("./routes/quoteRoute");
const etmpdpRoutes = require("./routes/etmpdpRoute");
const consultationRoutes = require("./routes/consultationRoute");
const retainerRoutes = require("./routes/retainerRoute");
const contactRoutes = require("./routes/contactRoute");
const subscriberRoutes = require("./routes/subscriberRoute");
const newsRoute = require("./routes/newsRoute");
const visitorRoutes = require("./routes/visitorRoutes");
const emailRoutes = require("./routes/emailRoute");
const commentRoutes = require("./routes/blogCommentRoute");
// const replyRoutes = require("./routes/blogCommentRoute");
const renderApi = require("./routes/ping");
const sitemapRoute = require("./routes/sitemapRoute");
const cookieParser = require("cookie-parser");
const logger = require("./lib/logger");
const pingServer = require("./keepAlive");

const PORT = process.env.PORT || 8000;

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

app.use(cookieParser());

app.use(logVisitor);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Compression for regular users (after CORS)
app.use((req, res, next) => {
  const userAgent = req.get("user-agent") || "";
  const isCrawler = /facebookexternalhit|twitterbot|whatsapp|linkedin|slackbot/i.test(userAgent);

  if (isCrawler) {
    res.removeHeader("Content-Encoding");
    res.setHeader("Content-Encoding", "identity");
    res.setHeader("Transfer-Encoding", "");
    res.setHeader("Cache-Control", "no-transform");
    return next();
  }

  compression()(req, res, next);
});


app.use(crawlerMiddleware);
app.use(metaTagsMiddleware);


function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

app.get("/og/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).send("Product not found");

    let imageUrl = product.images?.[0]?.url || "https://res.cloudinary.com/elonatech/image/upload/v1700000000/default.jpg";
    if (!imageUrl.startsWith("https://")) {
      imageUrl = `https://res.cloudinary.com/elonatech/image/upload/${imageUrl}`;
    }
    imageUrl = imageUrl.replace("/upload/", "/upload/f_auto,q_auto:eco/");
    if (!/\.(jpg|jpeg|png|webp)$/i.test(imageUrl)) imageUrl += ".jpg";

    const description =
      (product.description || "").replace(/(<([^>]+)>)/gi, "").substring(0, 200).trim() + "...";

    const productUrl = `https://elonatech.com.ng/product/${product.slug}/${product._id}`;

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
   <title>${escapeHtml(product.name)} - Elonatech Nigeria Limited</title>
   <meta property="og:title" content="${escapeHtml(product.name)}" />
   <meta property="og:description" content="${escapeHtml(description)}" />
   <meta property="og:image" content="${escapeHtml(imageUrl)}" />
   <meta property="og:url" content="${escapeHtml(productUrl)}" />
   <meta name="twitter:title" content="${escapeHtml(product.name)}" />
   <meta name="twitter:description" content="${escapeHtml(description)}" />
   <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
...
<h1>${escapeHtml(product.name)}</h1>
<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(product.name)}" width="400" />
<p>${escapeHtml(description)}</p>
      </body>
      </html>
    `;
    return res.status(200).send(html);
  } catch (err) {
    console.error("OG generation failed:", err);
    return res.status(500).send("Server error");
  }
});

// --------------------------------------
// 6️⃣ API Routes
// --------------------------------------
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/job-applications", jobApplicationRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/quotes", quoteRoutes);
app.use("/api/v1/etmpdp", etmpdpRoutes);
app.use("/api/v1/consultations", consultationRoutes);
app.use("/api/v1/retainers", retainerRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/subscribers", subscriberRoutes);
app.use("/api/v1/auth", adminRoutes);
app.use("/api/v1/email", emailRoutes);
app.use("/api/v1/visitors", visitorRoutes);
app.use("/api/v1", commentRoutes);
// app.use("/api/v1", replyRoutes);
app.use("/api/v2", renderApi);

// Swagger UI — only available in development so docs aren't exposed in production
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  logger.info("Swagger UI available at http://localhost:8000/api-docs");
}
// Parses cookies from incoming requests so req.cookies is available
// Must come before any route that reads cookies (e.g. /refresh, /logout)

app.use("/sitemap.xml", sitemapRoute);

app.get("/", (req, res) => res.send("ELONATECH API RUNNING SUCCESSFULLY"));


app.use((err, req, res, next) => {
  logger.error("GlobalError:", { error: err.message, stack: err.stack });
  if (err.message === "Unsupported file format") {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File is too large. Maximum allowed size is 15MB." });
  }
  return res.status(500).json({ message: "Server Error", error: err.message });
});


if (require.main === module) {
  connectMongodb().then(() => {
    app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
    pingServer();
  });
}

module.exports = app;
