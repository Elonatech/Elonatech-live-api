const request = require("supertest");
const { connect, disconnect } = require("./helpers/db");
const app = require("../index");
const Admin = require("../model/adminModel");
const Product = require("../model/productModel");
const bcrypt = require("bcryptjs");

const email = "productscheduler@elonatech.com.ng";
const password = "TestPass123!";
const PREFIX = "SchedTest ";
let token;
const ids = {};

const HOUR = 60 * 60 * 1000;
const baseDoc = (name, extra = {}) => ({
  name: `${PREFIX}${name}`,
  description: "scheduling test product",
  price: 100000,
  brand: "SchedBrand",
  quantity: "3",
  category: "Computer",
  images: [{ public_id: "test/id", url: "https://res.cloudinary.com/test/image/upload/test.jpg" }],
  ...extra,
});

// The public list endpoints are cached in Redis by full URL, so every list
// request below carries a unique query string to guarantee a fresh read.
const fresh = (path) => `${path}${path.includes("?") ? "&" : "?"}t=${Date.now()}${Math.random()}`;

beforeAll(async () => {
  await connect();
  await Admin.deleteMany({ email });
  await Admin.create({ name: "Scheduler", email, password: await bcrypt.hash(password, 10), role: "superAdmin" });
  token = (await request(app).post("/api/v1/auth/login").send({ email, password })).body.access;

  await Product.deleteMany({ name: new RegExp(`^${PREFIX}`) });

  const published = await Product.create(baseDoc("published", { status: "published", publishAt: new Date(Date.now() - HOUR) }));
  const future = await Product.create(baseDoc("future", { status: "scheduled", publishAt: new Date(Date.now() + 24 * HOUR) }));
  const draft = await Product.create(baseDoc("draft", { status: "draft", publishAt: new Date(Date.now() + 24 * HOUR) }));

  // A scheduled product whose time has passed but whose stored status was never
  // flipped (the pre-save hook would flip it, so push the date back with a raw update).
  const due = await Product.create(baseDoc("due", { status: "scheduled", publishAt: new Date(Date.now() + 24 * HOUR) }));
  await Product.updateOne({ _id: due._id }, { $set: { publishAt: new Date(Date.now() - HOUR) } });

  // A product from before scheduling existed: no status, no publishAt at all.
  const legacyInsert = await Product.collection.insertOne({
    ...baseDoc("legacy"),
    slug: `${PREFIX.trim().toLowerCase()}-legacy-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  ids.published = published._id.toString();
  ids.future = future._id.toString();
  ids.futureSlug = future.slug;
  ids.draft = draft._id.toString();
  ids.due = due._id.toString();
  ids.legacy = legacyInsert.insertedId.toString();
});

afterAll(async () => {
  await Product.deleteMany({ name: new RegExp(`^${PREFIX}`) });
  await Admin.deleteMany({ email });
  await disconnect();
});

const names = (list) => list.map((p) => p.name.replace(PREFIX, ""));

describe("Product scheduling — what the public can see", () => {
  it("lists published, due-scheduled and legacy products, but not future-scheduled or draft ones", async () => {
    const res = await request(app).get(fresh("/api/v1/product"));
    expect(res.status).toBe(200);
    const mine = names(res.body.getAllProducts.filter((p) => p.name.startsWith(PREFIX)));
    expect(mine.sort()).toEqual(["due", "legacy", "published"]);
  });

  it("applies the same rule to the category list", async () => {
    const res = await request(app).get(fresh("/api/v1/product/computers"));
    expect(res.status).toBe(200);
    const mine = names(res.body.data.filter((p) => p.name.startsWith(PREFIX)));
    expect(mine.sort()).toEqual(["due", "legacy", "published"]);
  });

  it("applies the same rule to the filtered lists", async () => {
    const res = await request(app).get(fresh("/api/v1/product/filter?category=Computer"));
    expect(names(res.body.data.filter((p) => p.name.startsWith(PREFIX))).sort()).toEqual(["due", "legacy", "published"]);
    const all = await request(app).get(fresh("/api/v1/product/filter/all"));
    expect(names(all.body.data.filter((p) => p.name.startsWith(PREFIX))).sort()).toEqual(["due", "legacy", "published"]);
  });

  it("404s a future-scheduled product by id AND by slug", async () => {
    expect((await request(app).get(`/api/v1/product/${ids.future}`)).status).toBe(404);
    expect((await request(app).get(`/api/v1/product/${ids.futureSlug}`)).status).toBe(404);
  });

  it("404s a draft by id", async () => {
    expect((await request(app).get(`/api/v1/product/${ids.draft}`)).status).toBe(404);
  });

  it("serves published, due-scheduled and legacy products by id", async () => {
    for (const key of ["published", "due", "legacy"]) {
      const res = await request(app).get(`/api/v1/product/${ids[key]}`);
      expect(res.status).toBe(200);
    }
  });

  it("never offers a hidden product as 'related' or 'next', and 404s them as the base product", async () => {
    const related = await request(app).get(`/api/v1/product/${ids.published}/related`);
    expect(related.status).toBe(200);
    expect(names(related.body.relatedProducts.filter((p) => p.name.startsWith(PREFIX)))).not.toEqual(
      expect.arrayContaining(["future"])
    );
    expect(names(related.body.relatedProducts.filter((p) => p.name.startsWith(PREFIX)))).not.toContain("draft");
    expect((await request(app).get(`/api/v1/product/${ids.future}/related`)).status).toBe(404);
    expect((await request(app).get(`/api/v1/product/${ids.future}/next`)).status).toBe(404);
  });

  it("keeps scheduled products out of the sitemap", async () => {
    const res = await request(app).get(fresh("/sitemap.xml"));
    expect(res.status).toBe(200);
    expect(res.text).toContain(ids.published);
    expect(res.text).not.toContain(ids.future);
    expect(res.text).not.toContain(ids.draft);
  });
});

describe("Product scheduling — admin side", () => {
  it("requires a token for the admin endpoints", async () => {
    expect([401, 403]).toContain((await request(app).get("/api/v1/product/admin/all")).status);
    expect([401, 403]).toContain((await request(app).get(`/api/v1/product/admin/${ids.future}`)).status);
  });

  it("admin list shows every status, and flips a due scheduled product to published", async () => {
    const res = await request(app).get("/api/v1/product/admin/all").set("x-access-token", token);
    expect(res.status).toBe(200);
    const mine = res.body.products.filter((p) => p.name.startsWith(PREFIX));
    expect(names(mine).sort()).toEqual(["draft", "due", "future", "legacy", "published"]);
    const byName = Object.fromEntries(mine.map((p) => [p.name.replace(PREFIX, ""), p]));
    expect(byName.future.status).toBe("scheduled");
    expect(byName.draft.status).toBe("draft");
    expect(byName.due.status).toBe("published"); // settled on read
    expect(byName.legacy.status).toBe("published"); // schema default
    expect(byName.legacy.publishAt).toBeUndefined(); // old products are NOT given a fake "today" date
  });

  it("admin single-product read returns a hidden product", async () => {
    const res = await request(app).get(`/api/v1/product/admin/${ids.future}`).set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.product.status).toBe("scheduled");
  });

  it("rejects an invalid publishAt", async () => {
    const res = await request(app)
      .post("/api/v1/product/create")
      .set("x-access-token", token)
      .field("name", "SchedTest bad date")
      .field("brand", "B")
      .field("price", "1000")
      .field("category", "Computer")
      .field("publishAt", "not-a-date");
    expect(res.status).toBe(400);
  });

  it("rescheduling a published product hides it; publishing it again shows it", async () => {
    const full = { name: `${PREFIX}published`, description: "x", price: 100000, brand: "SchedBrand", category: "Computer" };

    const hide = await request(app)
      .put(`/api/v1/product/${ids.published}/update`)
      .set("x-access-token", token)
      .send({ ...full, publishAt: new Date(Date.now() + 48 * HOUR).toISOString() });
    expect(hide.status).toBe(200);
    expect(hide.body.newUpdateProduct.status).toBe("scheduled");
    expect((await request(app).get(`/api/v1/product/${ids.published}`)).status).toBe(404);

    const show = await request(app)
      .put(`/api/v1/product/${ids.published}/update`)
      .set("x-access-token", token)
      .send({ ...full, status: "published" });
    expect(show.status).toBe(200);
    expect(show.body.newUpdateProduct.status).toBe("published");
    expect((await request(app).get(`/api/v1/product/${ids.published}`)).status).toBe(200);
  });

  it("a normal edit (no scheduling fields) does not change status", async () => {
    const res = await request(app)
      .put(`/api/v1/product/${ids.future}/update`)
      .set("x-access-token", token)
      .send({ name: `${PREFIX}future`, description: "edited", price: 100000, brand: "SchedBrand", category: "Computer" });
    expect(res.status).toBe(200);
    expect(res.body.newUpdateProduct.status).toBe("scheduled");
  });
});
