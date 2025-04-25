const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model");
const blackListTokenModel = require("../models/blacklist-token.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Authenticate user middleware
module.exports.authUser = async (req, res, next) => {

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if token is blacklisted
  const isBlackListedToken = await blackListTokenModel.findOne({ token });
  if (isBlackListedToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Authenticate captain middleware
module.exports.authCaptain = async (req, res, next) => {
  console.log("Captain auth middleware triggered");

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if token is blacklisted
  const isBlackListedToken = await blackListTokenModel.findOne({ token });
  if (isBlackListedToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded._id);
    if (!captain) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.captain = captain;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
