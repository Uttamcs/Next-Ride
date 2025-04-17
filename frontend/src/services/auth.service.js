import api from "./api";

const AuthService = {
  login: async (email, password) => {
    try {
      // Simulate API call
      console.log("Simulating login for", email);

      // For demo purposes, any email/password combination works
      const mockUser = {
        _id: "user123",
        fullname: {
          firstName: email.split("@")[0],
          lastName: "User",
        },
        email: email,
        phone: "+1234567890",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockResponse = {
        token: "mock-jwt-token-" + Date.now(),
        user: mockUser,
      };

      localStorage.setItem("token", mockResponse.token);
      localStorage.setItem("user", JSON.stringify(mockResponse.user));
      localStorage.setItem("userType", "user"); // Store user type for role-based routing

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return mockResponse;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  register: async (userData) => {
    try {
      console.log("Simulating registration for", userData);

      // Transform the data structure to match backend expectations
      const nameParts = userData.name.split(" ");

      // Ensure we have at least a first and last name
      if (nameParts.length < 2) {
        throw { message: "Please provide both first and last name" };
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Return a successful response
      return {
        success: true,
        message: "User registered successfully",
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error.message ? error : { message: "Registration failed" };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    return api.post("/users/logout");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put("/users/profile", userData);
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Profile update failed" };
    }
  },
};

export default AuthService;
