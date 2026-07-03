const winston = require("winston");

// Define log format — timestamp + level + message + any extra metadata
const logFormat = winston.format.combine(
  // Adds a timestamp to every log entry
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  // If the log includes an error object, print the full stack trace
  winston.format.errors({ stack: true }),
  // Output as JSON — structured and easy to search in production
  winston.format.json()
);

const logger = winston.createLogger({
  // Only log "info" and above in production, "debug" and above in development
  // This means debug logs are automatically silenced on Render
  level: process.env.NODE_ENV === "production" ? "info" : "debug",

  format: logFormat,

  transports: [
    // Console transport — Render picks this up in their log viewer
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // colour coded by level in terminal
        winston.format.simple()    // human readable format for development
      )
    }),

    // Only write errors to a dedicated file — easier to scan for critical issues
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // Write every log level to combined file — full history
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

module.exports = logger;