const request = require("supertest");
const { connect, disconnect } = require("./helpers/db");
const app = require("../index");
const Admin = require("../model/adminModel");
const Product = require("../model/productModel");
const bcrypt = require("bcryptjs");

const email = "productadmin@elonatech.com.ng";
const password = "TestPass123!";
let token;
let createdProductId;

beforeAll(async () => {
  await connect();
  await Admin.deleteMany({ email });
  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ name: "Product Admin", email, password: hashed, role: "superAdmin" });
  const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password });
  token = loginRes.body.access;

  // Seed one product directly into DB for read/delete tests
  const p = await Product.create({
    name: "Test Laptop",
    description: "A laptop for testing",
    price: "150000",
    brand: "TestBrand",
    quantity: 5,
    category: "Computer",
    id: 999999,
    images: [{ public_id: "test/id", url: "https://res.cloudinary.com/test/image/upload/test.jpg" }],
  });
  createdProductId = p._id.toString();
});

afterAll(async () => {
  await Admin.deleteMany({ email });
  await Product.deleteMany({ name: "Test Laptop" });
  await disconnect();
});

describe("Product — GET endpoints (public)", () => {
  it("GET / returns all products", async () => {
    const res = await request(app).get("/api/v1/product");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.getAllProducts)).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(1);
  });

  it("GET /computers returns Computer category", async () => {
    const res = await request(app).get("/api/v1/product/computers");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    if (res.body.data.length > 0) {
      expect(res.body.data[0].category).toBe("Computer");
    }
  });

  it("GET /:id returns the seeded product", async () => {
    const res = await request(app).get(`/api/v1/product/${createdProductId}`);
    expect(res.status).toBe(200);
    expect(res.body.product.name).toBe("Test Laptop");
  });

  it("GET /:id returns 404 for non-existent product", async () => {
    const res = await request(app).get("/api/v1/product/000000000000000000000000");
    expect(res.status).toBe(404);
  });

  it("GET /filter returns filtered products", async () => {
    const res = await request(app).get("/api/v1/product/filter?category=Computer");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /brand returns unique brands and price range", async () => {
    const res = await request(app).get("/api/v1/product/brand");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.brands)).toBe(true);
    expect(typeof res.body.minPrice).toBe("number");
    expect(typeof res.body.maxPrice).toBe("number");
  });
});

describe("Product — POST /create (auth + image required)", () => {
  it("rejects request with no token", async () => {
    const res = await request(app).post("/api/v1/product/create");
    expect([401, 403]).toContain(res.status);
  });

  it("rejects request with valid token but no image files", async () => {
    const res = await request(app)
      .post("/api/v1/product/create")
      .set("x-access-token", token)
      .field("name", "Test Product")
      .field("description", "A test product description")
      .field("price", "50000")
      .field("brand", "TestBrand")
      .field("quantity", "10")
      .field("category", "Computer");
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/image/i);
  });
});

describe("Product — PUT /:id/update (auth required)", () => {
  it("rejects unauthenticated update", async () => {
    const res = await request(app)
      .put(`/api/v1/product/${createdProductId}/update`)
      .send({ name: "Hacked" });
    expect([401, 403]).toContain(res.status);
  });

  it("returns 404 for non-existent product", async () => {
    const res = await request(app)
      .put("/api/v1/product/000000000000000000000000/update")
      .set("x-access-token", token)
      .send({ name: "Ghost Product" });
    expect(res.status).toBe(404);
  });
});

describe("Product — DELETE /:id (auth required)", () => {
  it("rejects unauthenticated delete", async () => {
    const res = await request(app).delete(`/api/v1/product/${createdProductId}`);
    expect([401, 403]).toContain(res.status);
  });

  it("returns 404 for non-existent product", async () => {
    const res = await request(app)
      .delete("/api/v1/product/000000000000000000000000")
      .set("x-access-token", token);
    expect(res.status).toBe(404);
  });

  it("deletes the seeded product with valid token", async () => {
    const res = await request(app)
      .delete(`/api/v1/product/${createdProductId}`)
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
