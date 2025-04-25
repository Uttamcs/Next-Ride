import api from "./api";

const CaptainAuthService = {
  login: async (email, password) => {
    try {
      console.log("Logging in captain with email:", email);

      // Log the request payload for debugging
      console.log("Captain login request payload:", { email, password });

      const response = await api.post("/captains/login", { email, password });
      console.log("Captain login response:", response.data);

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("captain", JSON.stringify(response.data.captain));
        localStorage.setItem("userType", "captain"); // Store user type for role-based routing
      }

      return response.data;
    } catch (error) {
      console.error("Captain login error:", error);
      // Log more detailed error information
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      throw error.response?.data || { message: "Login failed" };
    }
  },

  register: async (captainData) => {
    try {
      console.log("Registering captain:", captainData);

      // Format the data for the backend
      const formattedData = {
        fullname: {
          firstName: captainData.firstName,
          lastName: captainData.lastName,
        },
        email: captainData.email,
        password: captainData.password,
        vehicleType: captainData.vehicleType,
        vehicleNumber: captainData.vehicleNumber,
        vehicleColor: captainData.vehicleColor,
        capacity: captainData.capacity || 4, // Default capacity for cars
        phone: captainData.phone || "",
        location: captainData.location || {
          latitude: 28.6139,
          longitude: 77.209,
        }, // Default to Delhi if not provided
      };

      const response = await api.post("/captains/signup", formattedData);
      return response.data;
    } catch (error) {
      console.error("Captain registration error:", error);
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  logout: async () => {
    try {
      // Make API call to logout
      await api.get("/captains/logout");

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("captain");
      localStorage.removeItem("userType");

      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.error("Logout error:", error);

      // Even if the API call fails, clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("captain");
      localStorage.removeItem("userType");

      return { success: true, message: "Logged out successfully" };
    }
  },

  getCurrentCaptain: () => {
    const captainStr = localStorage.getItem("captain");
    if (captainStr) {
      return JSON.parse(captainStr);
    }
    return null;
  },

  updateProfile: async (captainData) => {
    try {
      console.log("Updating captain profile:", captainData);

      // Make API call to update profile
      const response = await api.put("/captains/profile", captainData);

      // Update local storage with the updated captain data
      if (response.data && response.data.captain) {
        localStorage.setItem("captain", JSON.stringify(response.data.captain));
      }

      return response.data;
    } catch (error) {
      console.error("Profile update error:", error);
      throw error.response?.data || { message: "Profile update failed" };
    }
  },
};

export default CaptainAuthService;
