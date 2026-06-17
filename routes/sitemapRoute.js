const express = require("express");
const router = express.Router();
const { getSitemap } = require("../controller/sitemapController");

router.get("/", getSitemap);

module.exports = router;
