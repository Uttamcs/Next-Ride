import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCombinedAuth } from "../context/CombinedAuthContext";
import { useThemeMode } from "../context/ThemeContext";
import api from "../services/api";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
  Badge,
  useScrollTrigger,
  Slide,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import HistoryIcon from "@mui/icons-material/History";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import Chip from "@mui/material/Chip";

// Hide navbar on scroll down, show on scroll up
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const { currentUser, userType, logout, isAuthenticated } = useCombinedAuth();
  const { mode, toggleColorMode } = useThemeMode();
  const theme = useTheme();
  const location = useLocation();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Check if backend is available
  useEffect(() => {
    let isMounted = true;
    let interval;

    const checkBackendStatus = async () => {
      if (!isMounted) return;

      try {
        // Use a simple fetch instead of the api.healthCheck to avoid circular dependencies
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch("http://localhost:3300/health", {
          signal: controller.signal,
        }).catch(() => null);

        clearTimeout(timeoutId);

        if (isMounted) {
          setIsOffline(!response || !response.ok);
        }
      } catch (error) {
        if (isMounted) {
          setIsOffline(true);
        }
      }
    };

    // Check immediately
    checkBackendStatus();

    // Then check every 30 seconds
    interval = setInterval(checkBackendStatus, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  // Check if the current path matches the nav item path
  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = isAuthenticated
    ? [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Book Ride", path: "/book-ride" },
        { name: "My Rides", path: "/my-rides" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Services", path: "/services" },
      ];

  const drawer = (
    <Box
      sx={{
        textAlign: "center",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src="/logo.svg"
          alt="Next Ride Logo"
          sx={{ width: 40, height: 40, mr: 1 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Next Ride
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              sx={{
                textAlign: "center",
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                bgcolor: isActive(item.path)
                  ? "background.accent"
                  : "transparent",
                color: isActive(item.path) ? "primary.main" : "text.primary",
                "&:hover": {
                  bgcolor: isActive(item.path)
                    ? "background.accent"
                    : mode === "light"
                    ? "rgba(0, 0, 0, 0.04)"
                    : "rgba(255, 255, 255, 0.08)",
                },
              }}
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
            >
              <ListItemText
                primary={
                  <Typography
                    sx={{ fontWeight: isActive(item.path) ? 600 : 400 }}
                  >
                    {item.name}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
        {!isAuthenticated && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ textAlign: "center", borderRadius: 1, mx: 1, mb: 0.5 }}
                component={Link}
                to="/login"
                onClick={handleDrawerToggle}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  textAlign: "center",
                  bgcolor: "primary.main",
                  color: "white",
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
                component={Link}
                to="/register"
                onClick={handleDrawerToggle}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
      <Divider />
      {isOffline && (
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <CloudOffIcon color="warning" fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" color="warning.main">
            Offline Mode
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {mode === "dark" ? "Dark Mode" : "Light Mode"}
        </Typography>
        <IconButton onClick={toggleColorMode} color="primary" size="small">
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={scrolled ? 2 : 0}
          sx={{
            backgroundColor:
              mode === "light"
                ? "rgba(255, 255, 255, 0.95)"
                : "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(10px)",
            color: mode === "light" ? "text.primary" : "white",
            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
            boxShadow: scrolled ? "0px 4px 20px rgba(0, 0, 0, 0.1)" : "none",
            borderBottom: scrolled
              ? "none"
              : `1px solid ${
                  mode === "light"
                    ? "rgba(0, 0, 0, 0.06)"
                    : "rgba(255, 255, 255, 0.08)"
                }`,
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ py: 1 }}>
              {/* Logo for larger screens */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  mr: 2,
                }}
              >
                <Box
                  component="img"
                  src="/logo.svg"
                  alt="Next Ride Logo"
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 1,
                    filter:
                      !scrolled && location.pathname === "/"
                        ? "brightness(1.2)"
                        : "none",
                  }}
                />
                <Typography
                  variant="h6"
                  noWrap
                  component={Link}
                  to="/"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: ".05rem",
                    color: "inherit",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                  }}
                >
                  Next Ride
                </Typography>
              </Box>

              {/* Mobile menu icon */}
              <Box sx={{ display: { xs: "flex", md: "none" }, mr: 2 }}>
                <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleDrawerToggle}
                  color="inherit"
                  edge="start"
                >
                  <MenuIcon />
                </IconButton>
              </Box>

              {/* Logo for mobile */}
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  alignItems: "center",
                  flexGrow: 1,
                }}
              >
                <Box
                  component="img"
                  src="/logo.svg"
                  alt="Next Ride Logo"
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                    filter:
                      !scrolled && location.pathname === "/"
                        ? "brightness(1.2)"
                        : "none",
                  }}
                />
                <Typography
                  variant="h6"
                  noWrap
                  component={Link}
                  to="/"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: ".05rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  Next Ride
                </Typography>
              </Box>

              {/* Desktop navigation */}
              <Box
                sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4 }}
              >
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    component={Link}
                    to={item.path}
                    sx={{
                      mx: 1.5,
                      color: "inherit",
                      position: "relative",
                      fontWeight: isActive(item.path) ? 600 : 400,
                      padding: "8px 12px",
                      borderRadius: "12px",
                      transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      backgroundColor: isActive(item.path)
                        ? mode === "light"
                          ? "rgba(53, 99, 233, 0.08)"
                          : "rgba(53, 99, 233, 0.15)"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: isActive(item.path)
                          ? mode === "light"
                            ? "rgba(53, 99, 233, 0.12)"
                            : "rgba(53, 99, 233, 0.2)"
                          : mode === "light"
                          ? "rgba(0, 0, 0, 0.04)"
                          : "rgba(255, 255, 255, 0.05)",
                        transform: "translateY(-2px)",
                      },
                      "&::after": isActive(item.path)
                        ? {
                            content: '""',
                            position: "absolute",
                            bottom: -2,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "40%",
                            height: "3px",
                            background:
                              "linear-gradient(90deg, #3563E9 0%, #6B8EFC 100%)",
                            borderRadius: "3px 3px 0 0",
                          }
                        : {},
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>

              {/* Offline mode indicator */}
              {isOffline && (
                <Chip
                  icon={<CloudOffIcon fontSize="small" />}
                  label="Offline Mode"
                  color="warning"
                  size="small"
                  sx={{ mr: 2 }}
                />
              )}

              {/* Theme toggle button */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip
                  title={
                    mode === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                  arrow
                  placement="bottom"
                >
                  <IconButton
                    onClick={toggleColorMode}
                    color="inherit"
                    sx={{
                      ml: 1,
                      bgcolor:
                        mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.04)",
                      borderRadius: 2,
                      width: 40,
                      height: 40,
                      transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      "&:hover": {
                        bgcolor:
                          mode === "dark"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.08)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    {mode === "dark" ? (
                      <Brightness7Icon sx={{ fontSize: 22 }} />
                    ) : (
                      <Brightness4Icon sx={{ fontSize: 22 }} />
                    )}
                  </IconButton>
                </Tooltip>

                {/* User menu or login/register buttons */}
                <Box sx={{ ml: 2 }}>
                  {isAuthenticated ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {/* Notifications */}
                      <Tooltip title="Notifications">
                        <IconButton color="inherit" sx={{ mr: 1 }}>
                          <Badge badgeContent={notifications} color="error">
                            <NotificationsNoneIcon />
                          </Badge>
                        </IconButton>
                      </Tooltip>

                      {/* User menu */}
                      <Tooltip
                        title="Account settings"
                        arrow
                        placement="bottom"
                      >
                        <IconButton
                          onClick={handleOpenUserMenu}
                          sx={{
                            p: 0.5,
                            border: "2px solid",
                            borderColor: "primary.main",
                            borderRadius: "50%",
                            transition:
                              "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                            "&:hover": {
                              borderColor: "primary.light",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 10px rgba(53, 99, 233, 0.2)",
                            },
                          }}
                        >
                          <Avatar
                            alt={
                              currentUser?.fullname?.firstName ||
                              currentUser?.name
                            }
                            src={
                              currentUser?.profilePicture ||
                              "/avatar-placeholder.png"
                            }
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: "primary.main",
                              fontWeight: "bold",
                              fontSize: "1.1rem",
                            }}
                          >
                            {(
                              currentUser?.fullname?.firstName ||
                              currentUser?.name ||
                              ""
                            ).charAt(0)}
                          </Avatar>
                        </IconButton>
                      </Tooltip>
                      <Menu
                        sx={{
                          mt: "45px",
                          "& .MuiPaper-root": {
                            overflow: "visible",
                            filter:
                              "drop-shadow(0px 4px 20px rgba(0,0,0,0.15))",
                            mt: 1.5,
                            borderRadius: 3,
                            minWidth: 220,
                            p: 1,
                            "&:before": {
                              content: '""',
                              display: "block",
                              position: "absolute",
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: "background.paper",
                              transform: "translateY(-50%) rotate(45deg)",
                              zIndex: 0,
                              boxShadow: "-2px -2px 5px rgba(0,0,0,0.05)",
                            },
                          },
                        }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        slotProps={{
                          paper: {
                            elevation: 4,
                          },
                        }}
                      >
                        <Box sx={{ px: 2, py: 1 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ fontWeight: 500, fontSize: "0.75rem", mb: 1 }}
                          >
                            Hello,{" "}
                            {currentUser?.fullname?.firstName ||
                              currentUser?.name?.split(" ")[0] ||
                              "User"}
                          </Typography>
                        </Box>
                        <MenuItem
                          component={Link}
                          to="/profile"
                          onClick={handleCloseUserMenu}
                          sx={{
                            py: 1.5,
                            px: 2.5,
                            borderRadius: 2,
                            mx: 0.5,
                            mb: 0.5,
                            transition: "all 0.2s",
                            "&:hover": {
                              bgcolor:
                                mode === "light"
                                  ? "rgba(53, 99, 233, 0.08)"
                                  : "rgba(53, 99, 233, 0.15)",
                              transform: "translateX(5px)",
                            },
                          }}
                        >
                          <AccountCircleIcon
                            sx={{
                              mr: 1.5,
                              fontSize: 20,
                              color: "primary.main",
                            }}
                          />
                          <Typography fontWeight={500}>Profile</Typography>
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/payment-methods"
                          onClick={handleCloseUserMenu}
                          sx={{
                            py: 1.5,
                            px: 2.5,
                            borderRadius: 2,
                            mx: 0.5,
                            mb: 0.5,
                            transition: "all 0.2s",
                            "&:hover": {
                              bgcolor:
                                mode === "light"
                                  ? "rgba(53, 99, 233, 0.08)"
                                  : "rgba(53, 99, 233, 0.15)",
                              transform: "translateX(5px)",
                            },
                          }}
                        >
                          <PaymentIcon
                            sx={{
                              mr: 1.5,
                              fontSize: 20,
                              color: "primary.main",
                            }}
                          />
                          <Typography fontWeight={500}>
                            Payment Methods
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/my-rides"
                          onClick={handleCloseUserMenu}
                          sx={{
                            py: 1.5,
                            px: 2.5,
                            borderRadius: 2,
                            mx: 0.5,
                            mb: 0.5,
                            transition: "all 0.2s",
                            "&:hover": {
                              bgcolor:
                                mode === "light"
                                  ? "rgba(53, 99, 233, 0.08)"
                                  : "rgba(53, 99, 233, 0.15)",
                              transform: "translateX(5px)",
                            },
                          }}
                        >
                          <HistoryIcon
                            sx={{
                              mr: 1.5,
                              fontSize: 20,
                              color: "primary.main",
                            }}
                          />
                          <Typography fontWeight={500}>Ride History</Typography>
                        </MenuItem>
                        <Divider sx={{ my: 1, mx: 1 }} />
                        <MenuItem
                          onClick={handleLogout}
                          sx={{
                            py: 1.5,
                            px: 2.5,
                            borderRadius: 2,
                            mx: 0.5,
                            mb: 0.5,
                            transition: "all 0.2s",
                            "&:hover": {
                              bgcolor: "rgba(255, 77, 79, 0.08)",
                              transform: "translateX(5px)",
                            },
                          }}
                        >
                          <LogoutIcon
                            sx={{ mr: 1.5, fontSize: 20, color: "error.main" }}
                          />
                          <Typography color="error.main" fontWeight={500}>
                            Logout
                          </Typography>
                        </MenuItem>
                      </Menu>
                    </Box>
                  ) : (
                    <Box sx={{ display: { xs: "none", md: "flex" } }}>
                      <Button
                        component={Link}
                        to="/login"
                        variant="outlined"
                        startIcon={<PersonOutlineIcon />}
                        sx={{
                          mr: 1.5,
                          borderColor: "primary.main",
                          color: "primary.main",
                          borderWidth: 2,
                          borderRadius: 12,
                          px: 3,
                          py: 1,
                          "&:hover": {
                            borderColor: "primary.dark",
                            bgcolor: "rgba(53, 99, 233, 0.04)",
                            transform: "translateY(-3px)",
                            boxShadow: "0 4px 12px rgba(53, 99, 233, 0.15)",
                          },
                          fontWeight: 600,
                          transition:
                            "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        component={Link}
                        to="/register"
                        variant="contained"
                        sx={{
                          background:
                            "linear-gradient(90deg, #FF6B00 0%, #FF9248 100%)",
                          color: "white",
                          borderRadius: 12,
                          px: 3,
                          py: 1,
                          boxShadow: "0 4px 14px rgba(255, 107, 0, 0.3)",
                          "&:hover": {
                            background:
                              "linear-gradient(90deg, #E05A00 0%, #FF6B00 100%)",
                            boxShadow: "0 6px 20px rgba(255, 107, 0, 0.4)",
                            transform: "translateY(-3px)",
                          },
                          fontWeight: 600,
                          transition:
                            "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        }}
                      >
                        Register
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Toolbar placeholder to prevent content from hiding behind the fixed AppBar */}
      <Toolbar sx={{ mb: 2 }} />

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
