const request = require("supertest");
const { connect, disconnect } = require("./helpers/db");
const app = require("../index");
const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");

const email = "testadmin@elonatech.com.ng";
const password = "TestPass123!";

beforeAll(async () => {
  await connect();
  await Admin.deleteMany({ email });
  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ name: "Test Admin", email, password: hashed, role: "admin" });
});

afterAll(async () => {
  await Admin.deleteMany({ email });
  await disconnect();
});

describe("Auth — login", () => {
  it("rejects missing email field", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({ password });
    expect(res.status).toBe(400);
  });

  it("rejects wrong password", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({ email, password: "wrongpassword" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it("succeeds with correct credentials and returns access token", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.access).toBeDefined();
    expect(res.body.email).toBe(email);
    // JWT should now carry name and email
    const payload = JSON.parse(Buffer.from(res.body.access.split(".")[1], "base64").toString());
    expect(payload.email).toBe(email);
    expect(payload.name).toBe("Test Admin");
  });
});

describe("Auth — refresh & logout", () => {
  it("POST /refresh returns 401 with no cookie", async () => {
    const res = await request(app).post("/api/v1/auth/refresh");
    expect(res.status).toBe(401);
  });

  it("POST /logout always returns 200", async () => {
    const res = await request(app).post("/api/v1/auth/logout");
    expect(res.status).toBe(200);
  });
});

describe("Auth — protected routes", () => {
  it("GET /all rejects unauthenticated request", async () => {
    const res = await request(app).get("/api/v1/auth/all");
    expect([401, 403]).toContain(res.status);
  });

  it("GET /all rejects normal admin (not superAdmin)", async () => {
    const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password });
    const res = await request(app)
      .get("/api/v1/auth/all")
      .set("x-access-token", loginRes.body.access);
    expect(res.status).toBe(403);
  });

  it("POST /verify-admin returns isAdmin: true for valid token", async () => {
    const loginRes = await request(app).post("/api/v1/auth/login").send({ email, password });
    const res = await request(app)
      .post("/api/v1/auth/verify-admin")
      .set("x-access-token", loginRes.body.access);
    expect(res.status).toBe(200);
    expect(res.body.isAdmin).toBe(true);
  });
});
