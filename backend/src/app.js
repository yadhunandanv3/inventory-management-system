const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const logger = require("./config/logger");
const requestResponseLogger = require("./middleware/requestResponseLogger");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const customerRoutes = require("./routes/customer.routes");
const orderRoutes = require("./routes/order.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const { swaggerUi, swaggerDocument } = require("./config/swagger");

const app = express();

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);
app.use(requestResponseLogger);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // increased limit for development and dashboard polling
});

app.use(limiter);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
