import { io } from "socket.io-client";
import { toast } from "react-toastify";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // Initialize socket connection
  init() {
    if (this.socket) {
      return;
    }

    // Check if we're in offline mode (using mock data)
    const token = localStorage.getItem("token");
    if (token && token.startsWith("mock-")) {
      console.log("App is in offline mode. Skipping socket connection.");
      return;
    }

    // Create socket connection
    this.socket = io("http://localhost:3300", {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    // Setup event listeners
    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Authenticate socket connection
      const token = localStorage.getItem("token");
      if (token) {
        this.socket.emit("authenticate", { token });
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error(
          "Unable to connect to the server. Please check your internet connection."
        );
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      this.isConnected = false;
    });

    // Listen for ride updates
    this.socket.on("ride_update", (data) => {
      console.log("Ride update received:", data);

      // Notify user about ride updates
      if (data.status === "accepted") {
        toast.success(
          `Your ride has been accepted by ${data.captain.fullname.firstName}`
        );
      } else if (data.status === "in-progress") {
        toast.info("Your ride has started");
      } else if (data.status === "completed") {
        toast.success("Your ride has been completed");
      } else if (data.status === "cancelled") {
        toast.warning(`Your ride has been cancelled by ${data.cancelledBy}`);
      }

      // Trigger any registered listeners
      this.triggerListeners("ride_update", data);
    });

    // Listen for captain location updates
    this.socket.on("captain_location", (data) => {
      console.log("Captain location update:", data);
      this.triggerListeners("captain_location", data);
    });

    // Listen for new ride requests (for captains)
    this.socket.on("new_ride_request", (data) => {
      console.log("New ride request:", data);
      this.triggerListeners("new_ride_request", data);
    });
  }

  // Register event listener
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (!this.listeners[event]) return;

    if (callback) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    } else {
      delete this.listeners[event];
    }
  }

  // Trigger registered listeners for an event
  triggerListeners(event, data) {
    if (!this.listeners[event]) return;

    this.listeners[event].forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }

  // Emit event to server
  emit(event, data) {
    // Check if we're in offline mode (using mock data)
    const token = localStorage.getItem("token");
    if (token && token.startsWith("mock-")) {
      console.log(
        `App is in offline mode. Skipping socket emit for event: ${event}`
      );
      return false;
    }

    if (!this.socket || !this.isConnected) {
      console.warn("Socket not connected, unable to emit event:", event);
      return false;
    }

    this.socket.emit(event, data);
    return true;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners = {};
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
