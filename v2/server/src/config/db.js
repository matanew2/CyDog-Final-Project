const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  host: process.env.DB_HOST || "postgres",
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || "cydog",
  password: process.env.DB_PASSWORD || "password123",
  database: process.env.DB_NAME || "cydog_db",
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

module.exports = sequelize;
