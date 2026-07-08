require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../model/adminModel');

// const MASTER_EMAIL = 'oreva.oku@elonatech.com.ng';
const MASTER_EMAIL = 'oreva.oku@elonatech.com.ng';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await Admin.findOne({ email: MASTER_EMAIL });

  if (!admin) {
    console.log(`❌ No admin found with email: ${MASTER_EMAIL}`);
    process.exit(1);
  }

  admin.isMaster = true;
  await admin.save();
  console.log(`✅ ${MASTER_EMAIL} is now the master admin`);
  process.exit(0);
};

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
