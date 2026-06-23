require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

async function cleanup() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const result = await mongoose.connection.collection('products').deleteMany({ category: 'Products' });

  console.log(`Deleted ${result.deletedCount} duplicate products (category: "Products")`);
  await mongoose.disconnect();
  console.log('Done.');
}

cleanup().catch(err => {
  console.error(err);
  process.exit(1);
});
