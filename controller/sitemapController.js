const Blog = require("../model/blogModel");
const Product = require("../model/productModel");

const SITE = "https://elonatech.com.ng";
const TODAY = new Date().toISOString().split("T")[0];
// Default lastmod for pages that haven't had a specific date set below.
// Whenever you actually edit a static page's content, update ITS lastmod
// to the date of that change — don't bump this default or all pages will
// falsely look "just updated" on every request.
const DEFAULT_LASTMOD = "2026-07-03";

// Static pages that don't change often. Each entry's lastmod should reflect
// when THAT page's content was last actually changed.
const staticPages = [
  { loc: "/", priority: "1.00", changefreq: "weekly", lastmod: DEFAULT_LASTMOD },
  { loc: "/who-we-are/", priority: "0.90", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/portfolio/", priority: "0.90", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/our-team/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/career/", priority: "0.80", changefreq: "weekly", lastmod: DEFAULT_LASTMOD },
  { loc: "/get-in-touch/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/consulting/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/retainer-partnership/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/training/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/web-design/", priority: "0.90", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/app-development/", priority: "0.90", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/domain/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/hosting/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/digital-marketing/", priority: "0.90", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/seo/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/ppc/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/social-media-marketing/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/content-marketing/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/email-marketing/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/graphics-design/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/brand-identity/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/uiux/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/animation/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/motion-graphics/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/video-editing/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/voip/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/ip-telephony/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/livestreaming/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/videoconferencing/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/network/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/network-administration-implementation/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/network-security/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/network-support/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/structure-cabling/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/internet/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/server-administration/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/system-integration/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/cctv/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/surveillance/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/access-control/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/time-management/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/hardware-engineering/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/mobile-repair/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/printer-repair/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/application-software/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/business-software/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/system-software/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/technical-support/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/remote-support/", priority: "0.80", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/products/", priority: "0.80", changefreq: "weekly", lastmod: DEFAULT_LASTMOD },
  { loc: "/computers/", priority: "0.80", changefreq: "weekly", lastmod: DEFAULT_LASTMOD },
  { loc: "/printers/", priority: "0.70", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/office-equipment/", priority: "0.70", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/pos-system/", priority: "0.70", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/network-devices/", priority: "0.70", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/software-supply/", priority: "0.70", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/hardware-supply/", priority: "0.70", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/consumables/", priority: "0.70", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/blog/", priority: "0.80", changefreq: "daily", lastmod: DEFAULT_LASTMOD },
  { loc: "/news/", priority: "0.80", changefreq: "daily", lastmod: DEFAULT_LASTMOD },
  { loc: "/trends/", priority: "0.80", changefreq: "daily", lastmod: DEFAULT_LASTMOD },
  { loc: "/israel-uhwonuwoma-o/", priority: "0.50", changefreq: "yearly", lastmod: DEFAULT_LASTMOD },
  { loc: "/oreva-p-oku/", priority: "0.80", changefreq: "yearly", lastmod: DEFAULT_LASTMOD },
  { loc: "/violet-oku/", priority: "0.50", changefreq: "yearly", lastmod: DEFAULT_LASTMOD },
  { loc: "/animation-career/", priority: "0.60", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/digital-career/", priority: "0.60", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/graphic-career/", priority: "0.60", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/marketing-career/", priority: "0.60", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/system-career/", priority: "0.60", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
  { loc: "/web-career/", priority: "0.60", changefreq: "monthly", lastmod: DEFAULT_LASTMOD },
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
      .map(p => urlEntry({ ...p, loc: `${SITE}${p.loc}` }))
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
