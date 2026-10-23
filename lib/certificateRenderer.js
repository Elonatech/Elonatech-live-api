const path = require("path");
const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
const QRCode = require("qrcode");
const { PDFDocument } = require("pdf-lib");
const logger = require("./logger");

// Draws ETMPDP certificates on the server. The browser only ever receives the
// finished picture or PDF, so the signature and stamp images (which exist only
// here, decrypted in memory) never reach anyone as separate files.
//
// This is the same design as the "classic" certificate that used to be drawn in
// the browser. Everything is laid out on a fixed A4-landscape canvas (2480 x
// 1754, 300 dpi) and scaled to the requested width.

// ── fonts ─────────────────────────────────────────────────────────────────────
// Render has no system fonts, so the ones we need are bundled in assets/fonts.
const FONT_DIR = path.join(__dirname, "..", "assets", "fonts");
[
  ["Gelasio_400Regular.ttf", "Gelasio"],
  ["Gelasio_400Regular_Italic.ttf", "Gelasio"],
  ["Gelasio_700Bold.ttf", "Gelasio"],
  ["Gelasio_700Bold_Italic.ttf", "Gelasio"],
  ["Arimo_400Regular.ttf", "Arimo"],
  ["Arimo_700Bold.ttf", "Arimo"],
  ["Inconsolata_700Bold.ttf", "Inconsolata"],
].forEach(([file, family]) => {
  if (!GlobalFonts.registerFromPath(path.join(FONT_DIR, file), family)) {
    logger.error("Certificate font failed to register", { file });
  }
});

const SERIF = "Gelasio, Georgia, serif";
const SANS = "Arimo, Arial, sans-serif";
const MONO = "Inconsolata, monospace";

const SITE_URL = process.env.PUBLIC_SITE_URL || "https://elonatech.com.ng";
const EMBLEM_PATH = path.join(__dirname, "..", "assets", "elonatech-emblem.png");

const PROGRAMME_FULL_NAME = "Executive Technology Mentorship & Professional Development Program";

// ── look ──────────────────────────────────────────────────────────────────────
const W = 2480;
const H = 1754;

// accent = the border colour; brand = the company red / blue from the logo
const THEMES = {
  Core: { accent: "#c23a34", brand: "#ce1a18" },
  Ignite: { accent: "#34548c", brand: "#33548f" },
};
const NAVY = "#11253d";
const GOLD = "#b8964e";
const INK = "#1f2937";
const MUTED = "#6b7280";
const BRAND_BLUE = "#33548f";

const LAYOUT = {
  qr: { x: 190, y: 1420, size: 220 },
  signature: { right: W - 190, width: 560, y: 1520 },
};

const CORE_CLOSING =
  "Integrated development in practical application, executive mentorship, leadership, business awareness and responsible AI.";
const IGNITE_CLOSING =
  "Specialization-focused learning, practical exposure, mentorship and professional development.";
const DETAILS_LEFT = 300;
const DETAILS_RIGHT = W - 300;
const RULE_Y = 1328; // gold rule above the closing sentence (same on both programmes)

// The eight Core tracks, by the short names the Core page uses for its tabs
const TRACK_SUMMARY = [
  "Software Engineering",
  "Graphics & Brand Design",
  "Digital Marketing",
  "IT & Networking",
  "Computer Engineering",
  "Virtual Assistance",
  "Data Analytics",
  "Cybersecurity",
];

// ── small helpers ─────────────────────────────────────────────────────────────
const programLabel = (program) => `ETMPDP ${program}`;
const verifyUrl = (code) => `${SITE_URL}/verify/${code}`;

// Dates are stored as midnight UTC, so format them in UTC too
const formatLongDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

let emblemPromise;
const getEmblem = () => {
  if (!emblemPromise) emblemPromise = loadImage(EMBLEM_PATH);
  return emblemPromise;
};

// Centered text with manual letter-spacing
const spaced = (ctx, text, cx, y, spacing) => {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  let x = cx - total / 2;
  const align = ctx.textAlign;
  ctx.textAlign = "left";
  chars.forEach((c, i) => {
    ctx.fillText(c, x, y);
    x += widths[i] + spacing;
  });
  ctx.textAlign = align;
};

// Shrinks the font until the text fits the width, so long names stay on the page
const fitFont = (ctx, text, maxWidth, startSize, family, style = "") => {
  let size = startSize;
  do {
    ctx.font = `${style} ${size}px ${family}`.trim();
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 4;
  } while (size > 40);
  return size;
};

// Largest size of (width x height) that fits inside a box, never enlarged
const fitInto = (img, maxW, maxH) => {
  const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
  return { w: img.width * ratio, h: img.height * ratio };
};

