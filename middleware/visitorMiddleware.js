const Visitor = require("../model/visitorModel");

const logVisitor = async (req, res, next) => {
  try {
    const visitorData = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || 'Unknown User Agent',
    };

    await Visitor.create(visitorData);
    next();
  } catch (error) {
    console.error("Error logging visitor:", error);
    next();
  }
};

module.exports = logVisitor;