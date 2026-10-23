const request = require("supertest");
const { connect, disconnect } = require("./helpers/db");
const app = require("../index");
const Admin = require("../model/adminModel");
const Certificate = require("../model/certificateModel");
const bcrypt = require("bcryptjs");
const { generateCode, normalizeCode } = require("../lib/certificateCode");

const email = "certificatetester@elonatech.com.ng";
const password = "TestPass123!";
const PREFIX = "CertTest ";
let token;
let normalToken; // a normal (non-super) admin
const normalEmail = "certificatenormal@elonatech.com.ng";

const auth = (req) => req.set("x-access-token", token);
const body = (extra = {}) => ({
  fullName: `${PREFIX}Ada Obi`,
  program: "Core",
  completionDate: "2026-08-15",
  enrollmentDate: "2026-05-01",
  ...extra,
});

beforeAll(async () => {
  await connect();
  await Admin.deleteMany({ email: { $in: [email, normalEmail] } });
  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ name: "Cert Tester", email, password: hashed, role: "superAdmin" });
  await Admin.create({ name: "Cert Normal", email: normalEmail, password: hashed, role: "admin" });
  token = (await request(app).post("/api/v1/auth/login").send({ email, password })).body.access;
  normalToken = (await request(app).post("/api/v1/auth/login").send({ email: normalEmail, password })).body.access;
  await Certificate.deleteMany({ fullName: new RegExp(`^${PREFIX}`) });
});

afterAll(async () => {
  await Certificate.deleteMany({ fullName: new RegExp(`^${PREFIX}`) });
  await Admin.deleteMany({ email: { $in: [email, normalEmail] } });
  await disconnect();
});

describe("certificate code", () => {
  it("generates codes in the ETMPDP-XXXXXXXX-CC shape that validate", () => {
    for (let i = 0; i < 200; i += 1) {
      const code = generateCode();
      expect(code).toMatch(/^ETMPDP-[2-9A-HJKMNP-Z]{8}-[2-9A-HJKMNP-Z]{2}$/);
      expect(normalizeCode(code)).toBe(code);
    }
  });

  it("never repeats across a large batch", () => {
    const codes = new Set(Array.from({ length: 5000 }, generateCode));
    expect(codes.size).toBe(5000);
  });

  it("accepts lowercase and stray spaces", () => {
    const code = generateCode();
    expect(normalizeCode(`  ${code.toLowerCase()} `)).toBe(code);
  });

  it("rejects a mistyped character, a swapped pair, and junk", () => {
    const code = generateCode();
    const [prefix, bodyPart, check] = code.split("-");
    const other = bodyPart[0] === "2" ? "3" : "2";
    expect(normalizeCode(`${prefix}-${other}${bodyPart.slice(1)}-${check}`)).toBeNull();

    const swapped = bodyPart[0] !== bodyPart[1] ? `${bodyPart[1]}${bodyPart[0]}${bodyPart.slice(2)}` : null;
    if (swapped) expect(normalizeCode(`${prefix}-${swapped}-${check}`)).toBeNull();

    expect(normalizeCode("")).toBeNull();
    expect(normalizeCode(undefined)).toBeNull();
    expect(normalizeCode("ETMPDP-12345678-AB")).toBeNull();
    expect(normalizeCode("hello")).toBeNull();
  });
});

describe("admin endpoints need a token", () => {
  it("rejects create, list, update and delete without one", async () => {
    expect((await request(app).post("/api/v1/certificates").send(body())).status).toBe(403);
    expect((await request(app).get("/api/v1/certificates/all")).status).toBe(403);
    expect((await request(app).patch("/api/v1/certificates/abc").send({})).status).toBe(403);
    expect((await request(app).delete("/api/v1/certificates/abc")).status).toBe(403);
  });
});

