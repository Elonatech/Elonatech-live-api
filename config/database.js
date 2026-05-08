// This file is responsible for connecting to the MongoDB database using Mongoose. It defines an asynchronous function `connectMongodb` that attempts to connect to the database using the connection string stored in the environment variable `MONGO_URI`. If the connection is successful, it logs a success message; if there is an error, it catches and logs the error. The function is then exported for use in other parts of the application.
// database.js
const mongoose = require('mongoose');


const connectMongodb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB Connected')
  } catch (error) {
    console.log(error);
  }

}

module.exports = { connectMongodb }