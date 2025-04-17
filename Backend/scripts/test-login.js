const mongoose = require('mongoose');
const userModel = require('../models/user.model');
require('dotenv').config();

async function testLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find user by email
    const email = 'test@example.com';
    const password = 'Uttam@2004';
    
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found');
      await mongoose.disconnect();
      return;
    }

    // Check password
    const isMatch = await user.comparePasswords(password);
    if (isMatch) {
      console.log('Login successful!');
      console.log('User details:');
      console.log({
        _id: user._id,
        fullname: user.fullname,
        email: user.email
      });
    } else {
      console.log('Invalid password');
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error testing login:', error);
    await mongoose.disconnect();
  }
}

testLogin();
