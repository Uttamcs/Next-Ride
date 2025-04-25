const rideService = require("../services/ride.services");
const captainModel = require("../models/captain.model");
const { validationResult } = require("express-validator");

// Estimate fare for a ride
module.exports.estimateFare = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination } = req.body;
    const vehicleType = req.body.vehicleType || "car";

    // Calculate distance using Haversine formula
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(destination.latitude - origin.latitude);
    const dLon = deg2rad(destination.longitude - origin.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(origin.latitude)) *
        Math.cos(deg2rad(destination.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    // Estimate duration (assuming average speed of 30 km/h)
    const duration = Math.round((distance / 30) * 60); // Duration in minutes

    // Calculate fare
    const fare = rideService.calculateFare(distance, duration, vehicleType);

    res.status(200).json({
      estimate: {
        distance: distance.toFixed(2),
        duration,
        fare,
        vehicleType,
      },
    });
  } catch (error) {
    console.error("Error estimating fare:", error);
    res
      .status(500)
      .json({ message: "Error estimating fare", error: error.message });
  }
};

// Helper function for the Haversine formula
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Request a new ride
module.exports.requestRide = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      pickupLocation,
      dropLocation,
      distance,
      duration,
      vehicleType,
      paymentMethod,
    } = req.body;

    // Create ride request with user ID from authenticated user
    const rideData = {
      user: req.user._id,
      pickupLocation,
      dropLocation,
      distance,
      duration,
      vehicleType,
      paymentMethod,
    };

    const ride = await rideService.createRideRequest(rideData);

    // Find nearby captains (this would be used with WebSockets to notify captains)
    const nearbyCaptains = await rideService.findNearbyCaptains(
      pickupLocation.coordinates.longitude,
      pickupLocation.coordinates.latitude,
      vehicleType
    );

    // In a real implementation, we would notify these captains via WebSockets
    // For now, we'll just return the ride details

    res.status(201).json({
      message: "Ride requested successfully",
      ride,
      captainsAvailable: nearbyCaptains.length,
    });
  } catch (error) {
    console.error("Error requesting ride:", error);
    res
      .status(500)
      .json({ message: "Error requesting ride", error: error.message });
  }
};

// Accept a ride (for captains)
module.exports.acceptRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const captainId = req.captain._id;

    // Check if captain is available
    const captain = await captainModel.findById(captainId);
    if (!captain.isAvailable) {
      return res
        .status(400)
        .json({ message: "You are not available to accept rides" });
    }

    // Update ride status to accepted
    const ride = await rideService.updateRideStatus(
      rideId,
      "accepted",
      captainId
    );

    // Update captain availability
    await captainModel.findByIdAndUpdate(captainId, { isAvailable: false });

    res.status(200).json({
      message: "Ride accepted successfully",
      ride,
    });
  } catch (error) {
    console.error("Error accepting ride:", error);
    res
      .status(500)
      .json({ message: "Error accepting ride", error: error.message });
  }
};

// Start a ride (for captains)
module.exports.startRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    // Update ride status to in-progress
    const ride = await rideService.updateRideStatus(rideId, "in-progress");

    res.status(200).json({
      message: "Ride started successfully",
      ride,
    });
  } catch (error) {
    console.error("Error starting ride:", error);
    res
      .status(500)
      .json({ message: "Error starting ride", error: error.message });
  }
};

// Complete a ride (for captains)
module.exports.completeRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const captainId = req.captain._id;

    // Update ride status to completed
    const ride = await rideService.updateRideStatus(rideId, "completed");

    // Update captain availability
    await captainModel.findByIdAndUpdate(captainId, { isAvailable: true });

    res.status(200).json({
      message: "Ride completed successfully",
      ride,
    });
  } catch (error) {
    console.error("Error completing ride:", error);
    res
      .status(500)
      .json({ message: "Error completing ride", error: error.message });
  }
};

// Cancel a ride (for both users and captains)
module.exports.cancelRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { cancellationReason } = req.body;

    // Determine who is cancelling the ride
    const cancelledBy = req.user ? "user" : req.captain ? "captain" : "system";

    // If captain is cancelling, update their availability
    if (cancelledBy === "captain") {
      await captainModel.findByIdAndUpdate(req.captain._id, {
        isAvailable: true,
      });
    }

    // Cancel the ride
    const ride = await rideService.cancelRide(
      rideId,
      cancelledBy,
      cancellationReason
    );

    res.status(200).json({
      message: "Ride cancelled successfully",
      ride,
    });
  } catch (error) {
    console.error("Error cancelling ride:", error);
    res
      .status(500)
      .json({ message: "Error cancelling ride", error: error.message });
  }
};

// Get ride details
module.exports.getRideDetails = async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await rideService.getRideDetails(rideId);

    res.status(200).json({
      ride,
    });
  } catch (error) {
    console.error("Error getting ride details:", error);
    res
      .status(500)
      .json({ message: "Error getting ride details", error: error.message });
  }
};

// Get user's active ride
module.exports.getActiveRide = async (req, res) => {
  try {
    const userId = req.user._id;

    const ride = await rideService.getUserActiveRide(userId);

    if (!ride) {
      return res.status(404).json({ message: "No active ride found" });
    }

    res.status(200).json({
      ride,
    });
  } catch (error) {
    console.error("Error getting active ride:", error);
    res
      .status(500)
      .json({ message: "Error getting active ride", error: error.message });
  }
};

// Get user's ride history
module.exports.getUserRideHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const rides = await rideService.getUserRideHistory(userId);

    res.status(200).json({
      rides,
    });
  } catch (error) {
    console.error("Error getting user ride history:", error);
    res.status(500).json({
      message: "Error getting user ride history",
      error: error.message,
    });
  }
};

// Get captain's ride history
module.exports.getCaptainRideHistory = async (req, res) => {
  try {
    const captainId = req.captain._id;

    const rides = await rideService.getCaptainRideHistory(captainId);

    res.status(200).json({
      rides,
    });
  } catch (error) {
    console.error("Error getting captain ride history:", error);
    res.status(500).json({
      message: "Error getting captain ride history",
      error: error.message,
    });
  }
};
