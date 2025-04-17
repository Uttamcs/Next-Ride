import api from "./api";

const CaptainAuthService = {
  login: async (email, password) => {
    try {
      // Simulate API call
      console.log("Simulating captain login for", email);

      // For demo purposes, any email/password combination works
      const mockCaptain = {
        _id: "captain123",
        fullname: {
          firstName: email.split("@")[0],
          lastName: "Captain",
        },
        email: email,
        phone: "+1234567890",
        vehicleType: "Sedan",
        vehicleNumber: "ABC-1234",
        vehicleColor: "Black",
        rating: 4.8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockResponse = {
        token: "mock-captain-jwt-token-" + Date.now(),
        captain: mockCaptain,
      };

      localStorage.setItem("token", mockResponse.token);
      localStorage.setItem("captain", JSON.stringify(mockResponse.captain));
      localStorage.setItem("userType", "captain"); // Store user type for role-based routing

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return mockResponse;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  register: async (captainData) => {
    try {
      console.log("Simulating captain registration for", captainData);

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
        location: captainData.location || {
          latitude: 28.6139,
          longitude: 77.209,
        }, // Default to Delhi if not provided
      };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Return a successful response
      return {
        success: true,
        message: "Captain registered successfully",
      };
    } catch (error) {
      console.error("Captain registration error:", error);
      throw error.message ? error : { message: "Registration failed" };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("captain");
    localStorage.removeItem("userType");
    return api.post("/captains/logout");
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
      const response = await api.put("/captains/profile", captainData);
      if (response.data.captain) {
        localStorage.setItem("captain", JSON.stringify(response.data.captain));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Profile update failed" };
    }
  },
};

export default CaptainAuthService;
