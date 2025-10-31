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