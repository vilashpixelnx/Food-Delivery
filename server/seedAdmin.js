const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

// Load env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@smartcart.com' });
    
    if (adminExists) {
      console.log('Admin already exists! Skipping seeding.');
      process.exit();
    }

    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@smartcart.com',
      password: 'admin123', // Will be hashed by User model pre-save hook
      role: 'admin',
    });

    console.log('Default Admin Created Successfully!');
    console.log('Email: admin@smartcart.com');
    console.log('Password: admin123');

    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
