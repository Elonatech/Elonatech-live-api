const Job = require("../model/jobModel");
const JobApplication = require("../model/jobApplicationModel");
const logger = require("../lib/logger");
const logAudit = require("../lib/logAudit");

// POST /api/v1/jobs — create a new job posting
const createJob = async (req, res) => {
  try {
    const { title, location, numberOfOpenings, employmentType, workplaceType, jobLevel, minimumQualification, jobSummary, jobDescription, status, hiringTimeline } = req.body;

    const job = await Job.create({ title, location, numberOfOpenings, employmentType, workplaceType, jobLevel, minimumQualification, jobSummary, jobDescription, status, hiringTimeline });

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

// GET /api/v1/jobs/all — admin list, every status, with application counts
const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).lean();

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await JobApplication.countDocuments({ job: job._id });
        return { ...job, applicationCount };
      })
    );

    return res.status(200).json({ success: true, jobs: jobsWithCounts });
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

    const { title, location, employmentType, numberOfOpenings, workplaceType, jobLevel, minimumQualification, jobSummary, jobDescription, status, hiringTimeline } = req.body;
    if (title !== undefined) job.title = title;
    if (location !== undefined) job.location = location;
    if (employmentType !== undefined) job.employmentType = employmentType;
    if (workplaceType !== undefined) job.workplaceType = workplaceType;
    if (minimumQualification !== undefined) job.minimumQualification = minimumQualification;
    if (jobSummary !== undefined) job.jobSummary = jobSummary;
    if (jobDescription !== undefined) job.jobDescription = jobDescription;
    if (status !== undefined) job.status = status;
    if (numberOfOpenings !== undefined) job.numberOfOpenings = numberOfOpenings;
    if (jobLevel !== undefined) job.jobLevel = jobLevel;
    if (hiringTimeline !== undefined) job.hiringTimeline = hiringTimeline;

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
