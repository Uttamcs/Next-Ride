import { createContext, useState, useEffect, useContext } from "react";
import RideService from "../services/ride.service";
import { useCombinedAuth } from "./CombinedAuthContext";
import { toast } from "react-toastify";
import io from "socket.io-client";

const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [activeRide, setActiveRide] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const { currentUser: user, isAuthenticated } = useCombinedAuth();

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io("http://localhost:3300", {
        withCredentials: true,
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated]);

  // Set up socket event listeners
  useEffect(() => {
    if (socket && user) {
      // Join user's room
      socket.emit("join", { userId: user._id });

      // Listen for ride updates
      socket.on("rideUpdate", (updatedRide) => {
        setActiveRide(updatedRide);
        toast.info(`Ride status updated: ${updatedRide.status}`);
      });

      // Listen for captain location updates
      socket.on("captainLocation", (location) => {
        setActiveRide((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            captainLocation: location,
          };
        });
      });

      // Listen for new ride requests
      socket.on("rideRequest", (ride) => {
        setActiveRide(ride);
        toast.info("New ride request created!");
      });

      return () => {
        socket.off("rideUpdate");
        socket.off("captainLocation");
        socket.off("rideRequest");
      };
    }
  }, [socket, user]);

  // Fetch active ride on mount
  useEffect(() => {
    if (isAuthenticated) {
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
    }
  }, [isAuthenticated]);

  const fetchActiveRide = async () => {
    try {
      setLoading(true);
      const data = await RideService.getActiveRide();
      setActiveRide(data.ride);
    } catch (error) {
      console.error("Error fetching active ride:", error);
      // No active ride is not an error
      if (error.response?.status !== 404) {
        toast.error("Failed to fetch active ride");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRideHistory = async () => {
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
      setLoading(true);
      const data = await RideService.requestRide(rideData);
      setActiveRide(data.ride);
      toast.success("Ride requested successfully!");
      return data.ride;
    } catch (error) {
      toast.error(error.message || "Failed to request ride");
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
