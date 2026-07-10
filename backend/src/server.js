require("dotenv").config();

const app = require("./app");
const logger = require("./config/logger");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    logger.info("Database connection has been established successfully.");

    app.listen(PORT, () => {
      logger.info("Server running", {
        port: PORT,
        mode: process.env.NODE_ENV || "development",
      });
    });
  } catch (error) {
    logger.error("Unable to connect to the database", { stack: error.stack });
    process.exit(1);
  }
};

startServer();
