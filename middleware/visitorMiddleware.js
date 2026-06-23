const Visitor = require("../model/visitorModel");

// const logVisitor = async (req, res, next) => {
//   try {
//     const visitorData = {
//       ipAddress: req.ip,
//       userAgent: req.headers['user-agent'] || 'Unknown User Agent',
//     };

//     await Visitor.create(visitorData);
//     next();
//   } catch (error) {
//     console.error("Error logging visitor:", error);
//     next();
//   }
// };

const logVisitor = async (req, res, next) => {
  try {
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|crawler|spider|ping|monitor|health/i.test(userAgent);
    const isPing = req.path === '/api/v2/ping' || req.path === '/';

    if (isBot || isPing) return next();

    await Visitor.create({
      ipAddress: req.ip,
      userAgent: userAgent || 'Unknown',
    });
    next();
  } catch (error) {
    console.error("Error logging visitor:", error);
    next();
  }
};

module.exports = logVisitor;