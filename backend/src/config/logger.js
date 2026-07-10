const fs = require("fs");
const path = require("path");
const winston = require("winston");

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const { combine, errors, json, printf, timestamp, colorize } = winston.format;

const consoleFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ timestamp: logTimestamp, level, message, stack, ...meta }) => {
    const metadata = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${logTimestamp} ${level}: ${stack || message}${metadata}`;
  })
);

const fileFormat = combine(timestamp(), errors({ stack: true }), json());

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  format: fileFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "exceptions.log"),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "rejections.log"),
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: process.env.NODE_ENV === "production" ? fileFormat : consoleFormat,
  })
);

module.exports = logger;
