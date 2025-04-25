import axios from "axios";

const API_URL = "http://localhost:3300";

// Add a timeout to detect connection issues faster
const TIMEOUT = 10000; // 10 seconds

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: TIMEOUT, // Add timeout to detect connection issues faster
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("API: Adding auth token to request");
    } else {
      console.warn("API: No auth token found in localStorage");
    }

    // Log all API requests for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, {
      data: config.data,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration and other errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(
      `API Response Success: ${response.config.method.toUpperCase()} ${
        response.config.url
      }`,
      {
        status: response.status,
        data: response.data,
      }
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Network errors (no response from server)
    if (!error.response) {
      console.error("API Network error:", error.message);
      return Promise.reject({
        message:
          "Network error: Unable to connect to the server. Please check your internet connection or try again later.",
        isConnectionError: true,
      });
    }

    // Log the error response for debugging
    console.error(
      `API Response Error: ${originalRequest.method.toUpperCase()} ${
        originalRequest.url
      }`,
      {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      }
    );

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("API: Attempting to refresh token after 401 error");
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshResponse = await axios.post(
          `${API_URL}/users/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        if (refreshResponse.data.token) {
          console.log("API: Token refresh successful");
          localStorage.setItem("token", refreshResponse.data.token);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${refreshResponse.data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("API: Token refresh failed", refreshError);
        // If refresh token fails, logout user
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Delay redirect slightly to allow any pending operations to complete
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      }
    }

    // Handle specific error status codes
    switch (error.response.status) {
      case 404:
        // Not found - this is often expected (e.g., no active ride)
        console.log("Resource not found:", error.response.data);
        break;
      case 400:
        // Bad request - likely validation error
        console.error("Bad request:", error.response.data);
        break;
      case 403:
        // Forbidden - user doesn't have permission
        console.error("Forbidden:", error.response.data);
        break;
      case 500:
        // Server error
        console.error("Server error:", error.response.data);
        break;
      default:
        console.error(`Error ${error.response.status}:`, error.response.data);
    }

    return Promise.reject(error.response?.data || error);
  }
);

// Add a health check function
api.healthCheck = async () => {
  try {
    // Try to make a simple request to the server
    // This will be caught by the interceptors if there's a connection issue
    const response = await api.get("/health", { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.log("Health check failed:", error.message || "Unknown error");
    return false;
  }
};

export default api;
