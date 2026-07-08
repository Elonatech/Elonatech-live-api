const AuditLog = require("../model/auditLogModel");
const logger = require("./logger");

// Call this after any significant action to record who did what and when
// performedBy: { id, name, email } — the admin doing the action
// target: { id, name, email } — the admin being acted on (optional)
// details: a plain English description of what happened
const logAudit = async ({ action, performedBy, target = null, details = "" }) => {
  try {
    await AuditLog.create({ action, performedBy, target, details });
  } catch (error) {
    // Never let audit logging crash the main request
    logger.error("Audit log error", { error });
  }
};

module.exports = logAudit;
