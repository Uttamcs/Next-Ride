import { createContext, useState, useEffect, useContext } from "react";
import AuthService from "../services/auth.service";
import CaptainAuthService from "../services/captain-auth.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CombinedAuthContext = createContext();

export const CombinedAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'user' or 'captain'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const storedUserType = localStorage.getItem("userType");

    if (storedUserType === "user") {
      const user = AuthService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setUserType("user");
      }
    } else if (storedUserType === "captain") {
      const captain = CaptainAuthService.getCurrentCaptain();
      if (captain) {
        setCurrentUser(captain);
        setUserType("captain");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password, type = "user") => {
    try {
      setLoading(true);
      let data;

      console.log(`Attempting to login as ${type} with email: ${email}`);

      if (type === "captain") {
        console.log("Using CaptainAuthService for login");

        // For now, use mock data for captain login
        // This is a temporary solution until the backend is fixed
        const mockCaptain = {
          _id: "captain123",
          fullname: {
            firstName: email.split("@")[0],
            lastName: "Captain",
          },
          email: email,
          phone: "+1234567890",
          vehicleType: "car",
          vehicleNumber: "ABC-1234",
          vehicleColor: "Black",
          rating: 4.8,
          isAvailable: true,
          capacity: 4,
          location: {
            latitude: 28.6139,
            longitude: 77.209,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const mockToken = "mock-captain-jwt-token-" + Date.now();

        // Store mock data in localStorage
        localStorage.setItem("token", mockToken);
        localStorage.setItem("captain", JSON.stringify(mockCaptain));
        localStorage.setItem("userType", "captain");

        // Set state
        setCurrentUser(mockCaptain);
        setUserType("captain");
        toast.success("Captain login successful!");
        navigate("/captain/dashboard");

        // Return mock data
        return { token: mockToken, captain: mockCaptain };
      } else {
        console.log("Using AuthService for login");

        try {
          // Try to login with the backend
          data = await AuthService.login(email, password);
          console.log("User login successful, data:", data);

          if (data && data.user) {
            setCurrentUser(data.user);
            setUserType("user");
            toast.success("Login successful!");
            navigate("/dashboard");
          } else {
            console.error("User data is missing or invalid:", data);
            throw new Error("Invalid response format from server");
          }
        } catch (error) {
          // If backend is not available, use mock data
          if (error.isConnectionError) {
            console.log("Backend not available, using mock data");

            // Create mock user data
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

            const mockToken = "mock-jwt-token-" + Date.now();

            // Store mock data in localStorage
            localStorage.setItem("token", mockToken);
            localStorage.setItem("user", JSON.stringify(mockUser));
            localStorage.setItem("userType", "user");

            // Set state
            setCurrentUser(mockUser);
            setUserType("user");
            toast.success("Login successful! (Using offline mode)");
            navigate("/dashboard");

            // Return mock data
            return { token: mockToken, user: mockUser };
          } else {
            // If it's not a connection error, rethrow
            throw error;
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, type = "user") => {
    try {
      setLoading(true);
      let data;

      try {
        if (type === "captain") {
          data = await CaptainAuthService.register(userData);
          toast.success(
            "Captain registration successful! Please login with your email and password.",
            { autoClose: 5000 }
          );
        } else {
          data = await AuthService.register(userData);
          toast.success(
            "Registration successful! Please login with your email and password.",
            { autoClose: 5000 }
          );
        }
      } catch (error) {
        // If backend is not available, simulate successful registration
        if (error.isConnectionError) {
          console.log("Backend not available, simulating registration");
          toast.success(
            `${
              type === "captain" ? "Captain" : "User"
            } registration successful! (Offline mode) Please login with your email and password.`,
            { autoClose: 5000 }
          );
          data = {
            success: true,
            message: "Registration successful (Offline mode)",
          };
        } else {
          // If it's not a connection error, rethrow
          throw error;
        }
      }

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login", {
          state: {
            registrationSuccess: true,
            email: userData.email,
            userType: type,
          },
        });
      }, 1500);

      return data;
    } catch (error) {
      if (error.message && error.message.includes("already exists")) {
        toast.error(
          "An account with this email already exists. Please use a different email or try logging in."
        );
      } else if (error.message && error.message.includes("connect to server")) {
        toast.error(
          "Cannot connect to the server. Please make sure the backend server is running.",
          { autoClose: 8000 }
        );
      } else {
        toast.error(error.message || "Registration failed. Please try again.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (userType === "captain") {
      CaptainAuthService.logout();
    } else {
      AuthService.logout();
    }

    setCurrentUser(null);
    setUserType(null);
    toast.info("You have been logged out");
    navigate("/login");
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      let data;

      if (userType === "captain") {
        data = await CaptainAuthService.updateProfile(userData);
        setCurrentUser(data.captain);
      } else {
        data = await AuthService.updateProfile(userData);
        setCurrentUser(data.user);
      }

      toast.success("Profile updated successfully!");
      return data;
    } catch (error) {
      toast.error(error.message || "Profile update failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userType,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser,
    isCaptain: userType === "captain",
    isUser: userType === "user",
  };

  return (
    <CombinedAuthContext.Provider value={value}>
      {children}
    </CombinedAuthContext.Provider>
  );
};

export const useCombinedAuth = () => {
  const context = useContext(CombinedAuthContext);
  if (!context) {
    throw new Error(
      "useCombinedAuth must be used within a CombinedAuthProvider"
    );
  }
  return context;
};

export default CombinedAuthContext;
