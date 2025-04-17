import { createContext, useState, useEffect, useContext } from "react";
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await AuthService.login(email, password);
      setUser(data.user);
      toast.success("Login successful!");
      navigate("/dashboard");
      return data;
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const data = await AuthService.register(userData);

      // Show success message with more details
      toast.success(
        "Registration successful! Please login with your email and password.",
        { autoClose: 5000 }
      );

      // Redirect to login page after a short delay to allow user to read the message
      setTimeout(() => {
        navigate("/login", {
          state: {
            registrationSuccess: true,
            email: userData.email,
          },
        });
      }, 1500);

      return data;
    } catch (error) {
      // Show detailed error message based on error type
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
    AuthService.logout();
    setUser(null);
    toast.info("You have been logged out");
    navigate("/login");
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const data = await AuthService.updateProfile(userData);
      setUser(data.user);
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
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