describe("only super admins can manage certificates", () => {
  const asNormal = (req) => req.set("x-access-token", normalToken);

  it("refuses a normal admin on every admin endpoint", async () => {
    const made = (await auth(request(app).post("/api/v1/certificates")).send(body({ fullName: `${PREFIX}Guarded` }))).body.data;

    expect((await asNormal(request(app).get("/api/v1/certificates/all"))).status).toBe(403);
    expect((await asNormal(request(app).post("/api/v1/certificates")).send(body())).status).toBe(403);
    expect(
      (await asNormal(request(app).post("/api/v1/certificates/bulk")).send({ certificates: [body()] })).status
    ).toBe(403);
    expect((await asNormal(request(app).patch(`/api/v1/certificates/${made._id}`)).send({ status: "revoked" })).status).toBe(403);
    expect((await asNormal(request(app).delete(`/api/v1/certificates/${made._id}`))).status).toBe(403);

    // and nothing was changed or created behind the 403s
    const still = await Certificate.findById(made._id);
    expect(still.status).toBe("valid");
    expect(await Certificate.countDocuments({ fullName: new RegExp(`^${PREFIX}`), createdAt: { $gte: new Date(Date.now() - 1000 * 60) } })).toBeGreaterThan(0);
  });

  it("does not let a normal admin create anything", async () => {
    const before = await Certificate.countDocuments({ fullName: `${PREFIX}NormalTried` });
    await asNormal(request(app).post("/api/v1/certificates")).send(body({ fullName: `${PREFIX}NormalTried` }));
    expect(await Certificate.countDocuments({ fullName: `${PREFIX}NormalTried` })).toBe(before);
  });

  it("still lets a super admin do all of it", async () => {
    expect((await auth(request(app).get("/api/v1/certificates/all"))).status).toBe(200);
    expect((await auth(request(app).post("/api/v1/certificates")).send(body({ fullName: `${PREFIX}SuperOk` }))).status).toBe(201);
  });

  it("keeps the public verify and list open to everyone", async () => {
    expect((await request(app).get("/api/v1/certificates/public")).status).toBe(200);
  });
});

describe("issuing certificates", () => {
  it("creates a certificate with a generated code", async () => {
    const res = await auth(request(app).post("/api/v1/certificates")).send(body());
    expect(res.status).toBe(201);
    expect(normalizeCode(res.body.data.code)).toBe(res.body.data.code);
    expect(res.body.data.status).toBe("valid");
    expect(res.body.data.program).toBe("Core");
  });

  it("ignores a code sent by the client", async () => {
    const res = await auth(request(app).post("/api/v1/certificates")).send(body({ code: "ETMPDP-AAAAAAAA-AA" }));
    expect(res.status).toBe(201);
    expect(res.body.data.code).not.toBe("ETMPDP-AAAAAAAA-AA");
  });

  it("refuses bad input", async () => {
    const bad = async (extra) => (await auth(request(app).post("/api/v1/certificates")).send(body(extra))).status;
    expect(await bad({ fullName: "A" })).toBe(400);
    expect(await bad({ program: "Hub" })).toBe(400);
    expect(await bad({ completionDate: "not a date" })).toBe(400);
    expect(await bad({ completionDate: "2999-01-01" })).toBe(400);
    expect(await bad({ enrollmentDate: "2026-09-01", completionDate: "2026-08-15" })).toBe(400);
  });

  it("allows a missing enrollment date", async () => {
    const res = await auth(request(app).post("/api/v1/certificates")).send(body({ enrollmentDate: "" }));
    expect(res.status).toBe(201);
    expect(res.body.data.enrollmentDate).toBeUndefined();
  });

  it("issues a whole cohort in bulk, each with its own code", async () => {
    const certificates = ["Bola", "Chidi", "Dayo"].map((n) => ({
      fullName: `${PREFIX}${n}`,
      program: "Ignite",
      completionDate: "2026-09-30",
    }));
    const res = await auth(request(app).post("/api/v1/certificates/bulk")).send({ certificates });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveLength(3);
    expect(new Set(res.body.data.map((c) => c.code)).size).toBe(3);
  });

  it("refuses an empty or oversized bulk request", async () => {
    expect((await auth(request(app).post("/api/v1/certificates/bulk")).send({ certificates: [] })).status).toBe(400);
    const tooMany = Array.from({ length: 201 }, (_, i) => ({ fullName: `${PREFIX}${i}x`, program: "Core", completionDate: "2026-09-30" }));
    expect((await auth(request(app).post("/api/v1/certificates/bulk")).send({ certificates: tooMany })).status).toBe(400);
  });
});

