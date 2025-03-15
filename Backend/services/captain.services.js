const captainModel = require("../models/captain.model");

module.exports.createCaptain = async ({
  fullname,
  email,
  password,
  vehicleColor,
  vehicleNumber,
  capacity,
  vehicleType,
  location,
}) => {
  if (
    !fullname ||
    !email ||
    !password ||
    !vehicleColor ||
    !vehicleNumber ||
    !capacity ||
    !vehicleType ||
    !location
  ) {
    throw new Error("Please fill in all fields");
  }

  // Hash the password before storing
  const hashedPassword = await captainModel.hashPassword(password);

  // Create and save the captain document
  const captain = await captainModel.create({
    fullname: {
      firstName: fullname.firstName,
      lastName: fullname.lastName,
    },
    email,
    password: hashedPassword, // ✅ Only store hashed password
    vehicleColor,
    vehicleNumber,
    capacity,
    vehicleType,
    location: {
      longitude: location.longitude,
      latitude: location.latitude,
    },
  });
    console.log(captain);
    

  return captain; // Ensure captain document is returned
};
