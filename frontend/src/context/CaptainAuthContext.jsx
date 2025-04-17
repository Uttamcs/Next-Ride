import { createContext, useState, useEffect, useContext } from "react";
import CaptainAuthService from "../services/captain-auth.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CaptainAuthContext = createContext();

export const CaptainAuthProvider = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if captain is already logged in
    const currentCaptain = CaptainAuthService.getCurrentCaptain();
    if (currentCaptain) {
      setCaptain(currentCaptain);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await CaptainAuthService.login(email, password);
      setCaptain(data.captain);
      toast.success("Captain login successful!");
      navigate("/captain/dashboard");
      return data;
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (captainData) => {
    try {
      setLoading(true);
      const data = await CaptainAuthService.register(captainData);

      toast.success(
        "Captain registration successful! Please login with your email and password.",
        { autoClose: 5000 }
      );

      setTimeout(() => {
        navigate("/login", {
          state: {
            registrationSuccess: true,
            email: captainData.email,
            isCaptain: true
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
      } else if (
        error.message &&
        error.message.includes("No response from server")
      ) {
        toast.error(
          "No response from server. Please make sure the backend server is running.",
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
    CaptainAuthService.logout();
    setCaptain(null);
    toast.info("You have been logged out");
    navigate("/login");
  };

  const updateProfile = async (captainData) => {
    try {
      setLoading(true);
      const data = await CaptainAuthService.updateProfile(captainData);
      setCaptain(data.captain);
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
    captain,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!captain,
  };

  return <CaptainAuthContext.Provider value={value}>{children}</CaptainAuthContext.Provider>;
};

export const useCaptainAuth = () => {
  const context = useContext(CaptainAuthContext);
  if (!context) {
    throw new Error("useCaptainAuth must be used within a CaptainAuthProvider");
  }
  return context;
};

export default CaptainAuthContext;
