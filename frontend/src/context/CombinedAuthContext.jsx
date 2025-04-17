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
      
      if (type === "captain") {
        data = await CaptainAuthService.login(email, password);
        setCurrentUser(data.captain);
        setUserType("captain");
        toast.success("Captain login successful!");
        navigate("/captain/dashboard");
      } else {
        data = await AuthService.login(email, password);
        setCurrentUser(data.user);
        setUserType("user");
        toast.success("Login successful!");
        navigate("/dashboard");
      }
      
      return data;
    } catch (error) {
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

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login", {
          state: {
            registrationSuccess: true,
            email: userData.email,
            userType: type
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
    isUser: userType === "user"
  };

  return <CombinedAuthContext.Provider value={value}>{children}</CombinedAuthContext.Provider>;
};

export const useCombinedAuth = () => {
  const context = useContext(CombinedAuthContext);
  if (!context) {
    throw new Error("useCombinedAuth must be used within a CombinedAuthProvider");
  }
  return context;
};

export default CombinedAuthContext;
