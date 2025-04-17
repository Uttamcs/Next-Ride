import api from "./api";

const RideService = {
  // Request a new ride
  requestRide: async (rideData) => {
    try {
      // Format the data to match the backend API expectations
      const formattedData = {
        pickupLocation: {
          address: rideData.origin.address,
          coordinates: {
            latitude: rideData.origin.coordinates.latitude,
            longitude: rideData.origin.coordinates.longitude,
          },
        },
        dropLocation: {
          address: rideData.destination.address,
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
      };

      // For development/testing, simulate a successful response
      // Remove this simulation and uncomment the API call for production
      // const response = await api.post('/rides/request', formattedData);

      // Simulate successful ride request
      const simulatedResponse = {
        message: "Ride requested successfully",
        ride: {
          _id: "ride_" + Math.random().toString(36).substr(2, 9),
          user: rideData.userId || "user123",
          status: "requested",
          pickupLocation: formattedData.pickupLocation,
          dropLocation: formattedData.dropLocation,
          distance: formattedData.distance,
          duration: formattedData.duration,
          vehicleType: formattedData.vehicleType,
          paymentMethod: formattedData.paymentMethod,
          fare: rideData.estimatedFare || 150,
          requestedAt: new Date().toISOString(),
        },
        captainsAvailable: Math.floor(Math.random() * 5) + 1,
      };

      return simulatedResponse;
    } catch (error) {
      throw error.response?.data || { message: "Failed to request ride" };
    }
  },

  // Get user's ride history
  getRideHistory: async () => {
    try {
      // Simulate ride history data
      const simulatedRides = [
        {
          _id: "ride_" + Math.random().toString(36).substr(2, 9),
          status: "completed",
          pickupLocation: {
            address: "123 Main St, City",
            coordinates: { latitude: 40.7128, longitude: -74.006 },
          },
          dropLocation: {
            address: "456 Park Ave, City",
            coordinates: { latitude: 40.758, longitude: -73.9855 },
          },
          distance: 3.5,
          duration: 15,
          fare: 120,
          vehicleType: "car",
          paymentMethod: "cash",
          requestedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          completedAt: new Date(Date.now() - 86000000).toISOString(),
        },
        {
          _id: "ride_" + Math.random().toString(36).substr(2, 9),
          status: "cancelled",
          pickupLocation: {
            address: "789 Broadway, City",
            coordinates: { latitude: 40.7484, longitude: -73.9857 },
          },
          dropLocation: {
            address: "101 5th Ave, City",
            coordinates: { latitude: 40.7353, longitude: -73.9911 },
          },
          distance: 2.1,
          duration: 10,
          fare: 80,
          vehicleType: "car",
          paymentMethod: "card",
          requestedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          cancelledAt: new Date(Date.now() - 172700000).toISOString(),
          cancelledBy: "user",
          cancellationReason: "Changed plans",
        },
      ];

      return { rides: simulatedRides };
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch ride history" };
    }
  },

  // Get active ride details
  getActiveRide: async () => {
    try {
      // Simulate active ride - 20% chance of having an active ride
      const hasActiveRide = Math.random() < 0.2;

      if (!hasActiveRide) {
        const error = new Error("No active ride found");
        error.response = { status: 404 };
        throw error;
      }

      const activeRide = {
        _id: "ride_" + Math.random().toString(36).substr(2, 9),
        status: "accepted",
        pickupLocation: {
          address: "123 Current St, City",
          coordinates: { latitude: 40.7128, longitude: -74.006 },
        },
        dropLocation: {
          address: "456 Destination Ave, City",
          coordinates: { latitude: 40.758, longitude: -73.9855 },
        },
        distance: 4.2,
        duration: 18,
        fare: 150,
        vehicleType: "car",
        paymentMethod: "cash",
        requestedAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        acceptedAt: new Date(Date.now() - 540000).toISOString(), // 9 minutes ago
        captain: {
          _id: "captain_123",
          fullname: "John Driver",
          vehicleNumber: "ABC-1234",
          vehicleColor: "Black",
          vehicleType: "car",
          rating: 4.8,
        },
      };

      return { ride: activeRide };
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch active ride" };
    }
  },

  // Cancel a ride
  cancelRide: async (rideId) => {
    try {
      // Simulate cancellation
      return {
        message: "Ride cancelled successfully",
        ride: {
          _id: rideId,
          status: "cancelled",
          cancelledAt: new Date().toISOString(),
          cancelledBy: "user",
          cancellationReason: "Cancelled by user",
        },
      };
    } catch (error) {
      throw error.response?.data || { message: "Failed to cancel ride" };
    }
  },

  // Rate a completed ride
  rateRide: async (rideId, rating, comment) => {
    try {
      // Simulate rating submission
      return {
        message: "Rating submitted successfully",
        rating: {
          _id: "rating_" + Math.random().toString(36).substr(2, 9),
          rideId,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw error.response?.data || { message: "Failed to submit rating" };
    }
  },

  // Get estimated fare
  getEstimatedFare: async (origin, destination) => {
    try {
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
    } catch (error) {
      throw error.response?.data || { message: "Failed to get fare estimate" };
    }
  },
};

// Helper function for the Haversine formula
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export default RideService;
