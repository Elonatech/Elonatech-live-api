// One-off migration helper — NOT part of the running app.
//
// Reads scripts/cloudinary-filenames.txt (one image filename per line, no
// extension — e.g. "Hp_essential-removebg-preview_dul8r5") and looks each
// one up in the Cloudinary account configured in .env via the Search API.
//
// Run with:  node scripts/findCloudinaryUrls.js
//
// Before running: make sure .env's CLOUD_NAME / CLOUDINARY_API_KEY /
// CLOUDINARY_API_SECRET point at the NEW Cloudinary account (dahnwukbz),
// not the old one — this script searches whichever account lib/cloudinary.js
// is configured for.
//
// Output:
//   scripts/cloudinary-url-map.json     — { oldFilename: newSecureUrl }      (exactly 1 match)
//   scripts/cloudinary-ambiguous.json   — { oldFilename: [candidate urls] }  (more than 1 match — pick manually)
//   scripts/cloudinary-not-found.txt    — filenames with zero matches

const fs = require("fs");
const path = require("path");
const cloudinary = require("../lib/cloudinary");

// Pass a filename as the first CLI arg to use a different input list, e.g.:
//   node scripts/findCloudinaryUrls.js cloudinary-filenames-web.txt
// Output files are named to match, so separate runs don't overwrite each other.
const inputName = process.argv[2] || "cloudinary-filenames.txt";
const suffix = inputName.replace(/^cloudinary-filenames/, "").replace(/\.txt$/, "");
const INPUT_FILE = path.join(__dirname, inputName);
const MAP_OUT = path.join(__dirname, `cloudinary-url-map${suffix}.json`);
const AMBIGUOUS_OUT = path.join(__dirname, `cloudinary-ambiguous${suffix}.json`);
const NOT_FOUND_OUT = path.join(__dirname, `cloudinary-not-found${suffix}.txt`);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const run = async () => {
  const filenames = fs
    .readFileSync(INPUT_FILE, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  console.log(`Looking up ${filenames.length} filenames in Cloudinary account "${cloudinary.config().cloud_name}"...`);

  const found = {};
  const ambiguous = {};
  const notFound = [];

  for (let i = 0; i < filenames.length; i++) {
    const name = filenames[i];
    try {
      const result = await cloudinary.search
        .expression(`filename:${name}`)
        .max_results(10)
        .execute();

      if (result.resources.length === 0) {
        notFound.push(name);
      } else if (result.resources.length === 1) {
        found[name] = result.resources[0].secure_url;
      } else {
        ambiguous[name] = result.resources.map((r) => r.secure_url);
      }
    } catch (error) {
      console.error(`Error searching "${name}":`, error.message);
      notFound.push(name);
    }

    if ((i + 1) % 20 === 0) {
      console.log(`  ${i + 1}/${filenames.length} done...`);
    }

    // Stay well under Cloudinary's rate limit
    await sleep(200);
  }

  fs.writeFileSync(MAP_OUT, JSON.stringify(found, null, 2));
  fs.writeFileSync(AMBIGUOUS_OUT, JSON.stringify(ambiguous, null, 2));
  fs.writeFileSync(NOT_FOUND_OUT, notFound.join("\n"));

  console.log(`\nDone.`);
  console.log(`  Matched (1 result):   ${Object.keys(found).length} → ${MAP_OUT}`);
  console.log(`  Ambiguous (>1):       ${Object.keys(ambiguous).length} → ${AMBIGUOUS_OUT}`);
  console.log(`  Not found:            ${notFound.length} → ${NOT_FOUND_OUT}`);
};

run().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
