const { Sequelize } = require("sequelize");
const logger = require("./logger");
require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  logger.error("DATABASE_URL is not defined in environment variables!");
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? (message) => logger.debug(message) : false,
  dialectOptions: {
    ssl:
      databaseUrl && (databaseUrl.includes("neon.tech") || process.env.DB_SSL === "true")
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },
});

module.exports = sequelize;
