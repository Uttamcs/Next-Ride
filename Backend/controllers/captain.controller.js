const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.services");
const blackListTokenModel = require("../models/blacklist-token.model");
const { validationResult } = require("express-validator");

// Register a new captain
module.exports.registerCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fullname,
    email,
    password,
    vehicleColor,
    vehicleNumber,
    capacity,
    vehicleType,
    location,
  } = req.body;
  const isCaptainExist = await captainModel.findOne({ email });
  if (isCaptainExist) {
    return res.status(400).json({ message: "Captain already exists" });
  }

  const hashedPassword = await captainModel.hashPassword(password);

  const captainData = {
    fullname: {
      firstName: fullname.firstName,
      lastName: fullname.lastName,
    },
    email,
    password: hashedPassword,
    capacity,
    vehicleType,
    vehicleNumber,
    vehicleColor,
    location: {
      longitude: location.longitude,
      latitude: location.latitude,
    },
  };

  const captain = await captainService.createCaptain(captainData);
  const token = await captain.generateAuthToken();
  return res.status(201).json({ token, captain });
};

// Login captain
module.exports.loginCaptain = async (req, res) => {
  try {
    console.log("Captain login attempt:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(401).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log(`Looking for captain with email: ${email}`);

    const captain = await captainModel.findOne({ email }).select("+password");

    if (!captain) {
      console.log(`No captain found with email: ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log(`Captain found: ${captain._id}`);

    console.log("Comparing passwords...");
    const isMatch = await captain.comparePasswords(password);
    console.log(`Password match result: ${isMatch}`);

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Generating token...");
    const token = await captain.generateAuthToken();
    console.log("Token generated successfully");

    res.cookie("token", token);

    // Remove password from response
    const captainResponse = captain.toObject();
    delete captainResponse.password;

    console.log("Login successful");
    res.status(200).json({ token, captain: captainResponse });
  } catch (error) {
    console.error("Error in loginCaptain:", error);
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};

// Get captain profile
module.exports.getCaptainProfile = async (req, res) => {
  return res.status(200).json(req.captain);
};

// Logout captain
module.exports.logoutCaptain = async (req, res) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  await blackListTokenModel.create({ token });
  res.status(200).json({ message: "Logged out successfully" });
};

// Update captain location
module.exports.updateLocation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { longitude, latitude } = req.body;
  const captainId = req.captain._id;

  try {
    const captain = await captainModel.findByIdAndUpdate(
      captainId,
      { "location.longitude": longitude, "location.latitude": latitude },
      { new: true }
    );

    res.status(200).json({
      message: "Location updated successfully",
      location: captain.location,
    });
  } catch (error) {
    console.error("Error updating location:", error);
    res
      .status(500)
      .json({ message: "Error updating location", error: error.message });
  }
};

// Update captain availability
module.exports.updateAvailability = async (req, res) => {
  const { isAvailable } = req.body;
  const captainId = req.captain._id;

  try {
    const captain = await captainModel.findByIdAndUpdate(
      captainId,
      { isAvailable },
      { new: true }
    );

    res.status(200).json({
      message: `Captain is now ${isAvailable ? "available" : "unavailable"}`,
      captain,
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res
      .status(500)
      .json({ message: "Error updating availability", error: error.message });
  }
};
