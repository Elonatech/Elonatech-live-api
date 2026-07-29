const Job = require("../model/jobModel");
const JobApplication = require("../model/jobApplicationModel");
const logger = require("../lib/logger");
const logAudit = require("../lib/logAudit");

// Fallback for older postings saved without an explicit Job Summary —
// derives a short teaser from the rich-text Job Description so the career
// listing card (which reads jobSummary) still has something to show.
const deriveJobSummary = (html) => {
  const plainText = String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!plainText) return "";
  return plainText.length > 160 ? `${plainText.slice(0, 157)}...` : plainText;
};

// Best-effort extraction of the structured fields (Location, Employment
// Type, Workplace Type, Job Level, Minimum Qualification, Openings, Hiring
// Timeline) from lines the admin types inside the single Job Description
// box, e.g. "Job Level: Internship". These fields no longer have their own
// form inputs — this is what still populates the career page filters and
// the public job page's "Role details" sidebar.
const JOB_EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship", "Freelance", "Mentorship", "Volunteer", "Other"];
const JOB_WORKPLACE_TYPES = ["On-site", "Hybrid", "Remote"];
const JOB_LEVELS = ["No Experience", "Internship & Graduate", "Entry-level", "Mid-level", "Senior-level", "Executive-level"];
const JOB_HIRING_TIMELINES = ["2 weeks", "1 Month", "2 Months", "3 Months"];

// Strips a trailing "s" too, so "2 Month" (typo/typed without the plural)
// still matches the enum value "2 Months".
const normalize = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "").replace(/s$/, "");

const matchEnum = (value, enumList) => {
  if (!value) return undefined;
  const target = normalize(value);
  return enumList.find((e) => normalize(e) === target || target.includes(normalize(e)));
};

const extractLabelValue = (plainText, labels) => {
  for (const label of labels) {
    const match = plainText.match(new RegExp(`${label}\\s*:\\s*([^\\n]+)`, "i"));
    if (match) return match[1].trim();
  }
  return undefined;
};

const deriveStructuredFields = (html) => {
  const plainText = String(html || "")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\r/g, "");

  const openingsRaw = extractLabelValue(plainText, ["Number of Openings", "Openings"]);
  const openingsNum = openingsRaw ? parseInt(openingsRaw, 10) : NaN;

  return {
    location: extractLabelValue(plainText, ["Location"]),
    employmentType: matchEnum(extractLabelValue(plainText, ["Employment Type"]), JOB_EMPLOYMENT_TYPES),
    workplaceType: matchEnum(extractLabelValue(plainText, ["Workplace Type", "Workplace"]), JOB_WORKPLACE_TYPES),
    jobLevel: matchEnum(extractLabelValue(plainText, ["Job Level", "Experience Level", "Experience"]), JOB_LEVELS),
    minimumQualification: extractLabelValue(plainText, ["Minimum Qualification"]),
    numberOfOpenings: Number.isNaN(openingsNum) ? undefined : openingsNum,
    hiringTimeline: matchEnum(extractLabelValue(plainText, ["Hiring Timeline"]), JOB_HIRING_TIMELINES),
  };
};

