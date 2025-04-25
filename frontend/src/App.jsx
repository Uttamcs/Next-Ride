import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context Providers
import { CombinedAuthProvider } from "./context/CombinedAuthContext";
import { RideProvider } from "./context/RideContext";
import { ThemeProvider, useThemeMode } from "./context/ThemeContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookRide from "./pages/BookRide";
import Dashboard from "./pages/Dashboard";
import MyRides from "./pages/MyRides";
import Profile from "./pages/Profile";
import PaymentMethods from "./pages/PaymentMethods";
import RideDetails from "./pages/RideDetails";
import About from "./pages/About";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import CaptainRegister from "./pages/CaptainRegister";
import CaptainDashboard from "./pages/CaptainDashboard";

// Import ProtectedRoute component
import ProtectedRoute from "./components/ProtectedRoute";

// Theme configuration
const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#3563E9", // Modern Blue
        light: "#6B8EFC",
        dark: "#1E3A8A",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#54BD95", // Teal Green
        light: "#7DDCB5",
        dark: "#2C9D6F",
        contrastText: "#FFFFFF",
      },
      error: {
        main: "#FF4D4F", // Bright Red
        light: "#FF7875",
        dark: "#D9363E",
      },
      warning: {
        main: "#FAAD14", // Gold
        light: "#FFD666",
        dark: "#D48806",
      },
      info: {
        main: "#1890FF", // Sky Blue
        light: "#69C0FF",
        dark: "#096DD9",
      },
      success: {
        main: "#52C41A", // Green
        light: "#95DE64",
        dark: "#389E0D",
      },
      ...(mode === "light"
        ? {
            // Light mode colors
            background: {
              default: "#F7F9FC",
              paper: "#FFFFFF",
              accent: "#F1F5FE",
            },
            text: {
              primary: "#1A202C",
              secondary: "#596780",
              disabled: "#A0AEC0",
              hint: "#718096",
            },
            divider: "rgba(0, 0, 0, 0.06)",
          }
        : {
            // Dark mode colors
            background: {
              default: "#0F172A",
              paper: "#1E293B",
              accent: "#1E3A8A",
            },
            text: {
              primary: "#F8FAFC",
              secondary: "#CBD5E1",
              disabled: "#64748B",
              hint: "#94A3B8",
            },
            divider: "rgba(255, 255, 255, 0.08)",
          }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: "2.5rem",
        lineHeight: 1.2,
        letterSpacing: "-0.01em",
      },
      h2: {
        fontWeight: 700,
        fontSize: "2rem",
        lineHeight: 1.3,
        letterSpacing: "-0.01em",
      },
      h3: {
        fontWeight: 700,
        fontSize: "1.5rem",
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.25rem",
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.125rem",
        lineHeight: 1.5,
      },
      h6: {
        fontWeight: 600,
        fontSize: "1rem",
        lineHeight: 1.5,
      },
      subtitle1: {
        fontWeight: 500,
        fontSize: "1rem",
        lineHeight: 1.5,
        letterSpacing: "0.00938em",
      },
      subtitle2: {
        fontWeight: 500,
        fontSize: "0.875rem",
        lineHeight: 1.57,
        letterSpacing: "0.00714em",
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.5,
        letterSpacing: "0.00938em",
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.57,
        letterSpacing: "0.00714em",
      },
      button: {
        fontWeight: 600,
        fontSize: "0.875rem",
        lineHeight: 1.75,
        letterSpacing: "0.02857em",
        textTransform: "none",
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      "none",
      "0px 2px 4px rgba(0, 0, 0, 0.05)",
      "0px 4px 6px rgba(0, 0, 0, 0.07)",
      "0px 6px 8px rgba(0, 0, 0, 0.08)",
      "0px 8px 12px rgba(0, 0, 0, 0.09)",
      "0px 10px 14px rgba(0, 0, 0, 0.1)",
      "0px 12px 16px rgba(0, 0, 0, 0.11)",
      "0px 14px 18px rgba(0, 0, 0, 0.12)",
      "0px 16px 20px rgba(0, 0, 0, 0.13)",
      "0px 18px 22px rgba(0, 0, 0, 0.14)",
      "0px 20px 24px rgba(0, 0, 0, 0.15)",
      "0px 22px 26px rgba(0, 0, 0, 0.16)",
      "0px 24px 28px rgba(0, 0, 0, 0.17)",
      "0px 26px 30px rgba(0, 0, 0, 0.18)",
      "0px 28px 32px rgba(0, 0, 0, 0.19)",
      "0px 30px 34px rgba(0, 0, 0, 0.2)",
      "0px 32px 36px rgba(0, 0, 0, 0.21)",
      "0px 34px 38px rgba(0, 0, 0, 0.22)",
      "0px 36px 40px rgba(0, 0, 0, 0.23)",
      "0px 38px 42px rgba(0, 0, 0, 0.24)",
      "0px 40px 44px rgba(0, 0, 0, 0.25)",
      "0px 42px 46px rgba(0, 0, 0, 0.26)",
      "0px 44px 48px rgba(0, 0, 0, 0.27)",
      "0px 46px 50px rgba(0, 0, 0, 0.28)",
      "0px 48px 52px rgba(0, 0, 0, 0.29)",
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            boxSizing: "border-box",
          },
          html: {
            scrollBehavior: "smooth",
          },
          a: {
            textDecoration: "none",
            color: "inherit",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 8,
            boxShadow: "none",
            padding: "10px 20px",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 10px rgba(0, 0, 0, 0.1)",
            },
          },
          contained: {
            "&:hover": {
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
            },
          },
          containedPrimary: {
            background: "linear-gradient(90deg, #3563E9 0%, #6B8EFC 100%)",
            "&:hover": {
              background: "linear-gradient(90deg, #1E3A8A 0%, #3563E9 100%)",
            },
          },
          containedSecondary: {
            background: "linear-gradient(90deg, #54BD95 0%, #7DDCB5 100%)",
            "&:hover": {
              background: "linear-gradient(90deg, #2C9D6F 0%, #54BD95 100%)",
            },
          },
          outlined: {
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            transition: "all 0.3s ease-in-out",
          },
          elevation1: {
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          },
          elevation2: {
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.07)",
          },
          elevation3: {
            boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0px 16px 30px rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              transition: "all 0.2s",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: mode === "light" ? "#3563E9" : "#6B8EFC",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRadius: "0 16px 16px 0",
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor:
              mode === "light"
                ? "rgba(0, 0, 0, 0.06)"
                : "rgba(255, 255, 255, 0.08)",
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
  });

