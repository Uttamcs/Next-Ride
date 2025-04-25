const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Get fare estimate
router.post(
  "/estimate",
  [
    body("origin.latitude")
      .isFloat()
      .withMessage("Origin latitude must be a valid number"),
    body("origin.longitude")
      .isFloat()
      .withMessage("Origin longitude must be a valid number"),
    body("destination.latitude")
      .isFloat()
      .withMessage("Destination latitude must be a valid number"),
    body("destination.longitude")
      .isFloat()
      .withMessage("Destination longitude must be a valid number"),
  ],
  rideController.estimateFare
);

// Request a new ride (for users)
router.post(
  "/request",
  authMiddleware.authUser,
  [
    body("pickupLocation.address")
      .notEmpty()
      .withMessage("Pickup address is required"),
    body("pickupLocation.coordinates.longitude")
      .isFloat()
      .withMessage("Pickup longitude must be a valid number"),
    body("pickupLocation.coordinates.latitude")
      .isFloat()
      .withMessage("Pickup latitude must be a valid number"),
    body("dropLocation.address")
      .notEmpty()
      .withMessage("Drop address is required"),
    body("dropLocation.coordinates.longitude")
      .isFloat()
      .withMessage("Drop longitude must be a valid number"),
    body("dropLocation.coordinates.latitude")
      .isFloat()
      .withMessage("Drop latitude must be a valid number"),
    body("distance")
      .isFloat({ min: 0.1 })
      .withMessage("Distance must be a positive number"),
    body("duration")
      .isFloat({ min: 1 })
      .withMessage("Duration must be a positive number"),
    body("vehicleType")
      .isIn(["car", "bike", "auto"])
      .withMessage("Vehicle type must be car, bike, or auto"),
    body("paymentMethod")
      .optional()
      .isIn(["cash", "card", "wallet"])
      .withMessage("Payment method must be cash, card, or wallet"),
  ],
  rideController.requestRide
);

// Accept a ride (for captains)
router.post(
  "/:rideId/accept",
  authMiddleware.authCaptain,
  rideController.acceptRide
);

// Start a ride (for captains)
router.post(
  "/:rideId/start",
  authMiddleware.authCaptain,
  rideController.startRide
);

// Complete a ride (for captains)
router.post(
  "/:rideId/complete",
  authMiddleware.authCaptain,
  rideController.completeRide
);

// Cancel a ride (for both users and captains)
router.post(
  "/:rideId/cancel",
  [
    body("cancellationReason")
      .notEmpty()
      .withMessage("Cancellation reason is required"),
  ],
  (req, res, next) => {
    // Check if either user or captain is authenticated
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Try to authenticate as user first, then as captain
    authMiddleware.authUser(req, res, (err) => {
      if (!err) {
        // User authentication successful
        return next();
      }

      // Try captain authentication
      authMiddleware.authCaptain(req, res, next);
    });
  },
  rideController.cancelRide
);

// Get user's active ride (for users)
router.get("/active", authMiddleware.authUser, rideController.getActiveRide);

// Get ride details (for both users and captains)
router.get(
  "/:rideId",
  (req, res, next) => {
    // Check if either user or captain is authenticated
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Try to authenticate as user first, then as captain
    authMiddleware.authUser(req, res, (err) => {
      if (!err) {
        // User authentication successful
        return next();
      }

      // Try captain authentication
      authMiddleware.authCaptain(req, res, next);
    });
  },
  rideController.getRideDetails
);

// Get user's ride history (for users)
router.get(
  "/user/history",
  authMiddleware.authUser,
  rideController.getUserRideHistory
);

// Get captain's ride history (for captains)
router.get(
  "/captain/history",
  authMiddleware.authCaptain,
  rideController.getCaptainRideHistory
);

module.exports = router;
