const mongoose = require("mongoose");
require("dotenv").config();

const databaseConnection = () => {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected!'))
    .catch(err => console.log('Database connection error: ', err));
};

module.exports = databaseConnection;