// ── drawing ───────────────────────────────────────────────────────────────────
const drawFrame = (ctx, theme) => {
  ctx.fillStyle = "#fffdf9";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 12;
  ctx.strokeRect(48, 48, W - 96, H - 96);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.strokeRect(84, 84, W - 168, H - 168);

  ctx.fillStyle = GOLD;
  [[84, 84], [W - 84, 84], [84, H - 84], [W - 84, H - 84]].forEach(([x, y]) => {
    ctx.fillRect(x - 14, y - 14, 28, 28);
  });
};

// The emblem (no lettering), the company name and the programme name, centred,
// with a gold rule and a small accent diamond under them.
const drawHeader = async (ctx, theme) => {
  const emblem = await getEmblem();
  const size = 180;
  ctx.drawImage(emblem, (W - size) / 2, 100, size, size);

  ctx.textAlign = "center";
  ctx.fillStyle = BRAND_BLUE;
  ctx.font = `bold 64px ${SANS}`;
  spaced(ctx, "ELONATECH NIGERIA LIMITED", W / 2, 352, 6);

  ctx.fillStyle = NAVY;
  ctx.font = `40px ${SANS}`;
  ctx.fillText(PROGRAMME_FULL_NAME, W / 2, 408);

  const y = 446;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 560, y);
  ctx.lineTo(W / 2 - 24, y);
  ctx.moveTo(W / 2 + 24, y);
  ctx.lineTo(W / 2 + 560, y);
  ctx.stroke();
  ctx.fillStyle = theme.brand;
  ctx.beginPath();
  ctx.moveTo(W / 2, y - 13);
  ctx.lineTo(W / 2 + 13, y);
  ctx.lineTo(W / 2, y + 13);
  ctx.lineTo(W / 2 - 13, y);
  ctx.closePath();
  ctx.fill();
};

// "Label:  Value", centred, with the value in the company blue (shrunk to fit)
const drawFocusLine = (ctx, label, value, y) => {
  const GAP = 18;
  ctx.font = `32px ${SERIF}`;
  const labelW = ctx.measureText(label).width;

  let size = 40;
  ctx.font = `bold ${size}px ${SERIF}`;
  while (size > 24 && labelW + GAP + ctx.measureText(value).width > 2000) {
    size -= 2;
    ctx.font = `bold ${size}px ${SERIF}`;
  }
  const valueW = ctx.measureText(value).width;
  const x = W / 2 - (labelW + GAP + valueW) / 2;

  ctx.textAlign = "left";
  ctx.fillStyle = MUTED;
  ctx.font = `32px ${SERIF}`;
  ctx.fillText(label, x, y);
  ctx.fillStyle = BRAND_BLUE;
  ctx.font = `bold ${size}px ${SERIF}`;
  ctx.fillText(value, x + labelW + GAP, y);
};

// Core: the same for everyone, plus the person's Special focus when one was chosen
const drawCoreSummary = (ctx, cert) => {
  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  ctx.font = `italic 38px ${SERIF}`;
  ctx.fillText("Multidisciplinary exposure across eight professional technology tracks", W / 2, 1154);

  // the eight tracks on one line (shrunk until it fits)
  const list = TRACK_SUMMARY.join("  •  ");
  let size = 28;
  ctx.font = `${size}px ${SERIF}`;
  while (ctx.measureText(list).width > 2060 && size > 18) {
    size -= 1;
    ctx.font = `${size}px ${SERIF}`;
  }
  ctx.fillStyle = MUTED;
  ctx.fillText(list, W / 2, 1200);

  if (cert.specialFocus) drawFocusLine(ctx, "Special focus:", cert.specialFocus, 1272);
};

// Ignite: the person's pathway and length, then their primary specialization
const drawIgniteSummary = (ctx, cert) => {
  const pathway = [cert.pathwayLevel, cert.duration].filter(Boolean).join("   •   ");
  if (pathway) {
    ctx.textAlign = "center";
    ctx.fillStyle = INK;
    ctx.font = `italic 38px ${SERIF}`;
    ctx.fillText(pathway, W / 2, 1176);
  }
  if (cert.specialization) drawFocusLine(ctx, "Primary specialization:", cert.specialization, 1250);
};

const drawDetails = (ctx, cert) => {
  const isIgnite = cert.program === "Ignite";
  if (isIgnite) drawIgniteSummary(ctx, cert);
  else drawCoreSummary(ctx, cert);

  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(DETAILS_LEFT, RULE_Y);
  ctx.lineTo(DETAILS_RIGHT, RULE_Y);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  const closing = isIgnite ? IGNITE_CLOSING : CORE_CLOSING;
  fitFont(ctx, closing, DETAILS_RIGHT - DETAILS_LEFT, isIgnite ? 30 : 28, SERIF);
  ctx.fillText(closing, W / 2, RULE_Y + 46);
};

