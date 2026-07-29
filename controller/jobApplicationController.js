const JobApplication = require("../model/jobApplicationModel");
const logger = require("../lib/logger");

const APPLICATION_STATUSES = ["Pending", "In Review", "Reviewed", "Accepted", "Rejected"];

// Whitelisted so ?sortBy=<anything> can't be used to sort on/probe
// arbitrary fields — only fields actually shown in the admin table.
const SORTABLE_FIELDS = ["createdAt", "firstname", "lastname", "status"];

// GET /api/v1/job-applications/all — admin list, paginated.
// Optional filters: ?job=<jobId> (from the "N applications" link on the
// Career Jobs page), ?status=<Pending|Reviewed|Accepted|Rejected>.
// Optional sort: ?sortBy=<field>&sortOrder=<asc|desc> (defaults to newest
// first). Optional ?page=&limit= (defaults to page 1, 20 per page) — this
// list has no cap otherwise, so a busy job posting with hundreds of
// applicants would load them all in a single request.
const getAllApplications = async (req, res) => {
  try {
    const filter = {};
    if (req.query.job) filter.job = req.query.job;
    if (req.query.status && APPLICATION_STATUSES.includes(req.query.status)) {
      filter.status = req.query.status;
    }

    const sortBy = SORTABLE_FIELDS.includes(req.query.sortBy) ? req.query.sortBy : "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      JobApplication.find(filter)
        .populate("job", "title location employmentType status")
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      JobApplication.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      applications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
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
