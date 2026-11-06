const request = require("supertest");
const { connect, disconnect } = require("./helpers/db");
const app = require("../index");
const Admin = require("../model/adminModel");
const Job = require("../model/jobModel");
const bcrypt = require("bcryptjs");

const email = "jobtester@elonatech.com.ng";
const password = "TestPass123!";
const PREFIX = "JobTest ";
let token;
let draft;
let active;
let closed;

const baseJob = (title, status) => ({
  title: `${PREFIX}${title}`,
  jobSummary: "<p>Summary</p>",
  jobDescription: "<p>A description that is long enough.</p>",
  status,
});

beforeAll(async () => {
  await connect();
  await Admin.deleteMany({ email });
  await Admin.create({ name: "Job Tester", email, password: await bcrypt.hash(password, 10), role: "superAdmin" });
  token = (await request(app).post("/api/v1/auth/login").send({ email, password })).body.access;
  await Job.deleteMany({ title: new RegExp(`^${PREFIX}`) });
  draft = await Job.create(baseJob("Draft role", "Draft"));
  active = await Job.create(baseJob("Active role", "Active"));
  closed = await Job.create(baseJob("Closed role", "Closed"));
});

afterAll(async () => {
  await Job.deleteMany({ title: new RegExp(`^${PREFIX}`) });
  await Admin.deleteMany({ email });
  await disconnect();
});

describe("a Draft job is hidden from the public", () => {
  it("does not open by id or by slug", async () => {
    expect((await request(app).get(`/api/v1/jobs/${draft._id}`)).status).toBe(404);
    expect((await request(app).get(`/api/v1/jobs/${draft.slug}`)).status).toBe(404);
  });

  it("still opens Active and Closed jobs", async () => {
    const a = await request(app).get(`/api/v1/jobs/${active._id}`);
    expect(a.status).toBe(200);
    expect(a.body.job.title).toBe(`${PREFIX}Active role`);
    expect((await request(app).get(`/api/v1/jobs/${closed.slug}`)).status).toBe(200);
  });

  it("is not in the public list, which only has Active jobs", async () => {
    const res = await request(app).get("/api/v1/jobs");
    const titles = res.body.jobs.map((j) => j.title);
    expect(titles).toContain(`${PREFIX}Active role`);
    expect(titles).not.toContain(`${PREFIX}Draft role`);
    expect(titles).not.toContain(`${PREFIX}Closed role`);
  });

  it("stays visible to admins in their own list", async () => {
    const res = await request(app).get("/api/v1/jobs/all?limit=100").set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.jobs.map((j) => j.title)).toContain(`${PREFIX}Draft role`);
  });

  // The multipart application every test below sends (a valid CV, so only the job decides the outcome)
  const apply = (jobId) =>
    request(app)
      .post("/api/v1/email/job")
      .field("firstname", "Ada")
      .field("lastname", "Obi")
      .field("email", "ada.obi@example.com")
      .field("number", "08012345678")
      .field("gender", "Female")
      .field("address", "1 Test Street")
      .field("dob", "1995-01-01")
      .field("category", "Software")
      .field("status", "Employed")
      .field("skill", "JavaScript")
      .field("jobId", String(jobId))
      .attach("file", Buffer.from("%PDF-1.4 test"), { filename: "cv.pdf", contentType: "application/pdf" });

  it("does not accept an application for a Draft, and answers as if it does not exist", async () => {
    const res = await apply(draft._id);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("That job posting no longer exists");
  });

  it("does not accept an application for a Closed job, and says why", async () => {
    const res = await apply(closed._id);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/closed/i);
  });
});