// Text laid along a circle (for the placeholder stamp)
const arcText = (ctx, text, radius, centerAngle, spacing, bottom = false) => {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width + spacing);
  const span = widths.reduce((a, b) => a + b, 0) / radius;
  let angle = bottom ? centerAngle + span / 2 : centerAngle - span / 2;

  chars.forEach((c, i) => {
    const half = widths[i] / 2 / radius;
    angle += bottom ? -half : half;
    ctx.save();
    ctx.rotate(bottom ? angle - Math.PI / 2 : angle + Math.PI / 2);
    ctx.translate(0, bottom ? radius : -radius);
    ctx.fillText(c, 0, 0);
    ctx.restore();
    angle += bottom ? -half : half;
  });
};

const star = (ctx, x, y, r) => {
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const rad = i % 2 ? r * 0.42 : r;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    ctx.lineTo(x + rad * Math.cos(a), y + rad * Math.sin(a));
  }
  ctx.closePath();
  ctx.fill();
};

// The drawn ETMPDP stamp. Used until the company's real stamp image is uploaded.
const drawPlaceholderStamp = (ctx, theme, cert, cx, cy) => {
  const R = 124;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-9 * Math.PI) / 180);
  ctx.globalAlpha = 0.93;
  ctx.strokeStyle = theme.brand;
  ctx.fillStyle = theme.brand;

  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.beginPath();
  ctx.arc(0, 0, R - 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(0, 0, R - 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, R - 16, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, R - 58, 0, Math.PI * 2);
  ctx.stroke();

  const mid = R - 37;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = `bold 25px ${SERIF}`;
  arcText(ctx, "ELONATECH", mid - 9, -Math.PI / 2, 5);
  arcText(ctx, "CERTIFIED", mid + 9, Math.PI / 2, 5, true);
  star(ctx, -mid, 0, 9);
  star(ctx, mid, 0, 9);

  ctx.font = `bold 26px ${SERIF}`;
  ctx.fillText("ETMPDP", 0, 0);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-30, 10);
  ctx.lineTo(30, 10);
  ctx.stroke();
  ctx.font = `bold 19px ${SERIF}`;
  ctx.fillText(cert.program.toUpperCase(), 0, 34);
  star(ctx, 0, -34, 6);

  ctx.restore();
};

