// This file is responsible for connecting to the MongoDB database using Mongoose. It defines an asynchronous function `connectMongodb` that attempts to connect to the database using the connection string stored in the environment variable `MONGO_URI`. If the connection is successful, it logs a success message; if there is an error, it catches and logs the error. The function is then exported for use in other parts of the application.
// database.js
const mongoose = require('mongoose');
const logger = require("../lib/logger");


const connectMongodb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB Connected');
  } catch (error) {
    logger.error('MongoDB connection failed', { error });
    process.exit(1);
  }
};

module.exports = { connectMongodb }