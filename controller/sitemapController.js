const Blog = require("../model/blogModel");
const Product = require("../model/productModel");

const SITE = "https://elonatech.com.ng";
const TODAY = new Date().toISOString().split("T")[0];

// Static pages that don't change often
const staticPages = [
  { loc: "/", priority: "1.00", changefreq: "weekly" },
  { loc: "/who-we-are/", priority: "0.90", changefreq: "monthly" },
  { loc: "/portfolio/", priority: "0.90", changefreq: "monthly" },
  { loc: "/our-team/", priority: "0.80", changefreq: "monthly" },
  { loc: "/career/", priority: "0.80", changefreq: "weekly" },
  { loc: "/get-in-touch/", priority: "0.80", changefreq: "monthly" },
  { loc: "/consulting/", priority: "0.80", changefreq: "monthly" },
  { loc: "/retainer-partnership/", priority: "0.80", changefreq: "monthly" },
  { loc: "/training/", priority: "0.80", changefreq: "monthly" },
  { loc: "/web-design/", priority: "0.90", changefreq: "monthly" },
  { loc: "/app-development/", priority: "0.90", changefreq: "monthly" },
  { loc: "/domain/", priority: "0.80", changefreq: "monthly" },
  { loc: "/hosting/", priority: "0.80", changefreq: "monthly" },
  { loc: "/digital-marketing/", priority: "0.90", changefreq: "monthly" },
  { loc: "/seo/", priority: "0.80", changefreq: "monthly" },
  { loc: "/ppc/", priority: "0.80", changefreq: "monthly" },
  { loc: "/social-media-marketing/", priority: "0.80", changefreq: "monthly" },
  { loc: "/content-marketing/", priority: "0.80", changefreq: "monthly" },
  { loc: "/email-marketing/", priority: "0.80", changefreq: "monthly" },
  { loc: "/graphics-design/", priority: "0.80", changefreq: "monthly" },
  { loc: "/brand-identity/", priority: "0.80", changefreq: "monthly" },
  { loc: "/uiux/", priority: "0.80", changefreq: "monthly" },
  { loc: "/animation/", priority: "0.80", changefreq: "monthly" },
  { loc: "/motion-graphics/", priority: "0.80", changefreq: "monthly" },
  { loc: "/video-editing/", priority: "0.80", changefreq: "monthly" },
  { loc: "/voip/", priority: "0.80", changefreq: "monthly" },
  { loc: "/ip-telephony/", priority: "0.80", changefreq: "monthly" },
  { loc: "/livestreaming/", priority: "0.80", changefreq: "monthly" },
  { loc: "/videoconferencing/", priority: "0.80", changefreq: "monthly" },
  { loc: "/network/", priority: "0.80", changefreq: "monthly" },
  { loc: "/network-administration-implementation/", priority: "0.80", changefreq: "monthly" },
  { loc: "/network-security/", priority: "0.80", changefreq: "monthly" },
  { loc: "/network-support/", priority: "0.80", changefreq: "monthly" },
  { loc: "/structure-cabling/", priority: "0.80", changefreq: "monthly" },
  { loc: "/internet/", priority: "0.80", changefreq: "monthly" },
  { loc: "/server-administration/", priority: "0.80", changefreq: "monthly" },
  { loc: "/system-integration/", priority: "0.80", changefreq: "monthly" },
  { loc: "/cctv/", priority: "0.80", changefreq: "monthly" },
  { loc: "/surveillance/", priority: "0.80", changefreq: "monthly" },
  { loc: "/access-control/", priority: "0.80", changefreq: "monthly" },
  { loc: "/time-management/", priority: "0.80", changefreq: "monthly" },
  { loc: "/hardware-engineering/", priority: "0.80", changefreq: "monthly" },
  { loc: "/mobile-repair/", priority: "0.80", changefreq: "monthly" },
  { loc: "/printer-repair/", priority: "0.80", changefreq: "monthly" },
  { loc: "/application-software/", priority: "0.80", changefreq: "monthly" },
  { loc: "/business-software/", priority: "0.80", changefreq: "monthly" },
  { loc: "/system-software/", priority: "0.80", changefreq: "monthly" },
  { loc: "/technical-support/", priority: "0.80", changefreq: "monthly" },
  { loc: "/remote-support/", priority: "0.80", changefreq: "monthly" },
  { loc: "/products/", priority: "0.80", changefreq: "weekly" },
  { loc: "/computers/", priority: "0.80", changefreq: "weekly" },
  { loc: "/printers/", priority: "0.70", changefreq: "monthly" },
  { loc: "/office-equipment/", priority: "0.70", changefreq: "monthly" },
  { loc: "/pos-system/", priority: "0.70", changefreq: "monthly" },
  { loc: "/network-devices/", priority: "0.70", changefreq: "monthly" },
  { loc: "/software-supply/", priority: "0.70", changefreq: "monthly" },
  { loc: "/hardware-supply/", priority: "0.70", changefreq: "monthly" },
  { loc: "/consumables/", priority: "0.70", changefreq: "monthly" },
  { loc: "/blog/", priority: "0.80", changefreq: "daily" },
  { loc: "/news/", priority: "0.80", changefreq: "daily" },
  { loc: "/trends/", priority: "0.80", changefreq: "daily" },
  { loc: "/israel-uhwonuwoma-o/", priority: "0.50", changefreq: "yearly" },
  { loc: "/oreva-p-oku/", priority: "0.80", changefreq: "yearly" },
  { loc: "/violet-oku/", priority: "0.50", changefreq: "yearly" },
  { loc: "/animation-career/", priority: "0.60", changefreq: "monthly" },
  { loc: "/digital-career/", priority: "0.60", changefreq: "monthly" },
  { loc: "/graphic-career/", priority: "0.60", changefreq: "monthly" },
  { loc: "/marketing-career/", priority: "0.60", changefreq: "monthly" },
  { loc: "/system-career/", priority: "0.60", changefreq: "monthly" },
  { loc: "/web-career/", priority: "0.60", changefreq: "monthly" },
];

