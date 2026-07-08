const request = require("supertest");
const { connect, disconnect } = require("./helpers/db");
const app = require("../index");
const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");

const masterEmail = "mastertest@elonatech.com.ng";
const superEmail = "supertest@elonatech.com.ng";
const normalEmail = "normaltest@elonatech.com.ng";
const password = "TestPass123!";

let masterToken, superToken, normalToken;
let createdAdminId;

beforeAll(async () => {
  await connect();
  await Admin.deleteMany({ email: { $in: [masterEmail, superEmail, normalEmail, "created@elonatech.com.ng"] } });

  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ name: "Master", email: masterEmail, password: hashed, role: "superAdmin", isMaster: true });
  await Admin.create({ name: "Super", email: superEmail, password: hashed, role: "superAdmin" });
  await Admin.create({ name: "Normal", email: normalEmail, password: hashed, role: "admin" });

  masterToken = (await request(app).post("/api/v1/auth/login").send({ email: masterEmail, password })).body.access;
  superToken = (await request(app).post("/api/v1/auth/login").send({ email: superEmail, password })).body.access;
  normalToken = (await request(app).post("/api/v1/auth/login").send({ email: normalEmail, password })).body.access;
});

afterAll(async () => {
  await Admin.deleteMany({ email: { $in: [masterEmail, superEmail, normalEmail, "created@elonatech.com.ng"] } });
  await disconnect();
});

describe("Admin — GET /all", () => {
  it("blocks normal admin", async () => {
    const res = await request(app).get("/api/v1/auth/all").set("x-access-token", normalToken);
    expect(res.status).toBe(403);
  });

  it("allows super admin and returns admins array", async () => {
    const res = await request(app).get("/api/v1/auth/all").set("x-access-token", superToken);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.admins)).toBe(true);
  });
});

describe("Admin — POST /create", () => {
  it("super admin can create a normal admin", async () => {
    const res = await request(app)
      .post("/api/v1/auth/create")
      .set("x-access-token", superToken)
      .send({ name: "New Admin", email: "created@elonatech.com.ng", password, role: "admin" });
    expect(res.status).toBe(201);
    createdAdminId = res.body.data?._id;
  });

  it("rejects duplicate email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/create")
      .set("x-access-token", superToken)
      .send({ name: "Dupe", email: normalEmail, password, role: "admin" });
    expect(res.status).toBe(409);
  });

  it("rejects short password via validation", async () => {
    const res = await request(app)
      .post("/api/v1/auth/create")
      .set("x-access-token", superToken)
      .send({ name: "Short PW", email: "shortpw@elonatech.com.ng", password: "123", role: "admin" });
    expect(res.status).toBe(400);
  });
});

describe("Admin — PATCH /:id (permission checks)", () => {
  it("normal admin cannot edit a super admin", async () => {
    const superAdmin = await Admin.findOne({ email: superEmail });
    const res = await request(app)
      .patch(`/api/v1/auth/${superAdmin._id}`)
      .set("x-access-token", normalToken)
      .send({ name: "Hacked" });
    expect(res.status).toBe(403);
  });

  it("super admin cannot edit master account", async () => {
    const master = await Admin.findOne({ email: masterEmail });
    const res = await request(app)
      .patch(`/api/v1/auth/${master._id}`)
      .set("x-access-token", superToken)
      .send({ name: "Hacked Master" });
    expect(res.status).toBe(403);
  });

  it("master can update a normal admin's name", async () => {
    const normal = await Admin.findOne({ email: normalEmail });
    const res = await request(app)
      .patch(`/api/v1/auth/${normal._id}`)
      .set("x-access-token", masterToken)
      .send({ name: "Updated Normal" });
    expect(res.status).toBe(200);
    expect(res.body.admin.name).toBe("Updated Normal");
  });
});

describe("Admin — DELETE /:id (permission checks)", () => {
  it("cannot delete own account", async () => {
    const superAdmin = await Admin.findOne({ email: superEmail });
    const res = await request(app)
      .delete(`/api/v1/auth/${superAdmin._id}`)
      .set("x-access-token", superToken);
    expect(res.status).toBe(403);
  });

  it("normal admin cannot delete super admin", async () => {
    const superAdmin = await Admin.findOne({ email: superEmail });
    const res = await request(app)
      .delete(`/api/v1/auth/${superAdmin._id}`)
      .set("x-access-token", normalToken);
    expect(res.status).toBe(403);
  });

  it("master can delete a normal admin", async () => {
    if (!createdAdminId) return;
    const res = await request(app)
      .delete(`/api/v1/auth/${createdAdminId}`)
      .set("x-access-token", masterToken);
    expect(res.status).toBe(200);
    createdAdminId = null;
  });

  it("returns 404 for non-existent admin", async () => {
    const res = await request(app)
      .delete("/api/v1/auth/000000000000000000000000")
      .set("x-access-token", masterToken);
    expect(res.status).toBe(404);
  });
});
