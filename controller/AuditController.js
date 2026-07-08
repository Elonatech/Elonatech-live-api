const AuditLog = require("../model/auditLogModel");
const Admin = require("../model/adminModel");
const logger = require("../lib/logger");

const getAuditLogs = async (req, res) => {
  try {
    // Only the master admin can view audit logs
    const requester = await Admin.findById(req.user.id);
    if (!requester || !requester.isMaster) {
      return res.status(403).json({ message: "Only the master admin can view audit logs" });
    }

    const { action, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (action) filter.action = action;

    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 }) // newest first
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await AuditLog.countDocuments(filter);

    return res.status(200).json({ logs, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    logger.error("Get audit logs error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getAuditLogs };