describe("details printed on the certificate", () => {
  const create = (extra) => auth(request(app).post("/api/v1/certificates")).send(body({ fullName: `${PREFIX}Detail ${Math.random()}`, ...extra }));

  it("stores duration, pathway level, specialization and issue date, and verify returns them", async () => {
    const res = await create({
      program: "Ignite",
      duration: " 6 months ",
      pathwayLevel: "Intermediate",
      specialization: "Network Engineering",
      issueDate: "2026-09-01",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.duration).toBe("6 months"); // trimmed

    const verify = await request(app).get(`/api/v1/certificates/verify/${res.body.data.code}`);
    expect(verify.body.certificate).toMatchObject({
      duration: "6 months",
      pathwayLevel: "Intermediate",
      specialization: "Network Engineering",
    });
    expect(verify.body.certificate.issueDate).toMatch(/^2026-09-01/);
  });

  it("uses the creation date as the date of issue when none is given", async () => {
    const res = await create({});
    const verify = await request(app).get(`/api/v1/certificates/verify/${res.body.data.code}`);
    expect(new Date(verify.body.certificate.issueDate).toDateString()).toBe(new Date().toDateString());
  });

  it("refuses over-long lines and a bad issue date", async () => {
    expect((await create({ duration: "x".repeat(41) })).status).toBe(400);
    expect((await create({ specialization: "x".repeat(121) })).status).toBe(400);
    expect((await create({ issueDate: "not a date" })).status).toBe(400);
  });

  it("lets an edit change or clear a line, and ignores blank dates", async () => {
    const made = (await create({ duration: "12 months", specialization: "Cloud" })).body.data;
    const edited = await auth(request(app).patch(`/api/v1/certificates/${made._id}`)).send({
      duration: "",
      specialization: "Security",
      enrollmentDate: "",
      issueDate: "",
    });
    expect(edited.status).toBe(200);
    expect(edited.body.data.duration).toBe("");
    expect(edited.body.data.specialization).toBe("Security");
    expect(edited.body.data.enrollmentDate).toBeDefined(); // a blank date leaves the saved one alone
  });

  it("accepts the new columns in a bulk request", async () => {
    const res = await auth(request(app).post("/api/v1/certificates/bulk")).send({
      certificates: [{ fullName: `${PREFIX}Bulk Detail`, program: "Ignite", completionDate: "2026-09-30", duration: "6 months", pathwayLevel: "Beginner", specialization: "Cyber" }],
    });
    expect(res.status).toBe(201);
    expect(res.body.data[0]).toMatchObject({ duration: "6 months", pathwayLevel: "Beginner", specialization: "Cyber" });
  });
});

describe("admin list", () => {
  it("searches by name or code and filters by program", async () => {
    const byName = await auth(request(app).get(`/api/v1/certificates/all?q=${encodeURIComponent(PREFIX + "Chidi")}`));
    expect(byName.status).toBe(200);
    expect(byName.body.certificates).toHaveLength(1);

    const code = byName.body.certificates[0].code;
    const byCode = await auth(request(app).get(`/api/v1/certificates/all?q=${code.toLowerCase()}`));
    expect(byCode.body.certificates.map((c) => c.code)).toContain(code);

    const ignite = await auth(request(app).get(`/api/v1/certificates/all?program=Ignite&q=${encodeURIComponent(PREFIX)}`));
    expect(ignite.body.certificates.every((c) => c.program === "Ignite")).toBe(true);
    expect(ignite.body.total).toBeGreaterThanOrEqual(3); // other describes also issue Ignite records
  });

  it("treats regex characters in the search as plain text", async () => {
    const res = await auth(request(app).get("/api/v1/certificates/all?q=.*"));
    expect(res.status).toBe(200);
    expect(res.body.certificates.every((c) => /\.\*/.test(c.fullName + c.code))).toBe(true);
  });
});

describe("public list (unlisted page)", () => {
  const LIST_PREFIX = `${PREFIX}List `;
  let revokedId;

  beforeAll(async () => {
    const rows = ["Ayo", "Bisi", "Chuka", "Dara", "Efe"].map((n, i) => ({
      fullName: `${LIST_PREFIX}${n}`,
      program: i % 2 ? "Ignite" : "Core",
      completionDate: `2026-0${i + 1}-10`,
    }));
    const created = (await auth(request(app).post("/api/v1/certificates/bulk")).send({ certificates: rows })).body.data;
    revokedId = created.find((c) => c.fullName.endsWith("Chuka"))._id;
    await auth(request(app).patch(`/api/v1/certificates/${revokedId}`)).send({ status: "revoked" });
  });

  const list = (qs = "") => request(app).get(`/api/v1/certificates/public?q=${encodeURIComponent(LIST_PREFIX)}${qs}`);

  it("needs no token and lists valid certificates only", async () => {
    const res = await list();
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(4); // five issued, one revoked
    expect(res.body.certificates.map((c) => c.fullName)).not.toContain(`${LIST_PREFIX}Chuka`);
    expect(res.headers["cache-control"]).toBe("no-store");
  });

  it("returns only name, programme, completion date and code", async () => {
    const res = await list();
    for (const c of res.body.certificates) {
      expect(Object.keys(c).sort()).toEqual(["code", "completionDate", "fullName", "program"]);
    }
    expect(JSON.stringify(res.body)).not.toMatch(/issuedBy|_id|certificatetester|status/);
  });

  it("reports headline counts that ignore the search and exclude revoked", async () => {
    const all = (await request(app).get("/api/v1/certificates/public")).body.counts;
    const searched = (await list()).body.counts;
    expect(all.all).toBe(all.Core + all.Ignite);
    expect(searched).toEqual(all); // a search doesn't change the headline numbers

    // a certificate of its own, so the other tests in this block are untouched
    const mine = (await auth(request(app).post("/api/v1/certificates")).send(body({ fullName: `${PREFIX}Counted` }))).body.data;
    const before = (await request(app).get("/api/v1/certificates/public")).body.counts.all;
    expect(before).toBe(all.all + 1);
    await auth(request(app).patch(`/api/v1/certificates/${mine._id}`)).send({ status: "revoked" });
    const after = (await request(app).get("/api/v1/certificates/public")).body.counts;
    expect(after.all).toBe(before - 1);
  });

  it("lists the most recently completed first", async () => {
    const dates = (await list()).body.certificates.map((c) => c.completionDate);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("filters by program and by name", async () => {
    const core = await list("&program=Core");
    expect(core.body.certificates.every((c) => c.program === "Core")).toBe(true);

    const byName = await request(app).get(`/api/v1/certificates/public?q=${encodeURIComponent(LIST_PREFIX + "bisi")}`);
    expect(byName.body.certificates).toHaveLength(1);
  });

  it("pages the results", async () => {
    const first = await list("&limit=3&page=1");
    const second = await list("&limit=3&page=2");
    expect(first.body.certificates).toHaveLength(3);
    expect(second.body.certificates).toHaveLength(1);
    expect(first.body.totalPages).toBe(2);
    const codes = [...first.body.certificates, ...second.body.certificates].map((c) => c.code);
    expect(new Set(codes).size).toBe(4);
  });

  it("caps the page size", async () => {
    const res = await request(app).get("/api/v1/certificates/public?limit=9999");
    expect(res.body.certificates.length).toBeLessThanOrEqual(50);
  });

  it("treats regex characters in the search as plain text", async () => {
    const res = await request(app).get("/api/v1/certificates/public?q=.*");
    expect(res.status).toBe(200);
    expect(res.body.certificates.every((c) => /\.\*/.test(c.fullName + c.code))).toBe(true);
  });

  it("drops a certificate from the list the moment it is revoked", async () => {
    const before = (await list()).body.total;
    const victim = (await list()).body.certificates[0];
    const id = (await auth(request(app).get(`/api/v1/certificates/all?q=${victim.code}`))).body.certificates[0]._id;
    await auth(request(app).patch(`/api/v1/certificates/${id}`)).send({ status: "revoked" });
    expect((await list()).body.total).toBe(before - 1);
  });
});

describe("public verification", () => {
  let cert;
  beforeAll(async () => {
    cert = (await auth(request(app).post("/api/v1/certificates")).send(body({ fullName: `${PREFIX}Verify Me` }))).body.data;
  });

  it("needs no token and returns only the safe fields", async () => {
    const res = await request(app).get(`/api/v1/certificates/verify/${cert.code}`);
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.certificate).toEqual({
      code: cert.code,
      fullName: `${PREFIX}Verify Me`,
      program: "Core",
      enrollmentDate: expect.any(String),
      completionDate: expect.any(String),
      issueDate: expect.any(String), // falls back to when the record was created
      duration: "",
      pathwayLevel: "",
      specialization: "",
    });
    expect(JSON.stringify(res.body)).not.toMatch(/issuedBy|_id|certificatetester/);
    expect(res.headers["cache-control"]).toBe("no-store");
  });

  it("accepts the code in lowercase", async () => {
    const res = await request(app).get(`/api/v1/certificates/verify/${cert.code.toLowerCase()}`);
    expect(res.body.valid).toBe(true);
  });

  it("says invalid for a malformed code and not found for an unknown one", async () => {
    const malformed = await request(app).get("/api/v1/certificates/verify/ETMPDP-12345678-ZZ");
    expect(malformed.status).toBe(400);
    expect(malformed.body.valid).toBe(false);

    const unknown = await request(app).get(`/api/v1/certificates/verify/${generateCode()}`);
    expect(unknown.status).toBe(404);
    expect(unknown.body.valid).toBe(false);
  });

  it("stops verifying once revoked, and works again when restored", async () => {
    const revoke = await auth(request(app).patch(`/api/v1/certificates/${cert._id}`)).send({ status: "revoked", revokedReason: "Issued in error" });
    expect(revoke.status).toBe(200);
    expect(revoke.body.data.revokedAt).toBeDefined();

    const revoked = await request(app).get(`/api/v1/certificates/verify/${cert.code}`);
    expect(revoked.body).toEqual({ success: true, valid: false, revoked: true, code: cert.code });

    const restore = await auth(request(app).patch(`/api/v1/certificates/${cert._id}`)).send({ status: "valid" });
    expect(restore.body.data.revokedAt).toBeUndefined();
    expect(restore.body.data.revokedReason).toBeUndefined();
    expect((await request(app).get(`/api/v1/certificates/verify/${cert.code}`)).body.valid).toBe(true);
  });

  it("never lets the code be changed by an update", async () => {
    const res = await auth(request(app).patch(`/api/v1/certificates/${cert._id}`)).send({ code: "ETMPDP-AAAAAAAA-AA", fullName: `${PREFIX}Renamed` });
    expect(res.status).toBe(200);
    expect(res.body.data.code).toBe(cert.code);
    expect(res.body.data.fullName).toBe(`${PREFIX}Renamed`);
  });

  it("is gone after delete", async () => {
    expect((await auth(request(app).delete(`/api/v1/certificates/${cert._id}`))).status).toBe(200);
    expect((await request(app).get(`/api/v1/certificates/verify/${cert.code}`)).status).toBe(404);
    expect((await auth(request(app).delete(`/api/v1/certificates/${cert._id}`))).status).toBe(404);
  });
});
