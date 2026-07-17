const EtmpdpApplication = require("../model/etmpdpApplicationModel");
const logger = require("../lib/logger");

const APPLICATION_STATUSES = ["Pending", "Reviewed", "Accepted", "Rejected"];

// GET /api/v1/etmpdp/all — admin list, newest first
const getAllApplications = async (req, res) => {
  try {
    const applications = await EtmpdpApplication.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    logger.error("Get all ETMPDP applications error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/v1/etmpdp/:id — single application
const getApplicationById = async (req, res) => {
  try {
    const application = await EtmpdpApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    return res.status(200).json({ success: true, application });
  } catch (error) {
    logger.error("Get ETMPDP application by id error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// PATCH /api/v1/etmpdp/:id — update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${APPLICATION_STATUSES.join(", ")}` });
    }

    const application = await EtmpdpApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!application) return res.status(404).json({ message: "Application not found" });

    return res.status(200).json({ success: true, message: "Application status updated", data: application });
  } catch (error) {
    logger.error("Update ETMPDP status error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// DELETE /api/v1/etmpdp/:id
const deleteApplication = async (req, res) => {
  try {
    const application = await EtmpdpApplication.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    return res.status(200).json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    logger.error("Delete ETMPDP application error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
};