import { useEffect } from "react";
import socketService from "./services/socket.service";

// AppContent component to use the theme context
const AppContent = () => {
  const { mode } = useThemeMode();
  const theme = getTheme(mode);

  // Initialize socket connection when the app loads
  useEffect(() => {
    // Check if we're in offline mode
    const token = localStorage.getItem("token");
    const isOfflineMode = token && token.startsWith("mock-");

    if (!isOfflineMode) {
      // Initialize socket connection only if not in offline mode
      socketService.init();

      // Cleanup on unmount
      return () => {
        socketService.disconnect();
      };
    } else {
      console.log("App is in offline mode. Skipping socket initialization.");
    }
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <CombinedAuthProvider>
          <RideProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/captain-register" element={<CaptainRegister />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book-ride"
                element={
                  <ProtectedRoute>
                    <BookRide />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-rides"
                element={
                  <ProtectedRoute>
                    <MyRides />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-methods"
                element={
                  <ProtectedRoute>
                    <PaymentMethods />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rides/:id"
                element={
                  <ProtectedRoute>
                    <RideDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/captain/dashboard"
                element={
                  <ProtectedRoute>
                    <CaptainDashboard />
                  </ProtectedRoute>
                }
              />
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer position="bottom-right" autoClose={5000} />
            <Footer />
          </RideProvider>
        </CombinedAuthProvider>
      </Router>
    </MuiThemeProvider>
  );
};

// Main App component with ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
