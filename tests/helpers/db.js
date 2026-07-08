require("dotenv").config();
const mongoose = require("mongoose");

const TEST_URI = process.env.MONGO_URI.replace(/\/([^/?]+)(\?|$)/, "/elonatech_test$2");

const connect = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_URI);
  }
};

const disconnect = async () => {
  await mongoose.disconnect();
};

module.exports = { connect, disconnect };
