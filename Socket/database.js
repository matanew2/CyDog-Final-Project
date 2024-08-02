const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from a .env file into process.env

/**
 * Database connection
 * @returns {Promise<void>}
 */
const databaseConnection = () => {
  mongoose.connect(process.env.MONGO_URI) // Connect to the database
    .then(() => console.log('Database connected!'))
    .catch(err => console.log('Database connection error: ', err));
};

module.exports = databaseConnection;
