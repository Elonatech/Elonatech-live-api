const request = require("supertest");
const crypto = require("crypto");
const { createCanvas } = require("@napi-rs/canvas");
const { connect, disconnect } = require("./helpers/db");
const app = require("../index");
const Admin = require("../model/adminModel");
const Certificate = require("../model/certificateModel");
const CertificateAsset = require("../model/certificateAssetModel");
const CertificateSettings = require("../model/certificateSettingsModel");
const { clearCache } = require("../lib/certificateAssets");
const bcrypt = require("bcryptjs");
const { generateCode } = require("../lib/certificateCode");

// Drawing a full-size PDF takes a few seconds on a busy machine
jest.setTimeout(30000);

const email = "certrender@elonatech.com.ng";
const normalEmail = "certrendernormal@elonatech.com.ng";
const password = "TestPass123!";
const PREFIX = "CertRenderTest ";
let token;
let normalToken;
let valid;
let revoked;

const as = (req, t = token) => req.set("x-access-token", t);
const pngBuffer = () => {
  const canvas = createCanvas(300, 120);
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#112";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(10, 90);
  ctx.bezierCurveTo(60, -20, 120, 140, 290, 20);
  ctx.stroke();
  return canvas.toBuffer("image/png");
};

const wipe = async () => {
  await Certificate.deleteMany({ fullName: new RegExp(`^${PREFIX}`) });
  await CertificateAsset.deleteMany({});
  await CertificateSettings.deleteMany({});
};

beforeAll(async () => {
  process.env.CERT_ASSETS_KEY = crypto.randomBytes(32).toString("base64");
  await connect();
  await Admin.deleteMany({ email: { $in: [email, normalEmail] } });
  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ name: "Render Tester", email, password: hashed, role: "superAdmin" });
  await Admin.create({ name: "Render Normal", email: normalEmail, password: hashed, role: "admin" });
  token = (await request(app).post("/api/v1/auth/login").send({ email, password })).body.access;
  normalToken = (await request(app).post("/api/v1/auth/login").send({ email: normalEmail, password })).body.access;
  await wipe();
  clearCache();
  valid = await Certificate.create({
    code: generateCode(),
    fullName: `${PREFIX}Ada Obi`,
    program: "Core",
    completionDate: new Date("2026-08-15"),
    specialFocus: "Cybersecurity",
    issuedBy: { name: "t" },
  });
  revoked = await Certificate.create({
    code: generateCode(),
    fullName: `${PREFIX}Revoked Person`,
    program: "Ignite",
    completionDate: new Date("2026-08-15"),
    status: "revoked",
    issuedBy: { name: "t" },
  });
});

afterAll(async () => {
  await wipe();
  clearCache();
  await Admin.deleteMany({ email: { $in: [email, normalEmail] } });
  await disconnect();
});

