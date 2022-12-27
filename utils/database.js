const dot = require("dotenv");
const { Sequelize } = require("sequelize");

dot.config();

// Create a connection to the database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    pool: {
      acquire: 6000000,
      connectTimeout: 6000000,
      idle: 1000000,
    },
    sync: {
      force: true,
    },
  }
);

module.exports = { sequelize };