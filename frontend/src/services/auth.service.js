import api from "./api";

const AuthService = {
  login: async (email, password) => {
    try {
      console.log("Logging in user with email:", email);
      const response = await api.post("/users/login", { email, password });

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("userType", "user"); // Store user type for role-based routing
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error.response?.data || { message: "Login failed" };
    }
  },

  register: async (userData) => {
    try {
      console.log("Registering user:", userData);

      // Transform the data structure to match backend expectations
      const nameParts = userData.name.split(" ");

      // Ensure we have at least a first and last name
      if (nameParts.length < 2) {
        throw { message: "Please provide both first and last name" };
      }

      const requestData = {
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" "),
        email: userData.email,
        password: userData.password,
        phone: userData.phone || "",
      };

      const response = await api.post("/users/signup", requestData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  logout: async () => {
    try {
      // Make API call to logout
      await api.get("/users/logout");

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userType");

      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.error("Logout error:", error);

      // Even if the API call fails, clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userType");

      return { success: true, message: "Logged out successfully" };
    }
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
