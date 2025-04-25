import { createContext, useState, useEffect, useContext } from "react";
import RideService from "../services/ride.service";
import { useCombinedAuth } from "./CombinedAuthContext";
import { toast } from "react-toastify";
import socketService from "../services/socket.service";
import { isOfflineMode } from "../utils/offlineMode";

const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [activeRide, setActiveRide] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser: user, isAuthenticated } = useCombinedAuth();

  // Set up socket event listeners
  useEffect(() => {
    if (isAuthenticated && user) {
      // Register event listeners for ride updates
      socketService.on("ride_update", (updatedRide) => {
        setActiveRide(updatedRide);
      });

      // Listen for captain location updates
      socketService.on("captain_location", (location) => {
        setActiveRide((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            captainLocation: location,
          };
        });
      });

      // Join user's room
      if (socketService.isConnected) {
        socketService.emit("join_room", { userId: user._id, userType: "user" });
      }

      // Cleanup on unmount
      return () => {
        socketService.off("ride_update");
        socketService.off("captain_location");
      };
    }
  }, [isAuthenticated, user]);

  // Fetch active ride on mount
  useEffect(() => {
    if (isAuthenticated && !isOfflineMode()) {
      const loadActiveRide = async () => {
        try {
          await fetchActiveRide();
        } catch (error) {
          // Ignore 404 errors (no active ride)
          if (error.response?.status !== 404) {
            console.error("Error loading active ride:", error);
          }
        }
      };

      loadActiveRide();
    } else if (isAuthenticated && isOfflineMode()) {
      console.log("App is in offline mode. Skipping active ride fetch.");
      // Set a mock empty state for offline mode
      setActiveRide(null);
    }
  }, [isAuthenticated]);

  const fetchActiveRide = async () => {
    // Skip API call if in offline mode
    if (isOfflineMode()) {
      console.log("App is in offline mode. Returning mock empty ride.");
      setActiveRide(null);
      return;
    }

    try {
      setLoading(true);
      const data = await RideService.getActiveRide();
      setActiveRide(data.ride);
    } catch (error) {
      console.error("Error fetching active ride:", error);
      // No active ride is not an error
      if (error.status === 404 || error.response?.status === 404) {
        console.log("No active ride found");
        setActiveRide(null);
      } else {
        // Only show toast for non-404 errors
        toast.error("Failed to fetch active ride");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRideHistory = async () => {
    // Return mock data if in offline mode
    if (isOfflineMode()) {
      console.log("App is in offline mode. Returning mock ride history.");
      const mockRideHistory = { rides: [] };
      setRideHistory(mockRideHistory);
      return mockRideHistory;
    }

    try {
      setLoading(true);
      const data = await RideService.getRideHistory();
      if (data && data.rides) {
        setRideHistory(data);
        return data;
      } else {
        console.error("Invalid ride history data format:", data);
        setRideHistory({ rides: [] });
        return { rides: [] };
      }
    } catch (error) {
      console.error("Failed to fetch ride history:", error);
      toast.error("Failed to fetch ride history");
      setRideHistory({ rides: [] });
      return { rides: [] };
    } finally {
      setLoading(false);
    }
  };

  const requestRide = async (rideData) => {
    try {
      // Validate ride data before making the API call
      if (!rideData.origin || !rideData.destination) {
        const error = new Error(
          "Origin and destination coordinates are required"
        );
        console.error("Ride data validation failed:", error);
        throw error;
      }

      if (!rideData.origin.coordinates || !rideData.destination.coordinates) {
        const error = new Error("Invalid coordinates format");
        console.error("Ride data validation failed:", error);
        throw error;
      }

      console.log("RideContext: Requesting ride with data:", rideData);
      setLoading(true);

      const data = await RideService.requestRide(rideData);
      console.log("RideContext: Ride request successful:", data);

      setActiveRide(data.ride);
      toast.success("Ride requested successfully!");
      return data.ride;
    } catch (error) {
      console.error("RideContext: Error requesting ride:", error);

      // Provide more specific error messages
      if (error.isConnectionError) {
        toast.error(
          "Cannot connect to the server. Please check your internet connection."
        );
      } else if (error.message && error.message.includes("coordinates")) {
        toast.error("Invalid location coordinates. Please try again.");
      } else if (error.message && error.message.includes("authentication")) {
        toast.error("Authentication error. Please try logging in again.");
      } else {
        toast.error(error.message || "Failed to request ride");
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelRide = async (rideId) => {
    try {
      setLoading(true);
      await RideService.cancelRide(rideId);
      setActiveRide(null);
      toast.info("Ride cancelled successfully");
    } catch (error) {
      toast.error(error.message || "Failed to cancel ride");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rateRide = async (rideId, rating, comment) => {
    try {
      setLoading(true);
      const data = await RideService.rateRide(rideId, rating, comment);
      toast.success("Rating submitted successfully!");
      return data;
    } catch (error) {
      toast.error(error.message || "Failed to submit rating");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getEstimatedFare = async (origin, destination) => {
    try {
      const data = await RideService.getEstimatedFare(origin, destination);
      return data.estimate;
    } catch (error) {
      toast.error("Failed to get fare estimate");
      throw error;
    }
  };

  const value = {
    activeRide,
    rideHistory,
    loading,
    requestRide,
    cancelRide,
    rateRide,
    fetchRideHistory,
    fetchActiveRide,
    getEstimatedFare,
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error("useRide must be used within a RideProvider");
  }
  return context;
};

export default RideContext;