const escapeXml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const urlEntry = ({ loc, lastmod, priority, changefreq }) => `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod || TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const getSitemap = async (req, res) => {
  try {
    const [blogs, products] = await Promise.all([
      Blog.find({}, "slug _id category updatedAt").lean(),
      Product.find({}, "slug _id updatedAt").lean(),
    ]);

    const staticEntries = staticPages
      .map(p => urlEntry({ ...p, loc: `${SITE}${p.loc}`, lastmod: TODAY }))
      .join("");

    const blogEntries = blogs
      .filter(b => b.slug)
      .map(b => {
        const lastmod = b.updatedAt
          ? new Date(b.updatedAt).toISOString().split("T")[0]
          : TODAY;

        const category = Array.isArray(b.category) ? b.category[0] : b.category;
        const section =
          category === "news" ? "news" : category === "trends" ? "trends" : "blog";

        return urlEntry({
          loc: `${SITE}/${section}/${escapeXml(b.slug)}/${b._id}`,
          lastmod,
          priority: "0.75",
          changefreq: "monthly",
        });
      })
      .join("");

    const productEntries = products
      .filter(p => p.slug)
      .map(p => {
        const lastmod = p.updatedAt
          ? new Date(p.updatedAt).toISOString().split("T")[0]
          : TODAY;
        return urlEntry({
          loc: `${SITE}/product/${escapeXml(p.slug)}/${p._id}`,
          lastmod,
          priority: "0.70",
          changefreq: "weekly",
        });
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticEntries}
${blogEntries}
${productEntries}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600"); // cache 1 hour
    return res.status(200).send(xml);
  } catch (error) {
    console.error("SitemapError:", error);
    return res.status(500).json({ message: "Failed to generate sitemap" });
  }
};

module.exports = { getSitemap };
