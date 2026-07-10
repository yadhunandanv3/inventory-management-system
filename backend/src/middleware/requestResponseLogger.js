const logger = require("../config/logger");

const sensitiveKeys = new Set([
  "authorization",
  "password",
  "token",
  "accesstoken",
  "refreshtoken",
]);

const redact = (value) => {
  if (!value || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(redact);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [
      key,
      sensitiveKeys.has(key.toLowerCase()) ? "[REDACTED]" : redact(entryValue),
    ])
  );
};

const requestResponseLogger = (req, res, next) => {
  const startedAt = Date.now();
  const shouldLogBody = process.env.NODE_ENV !== "production";
  const requestLog = {
    method: req.method,
    url: req.originalUrl,
    params: redact(req.params),
    query: redact(req.query),
    ip: req.ip,
    userAgent: req.get("user-agent"),
  };

  if (shouldLogBody) {
    requestLog.body = redact(req.body);
  }

  logger.info("Request", requestLog);

  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);
  let responseBody;

  res.json = (body) => {
    responseBody = body;
    return originalJson(body);
  };

  res.send = (body) => {
    if (responseBody === undefined) {
      responseBody = body;
    }

    return originalSend(body);
  };

  res.on("finish", () => {
    const responseLog = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    };

    if (shouldLogBody) {
      responseLog.body = redact(responseBody);
    }

    logger.info("Response", responseLog);
  });

  next();
};

module.exports = requestResponseLogger;
