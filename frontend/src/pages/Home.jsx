import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  TextField,
  Paper,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import StarIcon from "@mui/icons-material/Star";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PaidIcon from "@mui/icons-material/Paid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

// No assets needed

const Home = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [rideType, setRideType] = useState("standard");

  const features = [
    {
      icon: <LocalTaxiIcon sx={{ fontSize: 50, color: "primary.main" }} />,
      title: "Quick Booking",
      description: "Book a ride in seconds and get picked up in minutes.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 50, color: "primary.main" }} />,
      title: "Safe Rides",
      description: "All our drivers are verified and trained for your safety.",
    },
    {
      icon: <PaidIcon sx={{ fontSize: 50, color: "primary.main" }} />,
      title: "Affordable Prices",
      description: "Enjoy competitive rates and transparent pricing.",
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 50, color: "primary.main" }} />,
      title: "24/7 Support",
      description: "Our customer support team is always ready to help you.",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Email submitted:", email);
    setEmail("");
  };

  const handleRideSubmit = (e) => {
    e.preventDefault();
    // Handle ride booking by redirecting to the BookRide page with the form data
    console.log("Ride booking submitted:", { pickup, destination, rideType });

    // Store the pickup and destination in localStorage to pass to the BookRide page
    if (pickup && destination) {
      localStorage.setItem(
        "tempRideData",
        JSON.stringify({
          pickup,
          destination,
          rideType,
        })
      );

      // Navigate to the BookRide page
      window.location.href = "/book-ride";
    } else {
      toast.error("Please enter both pickup and destination locations");
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          bgcolor:
            theme.palette.mode === "light"
              ? "primary.main"
              : "background.default",
          color: "white",
          pt: { xs: 10, md: 14 },
          pb: { xs: 10, md: 16 },
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "100%",
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.1) 10%, transparent 10.5%)",
            backgroundSize: "20px 20px",
            opacity: 0.5,
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative" }}>
                <Typography
                  variant="h2"
                  component="h1"
                  fontWeight="bold"
                  sx={{
                    mb: 2,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    position: "relative",
                    display: "inline-block",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -10,
                      left: 0,
                      width: "80px",
                      height: "4px",
                      background:
                        "linear-gradient(90deg, #FF6B00 0%, #FF9248 100%)",
                      borderRadius: "2px",
                    },
                  }}
                >
                  Your Ride, Your Way
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    maxWidth: "90%",
                    lineHeight: 1.5,
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                  }}
                >
                  Book a ride in seconds, get picked up in minutes. Experience
                  the next generation of ride booking.
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mb: { xs: 6, md: 0 } }}
                >
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: "secondary.main",
                      px: 5,
                      py: 1.8,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      boxShadow: "0 8px 20px rgba(255, 107, 0, 0.5)",
                      borderRadius: "30px",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                        transform: "translateX(-100%)",
                        transition: "transform 0.8s ease",
                      },
                      "&:hover": {
                        bgcolor: "secondary.dark",
                        boxShadow: "0 10px 25px rgba(255, 107, 0, 0.7)",
                        transform: "translateY(-5px) scale(1.03)",
                        "&::before": {
                          transform: "translateX(100%)",
                        },
                      },
                      transition:
                        "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    }}
                  >
                    Get Started Now
                  </Button>
                  <Button
                    component={Link}
                    to="/about"
                    variant="outlined"
                    size="large"
                    sx={{
                      color: "white",
                      borderColor: "white",
                      borderWidth: 2,
                      px: 4,
                      py: 1.4,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={8}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background:
                    theme.palette.mode === "light"
                      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 245, 255, 0.95) 100%)"
                      : "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)",
                  backdropFilter: "blur(20px)",
                  maxWidth: { xs: 450, md: 480 },
                  mx: { xs: "auto", md: "0 0 0 auto" },
                  position: "relative",
                  overflow: "hidden",
                  transform: { md: "translateX(-20px)" },
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  border:
                    theme.palette.mode === "light"
                      ? "1px solid rgba(255, 255, 255, 0.8)"
                      : "1px solid rgba(30, 41, 59, 0.5)",
                  "&:hover": {
                    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
                    transform: { md: "translateX(-20px) translateY(-10px)" },
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "5px",
                    background:
                      "linear-gradient(90deg, #3563E9 0%, #6366F1 100%)",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 5,
                    left: 0,
                    width: "100%",
                    height: "1px",
                    background:
                      "linear-gradient(90deg, rgba(255, 107, 0, 0.8) 0%, rgba(255, 146, 72, 0.8) 100%)",
                  },
                }}
              >
                <Typography
                  variant="h4"
                  component="h3"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    mb: 2,
                    background:
                      "linear-gradient(90deg, #3563E9 0%, #6366F1 100%)",
                    backgroundClip: "text",
                    color: "transparent",
                    textShadow: "0 2px 10px rgba(53, 99, 233, 0.2)",
                    fontSize: { xs: "1.75rem", md: "2rem" },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "80px",
                      height: "4px",
                      background:
                        "linear-gradient(90deg, #3563E9 0%, #6366F1 100%)",
                      borderRadius: "2px",
                    },
                  }}
                >
                  Book Your Ride Now
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mb: 4,
                    fontWeight: 500,
                    borderLeft: "3px solid",
                    borderColor: "secondary.main",
                    pl: 2,
                    py: 0.5,
                  }}
                >
                  Enter your pickup and destination locations to get started
                </Typography>

                <form onSubmit={handleRideSubmit}>
                  <Box sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          background:
                            "linear-gradient(135deg, rgba(53, 99, 233, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)",
                          p: 1.2,
                          borderRadius: "50%",
                          mr: 1.5,
                          display: "flex",
                          boxShadow: "0 4px 8px rgba(53, 99, 233, 0.15)",
                          border: "1px solid rgba(53, 99, 233, 0.2)",
                        }}
                      >
                        <MyLocationIcon
                          sx={{
                            color: "primary.main",
                            fontSize: 22,
                            filter:
                              "drop-shadow(0 2px 3px rgba(53, 99, 233, 0.3))",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        color="text.primary"
                        fontWeight="500"
                      >
                        Pickup Location
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter pickup address"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      required
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor:
                            theme.palette.mode === "light"
                              ? "rgba(245, 247, 250, 0.8)"
                              : "rgba(18, 24, 38, 0.8)",
                          border: "1px solid",
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(53, 99, 233, 0.1)"
                              : "rgba(53, 99, 233, 0.2)",
                          transition:
                            "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                          "&:hover": {
                            boxShadow: "0 0 0 2px rgba(53, 99, 233, 0.2)",
                            borderColor: "primary.main",
                            transform: "translateY(-2px)",
                          },
                          "&.Mui-focused": {
                            boxShadow: "0 4px 10px rgba(53, 99, 233, 0.15)",
                            borderColor: "primary.main",
                            borderWidth: "1px",
                          },
                        },
                      }}
                      slotProps={{
                        input: {
                          sx: { py: 1.5 },
                        },
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        my: 1.5,
                        position: "relative",
                        height: "50px",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: "50%",
                          height: "100%",
                          width: "2px",
                          background:
                            "linear-gradient(to bottom, rgba(53, 99, 233, 0.2), rgba(255, 107, 0, 0.2))",
                          zIndex: 0,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          background:
                            "linear-gradient(135deg, rgba(255, 107, 0, 0.15) 0%, rgba(255, 146, 72, 0.15) 100%)",
                          p: 1,
                          borderRadius: "50%",
                          display: "flex",
                          boxShadow: "0 4px 8px rgba(255, 107, 0, 0.15)",
                          border: "1px solid rgba(255, 107, 0, 0.2)",
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        <ArrowDownwardIcon
                          sx={{
                            color: "secondary.main",
                            fontSize: 20,
                            filter:
                              "drop-shadow(0 2px 3px rgba(255, 107, 0, 0.3))",
                          }}
                        />
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          background:
                            "linear-gradient(135deg, rgba(53, 99, 233, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)",
                          p: 1.2,
                          borderRadius: "50%",
                          mr: 1.5,
                          display: "flex",
                          boxShadow: "0 4px 8px rgba(53, 99, 233, 0.15)",
                          border: "1px solid rgba(53, 99, 233, 0.2)",
                        }}
                      >
                        <LocationSearchingIcon
                          sx={{
                            color: "primary.main",
                            fontSize: 22,
                            filter:
                              "drop-shadow(0 2px 3px rgba(53, 99, 233, 0.3))",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        color="text.primary"
                        fontWeight="500"
                      >
                        Destination
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter destination address"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor:
                            theme.palette.mode === "light"
                              ? "rgba(245, 247, 250, 0.8)"
                              : "rgba(18, 24, 38, 0.8)",
                          border: "1px solid",
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(53, 99, 233, 0.1)"
                              : "rgba(53, 99, 233, 0.2)",
                          transition:
                            "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                          "&:hover": {
                            boxShadow: "0 0 0 2px rgba(53, 99, 233, 0.2)",
                            borderColor: "primary.main",
                            transform: "translateY(-2px)",
                          },
                          "&.Mui-focused": {
                            boxShadow: "0 4px 10px rgba(53, 99, 233, 0.15)",
                            borderColor: "primary.main",
                            borderWidth: "1px",
                          },
                        },
                      }}
                      slotProps={{
                        input: {
                          sx: { py: 1.5 },
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="subtitle1"
                      color="text.primary"
                      fontWeight="500"
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          background:
                            "linear-gradient(135deg, rgba(53, 99, 233, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)",
                          p: 1.2,
                          borderRadius: "50%",
                          mr: 1.5,
                          display: "flex",
                          boxShadow: "0 4px 8px rgba(53, 99, 233, 0.15)",
                          border: "1px solid rgba(53, 99, 233, 0.2)",
                        }}
                      >
                        <AccessTimeIcon
                          sx={{
                            color: "primary.main",
                            fontSize: 22,
                            filter:
                              "drop-shadow(0 2px 3px rgba(53, 99, 233, 0.3))",
                          }}
                        />
                      </Box>
                      When do you need the ride?
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant={
                            rideType === "standard" ? "contained" : "outlined"
                          }
                          onClick={() => setRideType("standard")}
                          sx={{
                            borderRadius: 2,
                            py: 1.5,
                            fontWeight: "bold",
                            boxShadow:
                              rideType === "standard"
                                ? "0 4px 10px rgba(53, 99, 233, 0.3)"
                                : "none",
                            "&:hover": {
                              boxShadow: "0 6px 15px rgba(53, 99, 233, 0.4)",
                            },
                          }}
                        >
                          Now
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant={
                            rideType === "scheduled" ? "contained" : "outlined"
                          }
                          onClick={() => setRideType("scheduled")}
                          sx={{
                            borderRadius: 2,
                            py: 1.5,
                            fontWeight: "bold",
                            boxShadow:
                              rideType === "scheduled"
                                ? "0 4px 10px rgba(53, 99, 233, 0.3)"
                                : "none",
                            "&:hover": {
                              boxShadow: "0 6px 15px rgba(53, 99, 233, 0.4)",
                            },
                          }}
                        >
                          Schedule
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={
                      <Box
                        sx={{
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <DirectionsCarIcon sx={{ fontSize: 18 }} />
                      </Box>
                    }
                    sx={{
                      py: 2.5,
                      mt: 2,
                      borderRadius: 3,
                      background:
                        "linear-gradient(90deg, #3563E9 0%, #6366F1 100%)",
                      boxShadow: "0 10px 20px rgba(53, 99, 233, 0.4)",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      position: "relative",
                      overflow: "hidden",
                      textTransform: "none",
                      letterSpacing: "0.5px",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                        transform: "translateX(-100%)",
                        transition: "transform 0.8s ease",
                      },
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #2D50C7 0%, #5457D6 100%)",
                        boxShadow: "0 15px 30px rgba(53, 99, 233, 0.6)",
                        transform: "translateY(-5px) scale(1.02)",
                        "&::before": {
                          transform: "translateX(100%)",
                        },
                      },
                      transition:
                        "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    }}
                  >
                    Find My Ride Now
                  </Button>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background:
            theme.palette.mode === "light"
              ? "linear-gradient(180deg, rgba(245,247,250,1) 0%, rgba(255,255,255,1) 100%)"
              : "linear-gradient(180deg, rgba(25,32,45,1) 0%, rgba(18,24,38,1) 100%)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(circle, rgba(99,102,241,0.08) 10%, transparent 10.5%)",
            backgroundSize: "25px 25px",
            opacity: 0.5,
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              fontWeight="bold"
              sx={{
                mb: 2,
                background: "linear-gradient(90deg, #3563E9 0%, #6366F1 100%)",
                backgroundClip: "text",
                color: "transparent",
                display: "inline-block",
              }}
            >
              Why Choose Next Ride?
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto" }}
            >
              Experience the best ride booking service with features designed
              for your comfort and convenience.
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={4}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 4,
                    textAlign: "center",
                    borderRadius: 4,
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "5px",
                      background:
                        "linear-gradient(90deg, #3563E9 0%, #6366F1 100%)",
                    },
                    "&:hover": {
                      transform: "translateY(-12px)",
                      boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      borderRadius: "50%",
                      background: "rgba(99,102,241,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                      height: 80,
                    }}
                  >
                    {React.cloneElement(feature.icon, {
                      sx: { fontSize: 40, color: "primary.main" },
                    })}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              endIcon={
                <Box
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ml: 0.5,
                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <ArrowForwardIcon sx={{ fontSize: 18 }} />
                </Box>
              }
              sx={{
                px: 5,
                py: 2,
                borderRadius: "50px",
                background: "linear-gradient(90deg, #3563E9 0%, #6366F1 100%)",
                boxShadow: "0 10px 25px rgba(99,102,241,0.4)",
                fontSize: "1.2rem",
                fontWeight: "bold",
                position: "relative",
                overflow: "hidden",
                textTransform: "none",
                letterSpacing: "0.5px",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                  transform: "translateX(-100%)",
                  transition: "transform 0.8s ease",
                },
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #2D50C7 0%, #5457D6 100%)",
                  boxShadow: "0 15px 35px rgba(99,102,241,0.6)",
                  transform: "translateY(-7px) scale(1.05)",
                  "&::before": {
                    transform: "translateX(100%)",
                  },
                },
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              Start Your Journey Today
            </Button>
          </Box>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box
        sx={{
          bgcolor:
            theme.palette.mode === "light" ? "primary.main" : "dark.main",
          color: "white",
          py: { xs: 6, md: 10 },
          textShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            How It Works
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 8, maxWidth: 700, mx: "auto", opacity: 0.9 }}
          >
            Getting a ride with Next Ride is easy as 1-2-3-4
          </Typography>

          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            {/* Step 1 */}
            <Grid item xs={12} sm={6} md={2.5}>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    width: 80,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    mb: 2,
                    bgcolor: "secondary.main",
                    color: "white",
                    position: "relative",
                    zIndex: 2,
                    "&::before": {
                      content: '"1"',
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      bgcolor: "white",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      boxShadow: 2,
                    },
                  }}
                >
                  <PhoneIphoneIcon sx={{ fontSize: 40 }} />
                </Paper>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Download the App
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.9)" }}
                >
                  Get our mobile app from the App Store or Google Play
                </Typography>
              </Box>
            </Grid>

            {/* Arrow 1 */}
            <Grid
              item
              xs={12}
              sm={6}
              md={1}
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
              }}
            >
              <ArrowForwardIcon
                sx={{ fontSize: 40, color: "white", opacity: 0.7 }}
              />
            </Grid>

            {/* Step 2 */}
            <Grid item xs={12} sm={6} md={2.5}>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    width: 80,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    mb: 2,
                    bgcolor: "secondary.main",
                    color: "white",
                    position: "relative",
                    zIndex: 2,
                    "&::before": {
                      content: '"2"',
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      bgcolor: "white",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      boxShadow: 2,
                    },
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 40 }} />
                </Paper>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Set Your Location
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.9)" }}
                >
                  Enter your pickup and destination locations
                </Typography>
              </Box>
            </Grid>

            {/* Arrow 2 */}
            <Grid
              item
              xs={12}
              sm={6}
              md={1}
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
              }}
            >
              <ArrowForwardIcon
                sx={{ fontSize: 40, color: "white", opacity: 0.7 }}
              />
            </Grid>

            {/* Step 3 */}
            <Grid item xs={12} sm={6} md={2.5}>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    width: 80,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    mb: 2,
                    bgcolor: "secondary.main",
                    color: "white",
                    position: "relative",
                    zIndex: 2,
                    "&::before": {
                      content: '"3"',
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      bgcolor: "white",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      boxShadow: 2,
                    },
                  }}
                >
                  <DirectionsCarIcon sx={{ fontSize: 40 }} />
                </Paper>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Get Picked Up
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.9)" }}
                >
                  A nearby driver will arrive at your location
                </Typography>
              </Box>
            </Grid>

            {/* Arrow 3 */}
            <Grid
              item
              xs={12}
              sm={6}
              md={1}
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
              }}
            >
              <ArrowForwardIcon
                sx={{ fontSize: 40, color: "white", opacity: 0.7 }}
              />
            </Grid>

            {/* Step 4 */}
            <Grid item xs={12} sm={6} md={2.5}>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    width: 80,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    mb: 2,
                    bgcolor: "secondary.main",
                    color: "white",
                    position: "relative",
                    zIndex: 2,
                    "&::before": {
                      content: '"4"',
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      bgcolor: "white",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      boxShadow: 2,
                    },
                  }}
                >
                  <EmojiEmotionsIcon sx={{ fontSize: 40 }} />
                </Paper>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Enjoy Your Ride
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.9)" }}
                >
                  Sit back and relax as you reach your destination
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Button
              component={Link}
              to="/book-ride"
              variant="contained"
              size="large"
              startIcon={
                <Box
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "50%",
                    width: 38,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1.5,
                    boxShadow: "0 4px 12px rgba(255, 107, 0, 0.4)",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <DirectionsCarIcon sx={{ fontSize: 20, color: "white" }} />
                </Box>
              }
              sx={{
                px: 5,
                py: 2.2,
                background: "linear-gradient(90deg, #FF6B00 0%, #FF9248 100%)",
                color: "white",
                borderRadius: "50px",
                fontWeight: "bold",
                fontSize: "1.25rem",
                boxShadow: "0 15px 30px rgba(255, 107, 0, 0.4)",
                position: "relative",
                overflow: "hidden",
                border: "none",
                textTransform: "none",
                letterSpacing: "0.5px",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                  transform: "translateX(-100%)",
                  transition: "transform 0.8s ease",
                },
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #E05A00 0%, #FF6B00 100%)",
                  boxShadow: "0 20px 40px rgba(255, 107, 0, 0.5)",
                  transform: "translateY(-8px) scale(1.05)",
                  "&::before": {
                    transform: "translateX(100%)",
                  },
                },
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              Book a Ride Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          What Our Customers Say
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 700, mx: "auto" }}
        >
          Don't just take our word for it - hear what our customers have to say
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              name: "Sarah Johnson",
              comment:
                "Next Ride has been my go-to for daily commutes. The drivers are professional and the app is super easy to use!",
              rating: 5,
            },
            {
              name: "Michael Chen",
              comment:
                "I love how quickly I can get a ride with Next Ride. The fare estimates are accurate and the service is reliable.",
              rating: 5,
            },
            {
              name: "Emily Rodriguez",
              comment:
                "As someone who travels a lot for work, Next Ride has made my life so much easier. Clean cars and friendly drivers every time.",
              rating: 4,
            },
          ].map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  p: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        sx={{
                          color:
                            i < testimonial.rating
                              ? "warning.main"
                              : "grey.300",
                          mr: 0.5,
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    "{testimonial.comment}"
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {testimonial.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor:
            theme.palette.mode === "light" ? "primary.main" : "dark.main",
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.1) 10%, transparent 10.5%)",
            backgroundSize: "20px 20px",
            opacity: 0.5,
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
          <Paper
            elevation={10}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: "center",
              borderRadius: 4,
              background:
                theme.palette.mode === "light"
                  ? "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 245, 255, 0.9) 100%)"
                  : "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
              border:
                theme.palette.mode === "light"
                  ? "1px solid rgba(255, 255, 255, 0.8)"
                  : "1px solid rgba(30, 41, 59, 0.5)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "5px",
                background: "linear-gradient(90deg, #FF6B00 0%, #FF9248 100%)",
              },
            }}
          >
            <Typography
              variant="h2"
              component="h2"
              fontWeight="bold"
              sx={{
                mb: 3,
                background: "linear-gradient(90deg, #3563E9 0%, #6366F1 100%)",
                backgroundClip: "text",
                color: "transparent",
                textShadow: "0 2px 10px rgba(53, 99, 233, 0.2)",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Ready to Get Started?
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 5,
                maxWidth: 700,
                mx: "auto",
                color:
                  theme.palette.mode === "light"
                    ? "text.secondary"
                    : "text.primary",
                fontWeight: 500,
              }}
            >
              Join thousands of satisfied customers who use Next Ride every day
              for their transportation needs.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              justifyContent="center"
              sx={{ mb: 2 }}
            >
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                startIcon={
                  <Box
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "50%",
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PersonAddIcon sx={{ fontSize: 20 }} />
                  </Box>
                }
                sx={{
                  bgcolor: "secondary.main",
                  px: 5,
                  py: 2,
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  borderRadius: "50px",
                  boxShadow: "0 15px 30px rgba(255, 107, 0, 0.4)",
                  textTransform: "none",
                  letterSpacing: "0.5px",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                    transform: "translateX(-100%)",
                    transition: "transform 0.8s ease",
                  },
                  "&:hover": {
                    bgcolor: "secondary.dark",
                    boxShadow: "0 20px 40px rgba(255, 107, 0, 0.6)",
                    transform: "translateY(-7px) scale(1.05)",
                    "&::before": {
                      transform: "translateX(100%)",
                    },
                  },
                  transition:
                    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
              >
                Sign Up Now
              </Button>
              <Button
                component={Link}
                to="/book-ride"
                variant="outlined"
                size="large"
                startIcon={<DirectionsCarIcon sx={{ fontSize: 24 }} />}
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  borderRadius: "50px",
                  borderWidth: 2,
                  borderColor: "primary.main",
                  color:
                    theme.palette.mode === "light" ? "primary.main" : "white",
                  textTransform: "none",
                  letterSpacing: "0.5px",
                  "&:hover": {
                    borderWidth: 2,
                    borderColor: "primary.main",
                    bgcolor: "rgba(53, 99, 233, 0.1)",
                    transform: "translateY(-7px) scale(1.05)",
                  },
                  transition:
                    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
              >
                Book a Ride
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Stay Updated
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
          >
            Subscribe to our newsletter to receive updates, news, and special
            offers.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              maxWidth: 500,
              mx: "auto",
            }}
          >
            <TextField
              fullWidth
              label="Your Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 3,
                height: { sm: 56 },
                whiteSpace: "nowrap",
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
