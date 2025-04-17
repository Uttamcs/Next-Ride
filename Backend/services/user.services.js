const userModel = require("../models/user.model");

module.exports.createUser = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  }
  const user = await userModel.create({
    fullname: {
      firstName,
      lastName,
    },
    email,
    password,
  });

  // Remove password from response
  user.password = undefined;

  return user;
};

module.exports.getUserProfile = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

module.exports.updateUserProfile = async (userId, userData) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Update user fields
  if (userData.firstName) {
    user.fullname.firstName = userData.firstName;
  }
  if (userData.lastName) {
    user.fullname.lastName = userData.lastName;
  }
  if (userData.email) {
    // Check if email is already in use by another user
    const existingUser = await userModel.findOne({ email: userData.email });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new Error("Email is already in use");
    }
    user.email = userData.email;
  }

  await user.save();
  return user;
};

module.exports.changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await userModel.findById(userId).select("+password");
  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password
  const isMatch = await user.comparePasswords(currentPassword);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Hash and update new password
  user.password = await userModel.hashPassword(newPassword);
  await user.save();

  return { success: true };
};
