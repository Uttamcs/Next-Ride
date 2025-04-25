import api from "./api";

const RideService = {
  // Request a new ride
  requestRide: async (rideData) => {
    try {
      console.log("RideService: Processing ride request with data:", rideData);

      // Validate input data
      if (!rideData.origin || !rideData.destination) {
        throw new Error("Origin and destination are required");
      }

      if (!rideData.origin.coordinates || !rideData.destination.coordinates) {
        throw new Error("Origin and destination coordinates are required");
      }

      // Format the data to match the backend API expectations
      const formattedData = {
        pickupLocation: {
          address: rideData.origin.address || "Unknown location",
          coordinates: {
            latitude: rideData.origin.coordinates.latitude,
            longitude: rideData.origin.coordinates.longitude,
          },
        },
        dropLocation: {
          address: rideData.destination.address || "Unknown destination",
          coordinates: {
            latitude: rideData.destination.coordinates.latitude,
            longitude: rideData.destination.coordinates.longitude,
          },
        },
        distance: rideData.distance || 5, // Default value if not provided
        duration: rideData.duration || 15, // Default value if not provided
        vehicleType:
          rideData.rideType === "economy"
            ? "car"
            : rideData.rideType === "premium"
            ? "car"
            : "car", // Map frontend ride types to backend vehicle types
        paymentMethod: rideData.paymentMethod || "cash",
        fare: rideData.estimatedFare || 150,
      };

      console.log("RideService: Sending formatted data to API:", formattedData);

      // Make API call to request ride
      const response = await api.post("/rides/request", formattedData);
      console.log("RideService: Received response from API:", response.data);

      return response.data;
    } catch (error) {
      console.error("RideService: Failed to request ride:", error);

      // Check for network errors
      if (!error.response) {
        return Promise.reject({
          message: "Network error: Unable to connect to the server",
          isConnectionError: true,
        });
      }

      // Check for specific error types
      if (error.response?.status === 401) {
        return Promise.reject({
          message: "Authentication error: Please log in again",
          isAuthError: true,
        });
      }

      // Return the error from the API or a default error
      throw error.response?.data || { message: "Failed to request ride" };
    }
  },

  // Get user's ride history
  getRideHistory: async () => {
    try {
      // Make API call to get ride history
      const response = await api.get("/rides/user/history");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch ride history:", error);
      throw error.response?.data || { message: "Failed to fetch ride history" };
    }
  },

  // Get active ride details
  getActiveRide: async () => {
    try {
      // Make API call to get active ride
      const response = await api.get("/rides/active");
      return response.data;
    } catch (error) {
      // If 404, it means no active ride
      if (error.response?.status === 404) {
        console.log("No active ride found");
        throw { status: 404, message: "No active ride found" };
      }

      // Log the error for debugging
      console.error(
        "Failed to fetch active ride:",
        error.response?.data || error
      );

      // Return a more specific error message
      if (error.response?.data?.error?.includes("Cast to ObjectId")) {
        throw { message: "Invalid ride ID format" };
      }

      throw error.response?.data || { message: "Failed to fetch active ride" };
    }
  },

  // Cancel a ride
  cancelRide: async (rideId, reason = "Cancelled by user") => {
    try {
      // Make API call to cancel ride
      const response = await api.post(`/rides/${rideId}/cancel`, {
        cancellationReason: reason,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to cancel ride:", error);
      throw error.response?.data || { message: "Failed to cancel ride" };
    }
  },

  // Rate a completed ride
  rateRide: async (rideId, rating, comment) => {
    try {
      // Make API call to rate ride
      const response = await api.post(`/ratings/ride/${rideId}`, {
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to submit rating:", error);
      throw error.response?.data || { message: "Failed to submit rating" };
    }
  },

  // Get estimated fare
  getEstimatedFare: async (origin, destination) => {
    try {
      // Make API call to get fare estimate
      const response = await api.post("/rides/estimate", {
        origin: {
          latitude: origin.latitude,
          longitude: origin.longitude,
        },
        destination: {
          latitude: destination.latitude,
          longitude: destination.longitude,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to get fare estimate:", error);

      // Fallback to local calculation if API fails
      console.log("Falling back to local fare calculation");
      return calculateLocalFareEstimate(origin, destination);
    }
  },
};

// Helper function for the Haversine formula
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Fallback function to calculate fare estimate locally
function calculateLocalFareEstimate(origin, destination) {
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

  // Calculate fare based on distance and duration
  const baseFare = 50; // Base fare in currency units
  const perKmRate = 15; // Rate per km
  const perMinuteRate = 2; // Rate per minute

  const distanceCharge = distance * perKmRate;
  const timeCharge = duration * perMinuteRate;
  const totalFare = baseFare + distanceCharge + timeCharge;

  return {
    estimate: {
      distance: distance.toFixed(2),
      duration,
      baseFare,
      distanceCharge: distanceCharge.toFixed(2),
      timeCharge: timeCharge.toFixed(2),
      totalFare: totalFare.toFixed(2),
    },
  };
}

export default RideService;
