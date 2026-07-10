const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const logLevel = statusCode >= 500 ? "error" : "warn";

  logger[logLevel](err.message || "Unhandled error", {
    stack: statusCode >= 500 ? err.stack : undefined,
    method: req.method,
    url: req.originalUrl,
    statusCode,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
