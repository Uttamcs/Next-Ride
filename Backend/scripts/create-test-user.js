const mongoose = require("mongoose");
const userModel = require("../models/user.model");
require("dotenv").config();

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if user already exists
    const existingUser = await userModel.findOne({ email: "test@example.com" });
    if (existingUser) {
      console.log("Test user already exists");
      await mongoose.disconnect();
      return;
    }

    // Hash the password
    const hashedPassword = await userModel.hashPassword("Uttam@2004");

    // Create the user
    const user = await userModel.create({
      fullname: {
        firstName: "Test",
        lastName: "User",
      },
      email: "test@example.com",
      password: hashedPassword,
    });

    console.log("Test user created successfully:");
    console.log({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
    });

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error creating test user:", error);
    await mongoose.disconnect();
  }
}

createTestUser();