// POST /api/v1/jobs — create a new job posting
const createJob = async (req, res) => {
  try {
    const { title, location, numberOfOpenings, employmentType, workplaceType, jobLevel, minimumQualification, jobSummary, jobDescription, responsibilities, requirements, benefits, status, hiringTimeline } = req.body;

    const finalJobSummary = jobSummary?.trim() || deriveJobSummary(jobDescription);
    const extracted = deriveStructuredFields(jobDescription);

    const job = await Job.create({
      title,
      location: location ?? extracted.location,
      numberOfOpenings: numberOfOpenings ?? extracted.numberOfOpenings,
      employmentType: employmentType ?? extracted.employmentType,
      workplaceType: workplaceType ?? extracted.workplaceType,
      jobLevel: jobLevel ?? extracted.jobLevel,
      minimumQualification: minimumQualification ?? extracted.minimumQualification,
      jobSummary: finalJobSummary,
      jobDescription,
      responsibilities,
      requirements,
      benefits,
      status,
      hiringTimeline: hiringTimeline ?? extracted.hiringTimeline,
    });

    await logAudit({
      action: "CREATE_JOB",
      performedBy: { id: req.user.id, name: req.user.name, email: req.user.email },
      details: `Created job posting: "${title}"`,
    });

    return res.status(201).json({ success: true, message: "Job created successfully", data: job });
  } catch (error) {
    logger.error("Create job error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// Whitelisted so ?sortBy=<anything> can't be used to sort on/probe
// arbitrary fields — only fields actually shown in the admin table.
const JOB_SORTABLE_FIELDS = ["createdAt", "title", "status"];
const JOB_STATUSES = ["Active", "Draft", "Closed"];

// GET /api/v1/jobs/all — admin list, every status by default, with
// application counts. Optional ?status=<Active|Draft|Closed> filter,
// ?sortBy=<field>&sortOrder=<asc|desc> (defaults to newest first), and
// ?page=&limit= (defaults to page 1, 50 per page).
const getAllJobsAdmin = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && JOB_STATUSES.includes(req.query.status)) {
      filter.status = req.query.status;
    }

    const sortBy = JOB_SORTABLE_FIELDS.includes(req.query.sortBy) ? req.query.sortBy : "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit).lean(),
      Job.countDocuments(filter),
    ]);

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await JobApplication.countDocuments({ job: job._id });
        return { ...job, applicationCount };
      })
    );

    return res.status(200).json({
      success: true,
      jobs: jobsWithCounts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    logger.error("Get all jobs (admin) error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/v1/jobs — public list, Active postings only
const getActiveJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Active" }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    logger.error("Get active jobs error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/v1/jobs/:id — single job by id or slug
const getJobById = async (req, res) => {
  try {
    const identifier = req.params.id;
    const job = identifier.match(/^[0-9a-fA-F]{24}$/)
      ? await Job.findById(identifier)
      : await Job.findOne({ slug: identifier });

    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.status(200).json({ success: true, job });
  } catch (error) {
    logger.error("Get job by id error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// PATCH /api/v1/jobs/:id — edit a job posting
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const { title, location, employmentType, numberOfOpenings, workplaceType, jobLevel, minimumQualification, jobSummary, jobDescription, responsibilities, requirements, benefits, status, hiringTimeline } = req.body;
    if (title !== undefined) job.title = title;

    const extracted = jobDescription !== undefined ? deriveStructuredFields(jobDescription) : {};

    // Only overwrite a field when something was actually found — a failed
    // match (e.g. wording the parser doesn't recognize) leaves the existing
    // value alone instead of wiping it out. Best-effort improve, never worse
    // than what was already there.
    if (location !== undefined) job.location = location;
    else if (extracted.location !== undefined) job.location = extracted.location;

    if (employmentType !== undefined) job.employmentType = employmentType;
    else if (extracted.employmentType !== undefined) job.employmentType = extracted.employmentType;

    if (workplaceType !== undefined) job.workplaceType = workplaceType;
    else if (extracted.workplaceType !== undefined) job.workplaceType = extracted.workplaceType;

    if (minimumQualification !== undefined) job.minimumQualification = minimumQualification;
    else if (extracted.minimumQualification !== undefined) job.minimumQualification = extracted.minimumQualification;

    if (numberOfOpenings !== undefined) job.numberOfOpenings = numberOfOpenings;
    else if (extracted.numberOfOpenings !== undefined) job.numberOfOpenings = extracted.numberOfOpenings;

    if (jobLevel !== undefined) job.jobLevel = jobLevel;
    else if (extracted.jobLevel !== undefined) job.jobLevel = extracted.jobLevel;

    if (hiringTimeline !== undefined) job.hiringTimeline = hiringTimeline;
    else if (extracted.hiringTimeline !== undefined) job.hiringTimeline = extracted.hiringTimeline;

    if (jobSummary !== undefined) {
      job.jobSummary = jobSummary;
    } else if (jobDescription !== undefined) {
      // Description changed but no explicit summary was sent — re-derive it.
      job.jobSummary = deriveJobSummary(jobDescription);
    }
    if (jobDescription !== undefined) job.jobDescription = jobDescription;
    if (responsibilities !== undefined) job.responsibilities = responsibilities;
    if (requirements !== undefined) job.requirements = requirements;
    if (benefits !== undefined) job.benefits = benefits;
    if (status !== undefined) job.status = status;

    await job.save({ validateModifiedOnly: true });

    await logAudit({
      action: "UPDATE_JOB",
      performedBy: { id: req.user.id, name: req.user.name, email: req.user.email },
      details: `Updated job posting: "${job.title}"`,
    });

    return res.status(200).json({ success: true, message: "Job updated successfully", data: job });
  } catch (error) {
    logger.error("Update job error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// DELETE /api/v1/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const title = job.title;
    await job.deleteOne();

    await logAudit({
      action: "DELETE_JOB",
      performedBy: { id: req.user.id, name: req.user.name, email: req.user.email },
      details: `Deleted job posting: "${title}"`,
    });

    return res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    logger.error("Delete job error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createJob,
  getAllJobsAdmin,
  getActiveJobs,
  getJobById,
  updateJob,
  deleteJob,
};