// ── the certificate ──────────────────────────────────────────────────────────
// assets: { signature, stamp } are decoded images (or null), settings carries
// the signatory's name and title.
const renderCertificateCanvas = async (cert, { signature = null, stamp = null, settings = {}, width = W } = {}) => {
  const theme = THEMES[cert.program] || THEMES.Core;
  const canvas = createCanvas(width, Math.round((width * H) / W));
  const ctx = canvas.getContext("2d");
  ctx.scale(width / W, width / W);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.textBaseline = "alphabetic";

  drawFrame(ctx, theme);
  await drawHeader(ctx, theme);

  // title
  ctx.textAlign = "center";
  ctx.fillStyle = NAVY;
  ctx.font = `bold 112px ${SERIF}`;
  spaced(ctx, "CERTIFICATE", W / 2, 574, 12);
  ctx.fillStyle = theme.brand;
  ctx.font = `38px ${SERIF}`;
  spaced(ctx, "OF COMPLETION", W / 2, 632, 16);

  ctx.fillStyle = MUTED;
  ctx.font = `italic 40px ${SERIF}`;
  ctx.fillText("This certificate is proudly presented to", W / 2, 710);

  // name
  ctx.fillStyle = INK;
  fitFont(ctx, cert.fullName, 1900, 120, SERIF, "italic bold");
  ctx.fillText(cert.fullName, W / 2, 828);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 700, 864);
  ctx.lineTo(W / 2 + 700, 864);
  ctx.stroke();

  // programme and dates
  ctx.fillStyle = MUTED;
  ctx.font = `38px ${SERIF}`;
  ctx.fillText("for successfully completing the", W / 2, 922);
  ctx.fillStyle = theme.brand;
  ctx.font = `bold 84px ${SERIF}`;
  ctx.fillText(programLabel(cert.program), W / 2, 1010);
  ctx.fillStyle = MUTED;
  ctx.font = `32px ${SERIF}`;
  const dates = [
    cert.enrollmentDate && `Enrolled ${formatLongDate(cert.enrollmentDate)}`,
    `Completed ${formatLongDate(cert.completionDate)}`,
  ].filter(Boolean);
  ctx.fillText(dates.join("   •   "), W / 2, 1068);

  drawDetails(ctx, cert);

  // stamp: the drawn ETMPDP stamp is always there; the company's own seal, when
  // uploaded, is placed on top of it
  drawPlaceholderStamp(ctx, theme, cert, W / 2, 1528);
  if (stamp) {
    // same centre as the drawn seal; its edge falls just around the
    // "ELONATECH ... CERTIFIED" lettering, inside the drawn outer ring
    const { w, h } = fitInto(stamp, 230, 230);
    ctx.drawImage(stamp, W / 2 - w / 2, 1528 - h / 2, w, h);
  }

  // QR code + certificate ID (bottom left)
  const { x, y, size } = LAYOUT.qr;
  const qr = await loadImage(
    await QRCode.toBuffer(verifyUrl(cert.code), { errorCorrectionLevel: "M", margin: 2, width: 600 })
  );
  ctx.fillStyle = "#fff";
  ctx.fillRect(x - 14, y - 14, size + 28, size + 28);
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 14, y - 14, size + 28, size + 28);
  ctx.drawImage(qr, x, y, size, size);

  ctx.textAlign = "left";
  ctx.fillStyle = NAVY;
  ctx.font = `bold 34px ${SERIF}`;
  ctx.fillText("Scan to verify", x + size + 50, y + 70);
  ctx.fillStyle = MUTED;
  ctx.font = `28px ${SERIF}`;
  ctx.fillText("Certificate ID", x + size + 50, y + 130);
  ctx.fillStyle = INK;
  ctx.font = `bold 34px ${MONO}`;
  ctx.fillText(cert.code, x + size + 50, y + 175);
  ctx.fillStyle = MUTED;
  ctx.font = `26px ${SERIF}`;
  ctx.fillText(verifyUrl(cert.code).replace("https://", ""), x + size + 50, y + 225);

  // signature (bottom right): the image sits on the line and dips a few pixels
  // over it, as a pen would; the signatory's name and title go under it (or
  // "Authorised Signature" until they are set). Its height is limited by the
  // closing sentence above it.
  const sig = LAYOUT.signature;
  const sigCenter = sig.right - sig.width / 2;
  if (signature) {
    const { w, h } = fitInto(signature, 580, 180);
    ctx.drawImage(signature, sigCenter - w / 2, sig.y + 24 - h, w, h);
  }
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(sig.right - sig.width, sig.y);
  ctx.lineTo(sig.right, sig.y);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  ctx.font = `bold 34px ${SERIF}`;
  fitFont(ctx, settings.signatoryName || "Authorised Signature", sig.width + 80, 34, SERIF, "bold");
  ctx.fillText(settings.signatoryName || "Authorised Signature", sigCenter, sig.y + 56);
  ctx.fillStyle = MUTED;
  ctx.font = `28px ${SERIF}`;
  ctx.fillText(settings.signatoryName ? settings.signatoryTitle || "" : "Elonatech Nigeria Limited", sigCenter, sig.y + 94);

  // date of issue, under the signature (falls back to the day the record was made)
  const issued = cert.issueDate || cert.createdAt;
  if (issued) {
    const label = "Date of issue: ";
    const date = formatLongDate(issued);
    ctx.font = `28px ${SERIF}`;
    const labelW = ctx.measureText(label).width;
    ctx.font = `bold 28px ${SERIF}`;
    const dateW = ctx.measureText(date).width;
    const startX = sigCenter - (labelW + dateW) / 2;
    ctx.textAlign = "left";
    ctx.fillStyle = MUTED;
    ctx.font = `28px ${SERIF}`;
    ctx.fillText(label, startX, sig.y + 134);
    ctx.fillStyle = INK;
    ctx.font = `bold 28px ${SERIF}`;
    ctx.fillText(date, startX + labelW, sig.y + 134);
  }

  return canvas;
};

// A JPEG for showing on screen (JPEG can't be transparent, and it keeps the
// picture small). 1600px wide is plenty for a screen.
const renderCertificateJpeg = async (cert, assets = {}) => {
  const canvas = await renderCertificateCanvas(cert, { ...assets, width: 1600 });
  return canvas.toBuffer("image/jpeg", 90);
};

// A4-landscape PDF holding ONE flattened picture of the whole certificate, so
// the signature and stamp are not separate objects inside the file.
const renderCertificatePdf = async (cert, assets = {}) => {
  const canvas = await renderCertificateCanvas(cert, { ...assets, width: 2480 });
  const jpeg = canvas.toBuffer("image/jpeg", 92);

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([841.89, 595.28]);
  const image = await pdf.embedJpg(jpeg);
  page.drawImage(image, { x: 0, y: 0, width: 841.89, height: 595.28 });
  pdf.setTitle(`${programLabel(cert.program)} Certificate - ${cert.fullName}`);
  pdf.setSubject(`Certificate ${cert.code}`);
  pdf.setAuthor("Elonatech Nigeria Limited");
  pdf.setCreator("Elonatech");
  return Buffer.from(await pdf.save());
};

module.exports = { renderCertificateCanvas, renderCertificateJpeg, renderCertificatePdf };
