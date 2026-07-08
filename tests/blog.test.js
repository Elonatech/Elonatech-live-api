const request = require("supertest");
const { connect, disconnect } = require("./helpers/db");
const app = require("../index");
const Admin = require("../model/adminModel");
const Blog = require("../model/blogModel");
const bcrypt = require("bcryptjs");

const email = "blogadmin@elonatech.com.ng";
const password = "TestPass123!";
let token;
let createdBlogId;

beforeAll(async () => {
  await connect();
  await Admin.deleteMany({ email });
  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ name: "Blog Admin", email, password: hashed, role: "superAdmin" });
  const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password });
  token = loginRes.body.access;
});

afterAll(async () => {
  await Admin.deleteMany({ email });
  if (createdBlogId) await Blog.findByIdAndDelete(createdBlogId);
  await disconnect();
});

describe("Blog — GET endpoints (public)", () => {
  it("GET / returns blog list without description field", async () => {
    const res = await request(app).get("/api/v1/blog");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.getAllBlogs)).toBe(true);
    // description is excluded from list for performance
    if (res.body.getAllBlogs.length > 0) {
      expect(res.body.getAllBlogs[0].description).toBeUndefined();
    }
  });

  it("GET /news returns news list", async () => {
    const res = await request(app).get("/api/v1/blog/news");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("GET /trends returns trends list", async () => {
    const res = await request(app).get("/api/v1/blog/trends");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("GET /:id returns 404 for non-existent blog", async () => {
    const res = await request(app).get("/api/v1/blog/000000000000000000000000");
    expect(res.status).toBe(404);
  });
});

describe("Blog — POST /create (auth required)", () => {
  it("rejects request with no token", async () => {
    const res = await request(app)
      .post("/api/v1/blog/create")
      .field("title", "Test Blog")
      .field("description", "Long enough description here.")
      .field("author", "Tester")
      .field("category", JSON.stringify(["blog"]));
    expect([401, 403]).toContain(res.status);
  });

  it("rejects request with no image file", async () => {
    const res = await request(app)
      .post("/api/v1/blog/create")
      .set("x-access-token", token)
      .field("title", "Test Blog")
      .field("description", "Long enough description here.")
      .field("author", "Tester")
      .field("category", JSON.stringify(["blog"]));
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/image/i);
  });

  it("rejects missing title via validation", async () => {
    const res = await request(app)
      .post("/api/v1/blog/create")
      .set("x-access-token", token)
      .field("description", "Long enough description here.")
      .field("author", "Tester")
      .field("category", JSON.stringify(["blog"]));
    expect(res.status).toBe(400);
  });

  it("rejects description shorter than 10 characters", async () => {
    const res = await request(app)
      .post("/api/v1/blog/create")
      .set("x-access-token", token)
      .field("title", "Valid Title")
      .field("description", "Short")
      .field("author", "Tester")
      .field("category", JSON.stringify(["blog"]));
    expect(res.status).toBe(400);
  });
});

describe("Blog — DELETE /:id (auth required)", () => {
  it("rejects unauthenticated delete", async () => {
    const res = await request(app).delete("/api/v1/blog/000000000000000000000000");
    expect([401, 403]).toContain(res.status);
  });

  it("returns 404 when deleting non-existent blog", async () => {
    const res = await request(app)
      .delete("/api/v1/blog/000000000000000000000000")
      .set("x-access-token", token);
    expect(res.status).toBe(404);
  });
});
