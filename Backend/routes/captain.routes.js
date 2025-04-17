const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const captainController = require("../controllers/captain.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Captain signup
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("fullname.firstName")
      .isLength({ min: 3, max: 20 })
      .withMessage("First name must be between 3 and 20 characters long"),
    body("fullname.lastName")
      .isLength({ min: 3, max: 20 })
      .withMessage("Last name must be between 3 and 20 characters long"),
    body("password")
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters long"),
    body("capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1"),
    body("vehicleColor").notEmpty().withMessage("Vehicle color is required"),
    body("vehicleNumber").notEmpty().withMessage("Vehicle number is required"),
    body("location.longitude")
      .isFloat()
      .withMessage("Longitude must be a valid number"),
    body("location.latitude")
      .isFloat()
      .withMessage("Latitude must be a valid number"),
    body("vehicleType")
      .isIn(["car", "bike", "auto"])
      .withMessage("Vehicle type must be Car, Bike or Auto"),
  ],
  captainController.registerCaptain
);

// Captain login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters long"),
  ],
  captainController.loginCaptain
);

// Get captain profile
router.get(
  "/profile",
  authMiddleware.authCaptain,
  captainController.getCaptainProfile
);

// Logout captain
router.get(
  "/logout",
  authMiddleware.authCaptain,
  captainController.logoutCaptain
);

// Update captain location
router.post(
  "/location",
  authMiddleware.authCaptain,
  [
    body("longitude").isFloat().withMessage("Longitude must be a valid number"),
    body("latitude").isFloat().withMessage("Latitude must be a valid number"),
  ],
  captainController.updateLocation
);

// Update captain availability
router.post(
  "/availability",
  authMiddleware.authCaptain,
  [
    body("isAvailable")
      .isBoolean()
      .withMessage("isAvailable must be a boolean"),
  ],
  captainController.updateAvailability
);

module.exports = router;