describe("public certificate picture and PDF", () => {
  it("serves a JPEG for a valid certificate, never cached", async () => {
    const res = await request(app).get(`/api/v1/certificates/render/${valid.code}/image`).buffer(true).parse((r, cb) => {
      const chunks = [];
      r.on("data", (c) => chunks.push(c));
      r.on("end", () => cb(null, Buffer.concat(chunks)));
    });
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/image\/jpeg/);
    expect(res.headers["cache-control"]).toMatch(/no-store/);
    expect(res.body.subarray(0, 3).toString("hex")).toBe("ffd8ff");
  });

  it("serves a real PDF, downloadable on request", async () => {
    const res = await request(app).get(`/api/v1/certificates/render/${valid.code.toLowerCase()}/pdf?download=1`).buffer(true).parse((r, cb) => {
      const chunks = [];
      r.on("data", (c) => chunks.push(c));
      r.on("end", () => cb(null, Buffer.concat(chunks)));
    });
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/pdf/);
    expect(res.headers["content-disposition"]).toBe(`attachment; filename="ETMPDP-Core-Certificate-${valid.code}.pdf"`);
    expect(res.body.subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("refuses revoked, unknown and malformed codes", async () => {
    expect((await request(app).get(`/api/v1/certificates/render/${revoked.code}/pdf`)).status).toBe(404);
    expect((await request(app).get(`/api/v1/certificates/render/${generateCode()}/image`)).status).toBe(404);
    expect((await request(app).get("/api/v1/certificates/render/not-a-code/image")).status).toBe(400);
  });
});

describe("super-admin picture and PDF by id", () => {
  it("lets a super admin download even a revoked certificate", async () => {
    const res = await as(request(app).get(`/api/v1/certificates/${revoked._id}/pdf`));
    expect(res.status).toBe(200);
    expect(res.headers["content-disposition"]).toMatch(/^attachment/);
  });

  it("keeps normal admins and anonymous visitors out", async () => {
    expect((await as(request(app).get(`/api/v1/certificates/${valid._id}/pdf`), normalToken)).status).toBe(403);
    expect((await request(app).get(`/api/v1/certificates/${valid._id}/image`)).status).toBeGreaterThanOrEqual(401);
    expect((await as(request(app).get("/api/v1/certificates/assets/preview/image"), normalToken)).status).toBe(403);
  });
});

describe("signature and stamp storage", () => {
  it("is closed to normal admins", async () => {
    expect((await as(request(app).get("/api/v1/certificates/assets"), normalToken)).status).toBe(403);
    expect(
      (await as(request(app).put("/api/v1/certificates/assets/stamp"), normalToken).attach("image", pngBuffer(), "s.png")).status
    ).toBe(403);
    expect((await as(request(app).delete("/api/v1/certificates/assets/stamp"), normalToken)).status).toBe(403);
    expect(
      (await as(request(app).put("/api/v1/certificates/settings"), normalToken).send({ signatoryName: "X", signatoryTitle: "Y" })).status
    ).toBe(403);
  });

  it("starts empty and reports the key is set", async () => {
    const res = await as(request(app).get("/api/v1/certificates/assets"));
    expect(res.status).toBe(200);
    expect(res.body.keyConfigured).toBe(true);
    expect(res.body.signature.uploaded).toBe(false);
    expect(res.body.stamp.uploaded).toBe(false);
  });

  it("rejects anything that is not a PNG", async () => {
    const notPng = await as(request(app).put("/api/v1/certificates/assets/signature")).attach("image", Buffer.from("hello"), {
      filename: "s.png",
      contentType: "image/png",
    });
    expect(notPng.status).toBe(400);
    const jpeg = await as(request(app).put("/api/v1/certificates/assets/signature")).attach("image", Buffer.from([0xff, 0xd8, 0xff]), {
      filename: "s.jpg",
      contentType: "image/jpeg",
    });
    expect(jpeg.status).toBe(400);
    expect((await as(request(app).put("/api/v1/certificates/assets/signature"))).status).toBe(400);
    expect((await as(request(app).put("/api/v1/certificates/assets/passport")).attach("image", pngBuffer(), "s.png")).status).toBe(404);
  });

  it("stores the image encrypted and never offers it back", async () => {
    const original = pngBuffer();
    const res = await as(request(app).put("/api/v1/certificates/assets/stamp")).attach("image", original, "stamp.png");
    expect(res.status).toBe(200);
    expect(res.body.stamp.uploaded).toBe(true);
    // the panel replaces its state with every response, so the key state must come back too
    expect(res.body.keyConfigured).toBe(true);
    expect(res.body.keyProblem).toBe("ok");
    expect(JSON.stringify(res.body)).not.toMatch(/iv|tag|"data"/);

    const row = await CertificateAsset.findOne({ kind: "stamp" });
    // not a PNG on disk, and the PNG signature bytes are nowhere in what is stored
    expect(row.data.subarray(0, 4).toString("hex")).not.toBe("89504e47");
    expect(row.data.includes(Buffer.from("IHDR"))).toBe(false);

    // there is no route that returns it
    expect((await as(request(app).get("/api/v1/certificates/assets/stamp"))).status).toBe(404);
  });

  it("draws certificates with the uploaded images and signatory", async () => {
    await as(request(app).put("/api/v1/certificates/assets/signature")).attach("image", pngBuffer(), "sig.png");
    const settings = await as(request(app).put("/api/v1/certificates/settings")).send({
      signatoryName: "Dr. Jane Doe",
      signatoryTitle: "Managing Director",
    });
    expect(settings.status).toBe(200);
    expect(settings.body.settings.signatoryName).toBe("Dr. Jane Doe");

    const res = await request(app).get(`/api/v1/certificates/render/${valid.code}/image`).buffer(true).parse((r, cb) => {
      const chunks = [];
      r.on("data", (c) => chunks.push(c));
      r.on("end", () => cb(null, Buffer.concat(chunks)));
    });
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(10000);

    const sample = await as(request(app).get("/api/v1/certificates/assets/preview/image?program=Ignite"));
    expect(sample.status).toBe(200);
    expect(sample.headers["content-type"]).toMatch(/image\/jpeg/);
  });

  it("refuses to hand out certificates if stored images cannot be decrypted", async () => {
    const good = process.env.CERT_ASSETS_KEY;
    process.env.CERT_ASSETS_KEY = crypto.randomBytes(32).toString("base64");
    clearCache();
    const res = await request(app).get(`/api/v1/certificates/render/${valid.code}/image`);
    expect(res.status).toBe(503);
    process.env.CERT_ASSETS_KEY = good;
    clearCache();
  });

  it("removes an image", async () => {
    const res = await as(request(app).delete("/api/v1/certificates/assets/stamp"));
    expect(res.status).toBe(200);
    expect(res.body.stamp.uploaded).toBe(false);
    expect(res.body.signature.uploaded).toBe(true);
  });

  it("will not store anything when the server key is missing", async () => {
    const good = process.env.CERT_ASSETS_KEY;
    delete process.env.CERT_ASSETS_KEY;
    const res = await as(request(app).put("/api/v1/certificates/assets/stamp")).attach("image", pngBuffer(), "s.png");
    expect(res.status).toBe(503);
    process.env.CERT_ASSETS_KEY = good;
  });

  it("says when the key is the wrong size instead of just 'not set'", async () => {
    const good = process.env.CERT_ASSETS_KEY;
    process.env.CERT_ASSETS_KEY = "this-is-32-characters-not-bytes!";
    const status = await as(request(app).get("/api/v1/certificates/assets"));
    expect(status.body.keyConfigured).toBe(false);
    expect(status.body.keyProblem).toBe("invalid");
    const res = await as(request(app).put("/api/v1/certificates/assets/stamp")).attach("image", pngBuffer(), "s.png");
    expect(res.status).toBe(503);
    expect(res.body.message).toMatch(/not valid/);
    delete process.env.CERT_ASSETS_KEY;
    expect((await as(request(app).get("/api/v1/certificates/assets"))).body.keyProblem).toBe("missing");
    process.env.CERT_ASSETS_KEY = good;
  });

  it("keeps a separate stamp, signature and signatory per programme", async () => {
    const coreStamp = await as(request(app).put("/api/v1/certificates/assets/" + encodeURIComponent("stamp:Core"))).attach(
      "image",
      pngBuffer(),
      "core.png"
    );
    expect(coreStamp.status).toBe(200);
    expect(coreStamp.body["stamp:Core"].uploaded).toBe(true);
    expect(coreStamp.body["stamp:Ignite"].uploaded).toBe(false);
    expect(coreStamp.body.stamp.uploaded).toBe(false); // the default is untouched

    expect(
      (await as(request(app).put("/api/v1/certificates/assets/" + encodeURIComponent("stamp:Other"))).attach("image", pngBuffer(), "x.png"))
        .status
    ).toBe(404);

    const signer = await as(request(app).put("/api/v1/certificates/settings")).send({
      program: "Ignite",
      signatoryName: "Ignite Lead",
      signatoryTitle: "Head of Ignite",
    });
    expect(signer.status).toBe(200);
    expect(signer.body.settings.programs.Ignite.signatoryName).toBe("Ignite Lead");
    expect(signer.body.settings.signatoryName).toBe("Dr. Jane Doe"); // default unchanged
    expect(signer.body.settings.programs.Core.signatoryName).toBe("");

    expect(
      (await as(request(app).put("/api/v1/certificates/settings")).send({ program: "Nope", signatoryName: "x", signatoryTitle: "y" })).status
    ).toBe(400);

    const sample = await as(request(app).get("/api/v1/certificates/assets/preview/image?program=Ignite"));
    expect(sample.status).toBe(200);

    expect((await as(request(app).delete("/api/v1/certificates/assets/" + encodeURIComponent("stamp:Core")))).status).toBe(200);
  });

  it("falls back to the default image and signer when a programme has none of its own", () => {
    const { resolveFor } = require("../lib/certificateAssets");
    const loaded = {
      images: { signature: "DEFSIG", stamp: "DEFSTAMP", "stamp:Core": "CORESTAMP" },
      settings: {
        signatoryName: "Default Person",
        signatoryTitle: "MD",
        programs: { Core: { signatoryName: "", signatoryTitle: "" }, Ignite: { signatoryName: "Ignite Lead", signatoryTitle: "Head" } },
      },
    };
    const core = resolveFor(loaded, "Core");
    expect(core.stamp).toBe("CORESTAMP");
    expect(core.signature).toBe("DEFSIG");
    expect(core.settings.signatoryName).toBe("Default Person");
    const ignite = resolveFor(loaded, "Ignite");
    expect(ignite.stamp).toBe("DEFSTAMP");
    expect(ignite.settings).toEqual({ signatoryName: "Ignite Lead", signatoryTitle: "Head" });
    expect(resolveFor({ images: {}, settings: { signatoryName: "", signatoryTitle: "", programs: {} } }, "Core").stamp).toBeNull();
  });

  it("validates the signatory fields", async () => {
    const res = await as(request(app).put("/api/v1/certificates/settings")).send({ signatoryName: "x".repeat(81), signatoryTitle: "" });
    expect(res.status).toBe(400);
  });
});
