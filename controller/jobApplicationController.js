const JobApplication = require("../model/jobApplicationModel");
const logger = require("../lib/logger");

const APPLICATION_STATUSES = ["Pending", "Reviewed", "Accepted", "Rejected"];

// GET /api/v1/job-applications/all — admin list, newest first.
// Optional ?job=<jobId> filter, used by the "N applications" link on the
// Career Jobs page.
const getAllApplications = async (req, res) => {
  try {
    const filter = {};
    if (req.query.job) filter.job = req.query.job;

    const applications = await JobApplication.find(filter)
      .populate("job", "title location employmentType status")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    logger.error("Get all job applications error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/v1/job-applications/:id
const getApplicationById = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id)
      .populate("job", "title location employmentType status");
    if (!application) return res.status(404).json({ message: "Application not found" });
    return res.status(200).json({ success: true, application });
  } catch (error) {
    logger.error("Get job application by id error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// PATCH /api/v1/job-applications/:id — update review status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${APPLICATION_STATUSES.join(", ")}` });
    }

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!application) return res.status(404).json({ message: "Application not found" });

    return res.status(200).json({ success: true, message: "Application status updated", data: application });
  } catch (error) {
    logger.error("Update job application status error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// DELETE /api/v1/job-applications/:id
const deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    return res.status(200).json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    logger.error("Delete job application error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
};
