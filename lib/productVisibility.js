// Which products the public site may see. (Blogs use the same status /
// publishAt fields, so the sitemap reuses this rule for them too.)
//
// Hidden: drafts, and anything scheduled for a future time.
// Visible: published items, and scheduled ones whose time has passed.
//
// Items created before scheduling existed have no `status` / `publishAt`
// at all. They must stay visible, so a missing field counts as "fine" — without
// that, every existing product would vanish the moment this filter is applied.
const visibleToPublic = () => ({
  $and: [
    { $or: [{ status: { $exists: false } }, { status: { $in: ["scheduled", "published"] } }] },
    { $or: [{ publishAt: { $exists: false } }, { publishAt: { $lte: new Date() } }] },
  ],
});

// Combine another filter with the visibility rule without either one
// overwriting the other's $and / $or keys.
const onlyVisible = (extra = {}) => ({ $and: [extra, visibleToPublic()] });

module.exports = { visibleToPublic, onlyVisible };
