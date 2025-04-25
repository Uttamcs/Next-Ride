const rideModel = require("../models/ride.model");
const captainModel = require("../models/captain.model");
const userModel = require("../models/user.model");

// Calculate fare based on distance, duration and vehicle type
const calculateFare = (distance, duration, vehicleType) => {
  let baseFare = 0;
  let perKmRate = 0;
  let perMinuteRate = 0;

  switch (vehicleType) {
    case "bike":
      baseFare = 20;
      perKmRate = 7;
      perMinuteRate = 1;
      break;
    case "auto":
      baseFare = 30;
      perKmRate = 10;
      perMinuteRate = 1.5;
      break;
    case "car":
      baseFare = 50;
      perKmRate = 15;
      perMinuteRate = 2;
      break;
    default:
      baseFare = 50;
      perKmRate = 15;
      perMinuteRate = 2;
  }

  const distanceFare = distance * perKmRate;
  const durationFare = duration * perMinuteRate;
  const totalFare = baseFare + distanceFare + durationFare;

  // Round to 2 decimal places
  return Math.round(totalFare * 100) / 100;
};

// Find nearby captains based on location and vehicle type
const findNearbyCaptains = async (
  longitude,
  latitude,
  vehicleType,
  maxDistance = 5
) => {
  // Convert maxDistance from km to radians (Earth's radius is approximately 6371 km)
  const maxDistanceRadians = maxDistance / 6371;

  const captains = await captainModel
    .find({
      vehicleType,
      isAvailable: true,
      isVerified: true,
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], maxDistanceRadians],
        },
      },
    })
    .sort({ location: 1 }); // Sort by nearest first

  return captains;
};

// Create a new ride request
const createRideRequest = async (rideData) => {
  try {
    // Calculate fare based on distance, duration and vehicle type
    const fare = calculateFare(
      rideData.distance,
      rideData.duration,
      rideData.vehicleType
    );

    // Create the ride with calculated fare
    const ride = await rideModel.create({
      ...rideData,
      fare,
    });

    return ride;
  } catch (error) {
    throw new Error(`Error creating ride request: ${error.message}`);
  }
};

// Update ride status
const updateRideStatus = async (
  rideId,
  status,
  captainId = null,
  additionalData = {}
) => {
  try {
    const updateData = { status, ...additionalData };

    // Add timestamp based on status
    switch (status) {
      case "accepted":
        updateData.acceptedAt = new Date();
        updateData.captain = captainId;
        break;
      case "in-progress":
        updateData.startedAt = new Date();
        break;
      case "completed":
        updateData.completedAt = new Date();
        break;
      case "cancelled":
        updateData.cancelledAt = new Date();
        break;
    }

    const ride = await rideModel
      .findByIdAndUpdate(rideId, updateData, { new: true })
      .populate("user captain");

    return ride;
  } catch (error) {
    throw new Error(`Error updating ride status: ${error.message}`);
  }
};

// Get ride details
const getRideDetails = async (rideId) => {
  try {
    const ride = await rideModel
      .findById(rideId)
      .populate("user", "fullname email")
      .populate(
        "captain",
        "fullname email vehicleNumber vehicleColor vehicleType"
      );

    if (!ride) {
      throw new Error("Ride not found");
    }

    return ride;
  } catch (error) {
    throw new Error(`Error getting ride details: ${error.message}`);
  }
};

// Get user's active ride
const getUserActiveRide = async (userId) => {
  try {
    // Find a ride that is not completed or cancelled
    const ride = await rideModel
      .findOne({
        user: userId,
        status: { $in: ["requested", "accepted", "in-progress"] },
      })
      .populate(
        "captain",
        "fullname vehicleNumber vehicleColor vehicleType rating"
      );

    return ride;
  } catch (error) {
    throw new Error(`Error getting user active ride: ${error.message}`);
  }
};

// Get user's ride history
const getUserRideHistory = async (userId) => {
  try {
    const rides = await rideModel
      .find({ user: userId })
      .populate("captain", "fullname vehicleNumber vehicleColor vehicleType")
      .sort({ requestedAt: -1 });

    return rides;
  } catch (error) {
    throw new Error(`Error getting user ride history: ${error.message}`);
  }
};

// Get captain's ride history
const getCaptainRideHistory = async (captainId) => {
  try {
    const rides = await rideModel
      .find({ captain: captainId })
      .populate("user", "fullname")
      .sort({ requestedAt: -1 });

    return rides;
  } catch (error) {
    throw new Error(`Error getting captain ride history: ${error.message}`);
  }
};

// Cancel ride
const cancelRide = async (rideId, cancelledBy, cancellationReason) => {
  try {
    const ride = await rideModel.findByIdAndUpdate(
      rideId,
      {
        status: "cancelled",
        cancelledAt: new Date(),
        cancelledBy,
        cancellationReason,
      },
      { new: true }
    );

    return ride;
  } catch (error) {
    throw new Error(`Error cancelling ride: ${error.message}`);
  }
};

module.exports = {
  calculateFare,
  findNearbyCaptains,
  createRideRequest,
  updateRideStatus,
  getRideDetails,
  getUserActiveRide,
  getUserRideHistory,
  getCaptainRideHistory,
  cancelRide,
};
