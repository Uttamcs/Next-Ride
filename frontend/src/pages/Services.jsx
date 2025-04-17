import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  DirectionsCar,
  AirportShuttle,
  SupervisedUserCircle,
  Schedule,
  Flight,
  Check,
  ArrowForward,
  LocalTaxi,
  Security,
  Speed,
  Payment,
  SupportAgent,
} from "@mui/icons-material";
import ServicesService from "../services/services.service";

const Services = () => {
  const theme = useTheme();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await ServicesService.getAllServices();
        setServices(data.services);
        setError(null);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const iconMap = {
    DirectionsCar: <DirectionsCar fontSize="large" />,
    AirportShuttle: <AirportShuttle fontSize="large" />,
    SupervisedUserCircle: <SupervisedUserCircle fontSize="large" />,
    Schedule: <Schedule fontSize="large" />,
    Flight: <Flight fontSize="large" />,
    LocalTaxi: <LocalTaxi fontSize="large" />,
  };

  const getIconComponent = (iconName) =>
    iconMap[iconName] || <DirectionsCar fontSize="large" />;

  const benefits = [
    {
      icon: <Security fontSize="large" color="primary" />,
      title: "Safety First",
      description:
        "All our drivers undergo rigorous background checks and our vehicles are regularly inspected for safety.",
    },
    {
      icon: <Speed fontSize="large" color="primary" />,
      title: "Fast & Reliable",
      description:
        "With our large network of drivers, we ensure quick pickups and on-time arrivals.",
    },
    {
      icon: <Payment fontSize="large" color="primary" />,
      title: "Transparent Pricing",
      description:
        "No hidden fees or surge pricing. What you see is what you pay.",
    },
    {
      icon: <SupportAgent fontSize="large" color="primary" />,
      title: "24/7 Support",
      description:
        "Our customer support team is available around the clock to assist you.",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          color: "white",
          py: { xs: 8, md: 12 },
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #3563E9 0%, #1E3A8A 100%)",
            zIndex: -2,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
            backgroundSize: "24px 24px",
            zIndex: -1,
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              maxWidth: 800,
              position: "relative",
              zIndex: 1,
              "&::before": {
                content: '""',
                position: "absolute",
                top: -20,
                left: -30,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                boxShadow: "0 0 40px rgba(255, 255, 255, 0.1)",
                zIndex: -1,
              },
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              fontWeight="bold"
              sx={{
                mb: 2,
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "80px",
                  height: "4px",
                  background: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "2px",
                },
              }}
            >
              Our Services
            </Typography>
            <Typography
              variant="h5"
              sx={{ maxWidth: 800, mb: 4, opacity: 0.9, lineHeight: 1.5 }}
            >
              Discover the perfect ride for every occasion with our range of
              services designed to meet all your transportation needs.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  fontWeight: "bold",
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "white",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                Explore All Services
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to="/book-ride"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  fontWeight: "bold",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  color: "white",
                  "&:hover": {
                    borderColor: "white",
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Book a Ride
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Container
        maxWidth="lg"
        sx={{
          py: 8,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "5%",
            width: "90%",
            height: "100%",
            background:
              theme.palette.mode === "dark"
                ? "radial-gradient(ellipse at center, rgba(30, 58, 138, 0.15) 0%, transparent 70%)"
                : "radial-gradient(ellipse at center, rgba(53, 99, 233, 0.08) 0%, transparent 70%)",
            zIndex: -1,
            pointerEvents: "none",
          },
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper
            sx={{
              p: 3,
              textAlign: "center",
              bgcolor: "error.light",
              color: "error.dark",
            }}
          >
            <Typography variant="h6">{error}</Typography>
          </Paper>
        ) : services.length === 0 ? (
          <Typography variant="h6" align="center">
            No services available at the moment. Please check back later.
          </Typography>
        ) : (
          <>
            <Box sx={{ textAlign: "center", mb: 5, position: "relative" }}>
              <Typography
                variant="h4"
                component="h2"
                fontWeight="bold"
                sx={{
                  mb: 2,
                  textAlign: "center",
                  position: "relative",
                  display: "inline-block",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80px",
                    height: "4px",
                    background: "linear-gradient(90deg, #3563E9, #6B8EFC)",
                    borderRadius: "2px",
                  },
                }}
              >
                Choose Your Ride
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ maxWidth: "700px", mx: "auto", mt: 2, mb: 4 }}
              >
                Select from our range of premium services tailored to your
                needs. Each option offers unique benefits designed for your
                comfort and convenience.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 4,
                  mt: 4,
                }}
              >
                <Chip
                  label="All Services"
                  color="primary"
                  variant="filled"
                  sx={{
                    px: 2,
                    py: 2.5,
                    borderRadius: 2,
                    fontWeight: "bold",
                    background: "linear-gradient(90deg, #3563E9, #6B8EFC)",
                  }}
                />
                <Chip
                  label="Standard Rides"
                  variant="outlined"
                  color="primary"
                  sx={{ px: 2, py: 2.5, borderRadius: 2 }}
                />
                <Chip
                  label="Premium"
                  variant="outlined"
                  color="primary"
                  sx={{ px: 2, py: 2.5, borderRadius: 2 }}
                />
                <Chip
                  label="Group Travel"
                  variant="outlined"
                  color="primary"
                  sx={{ px: 2, py: 2.5, borderRadius: 2 }}
                />
                <Chip
                  label="Special Services"
                  variant="outlined"
                  color="primary"
                  sx={{ px: 2, py: 2.5, borderRadius: 2 }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                mt: 4,
                position: "relative",
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
                width: "100%",
              }}
            >
              {services.map((service) => (
                <Box
                  key={service.id}
                  sx={{
                    transition: "all 0.5s ease-out",
                    height: "100%",
                    display: "flex",
                  }}
                >
                  <Card
                    elevation={3}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      background:
                        theme.palette.mode === "dark"
                          ? theme.palette.background.card
                          : "linear-gradient(145deg, #ffffff, #f5f7fa)",
                      overflow: "hidden",
                      border: `1px solid ${theme.palette.divider}`,
                      position: "relative",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                        "&::before": {
                          opacity: 1,
                          transform: "translateY(0)",
                        },
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: "linear-gradient(90deg, #3563E9, #6B8EFC)",
                        opacity: 0.7,
                        transform: "translateY(-4px)",
                        transition: "opacity 0.3s, transform 0.3s",
                        zIndex: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        borderBottom: 1,
                        borderColor: "divider",
                        background:
                          theme.palette.mode === "dark"
                            ? "linear-gradient(120deg, rgba(30, 58, 138, 0.4) 0%, rgba(30, 41, 59, 0.2) 100%)"
                            : "linear-gradient(120deg, rgba(53, 99, 233, 0.08) 0%, rgba(245, 247, 250, 0.5) 100%)",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          height: "1px",
                          background:
                            "linear-gradient(90deg, transparent, rgba(53, 99, 233, 0.3), transparent)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          mr: 2,
                          background:
                            "linear-gradient(135deg, #3563E9 0%, #6B8EFC 100%)",
                          color: "white",
                          borderRadius: "50%",
                          width: 60,
                          height: 60,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 10px rgba(53, 99, 233, 0.3)",
                          border: "2px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        {getIconComponent(service.icon)}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="h5"
                            component="h3"
                            fontWeight="bold"
                            sx={{
                              background:
                                theme.palette.mode === "dark"
                                  ? "linear-gradient(90deg, #fff, #cbd5e1)"
                                  : "linear-gradient(90deg, #1a202c, #3563e9)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor:
                                theme.palette.mode === "dark"
                                  ? "unset"
                                  : "transparent",
                              mr: 1,
                            }}
                          >
                            {service.name}
                          </Typography>
                          <Box
                            sx={{
                              ml: "auto",
                              display: "flex",
                              alignItems: "center",
                              position: "absolute",
                              top: 0,
                              right: 0,
                            }}
                          >
                            <Chip
                              label={service.price}
                              color="primary"
                              size="small"
                              sx={{
                                fontWeight: "bold",
                                background:
                                  "linear-gradient(90deg, #3563E9, #6B8EFC)",
                                boxShadow: "0 2px 5px rgba(53, 99, 233, 0.3)",
                              }}
                            />
                          </Box>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {service.id === 1
                            ? "Most Popular"
                            : service.id === 2
                            ? "Premium Option"
                            : service.id === 3
                            ? "Best Value"
                            : ""}
                        </Typography>
                      </Box>
                    </Box>
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          background:
                            theme.palette.mode === "dark"
                              ? "radial-gradient(circle at top right, rgba(30, 58, 138, 0.1), transparent 70%)"
                              : "radial-gradient(circle at top right, rgba(53, 99, 233, 0.05), transparent 70%)",
                          pointerEvents: "none",
                        },
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.text.secondary,
                          mb: 2,
                          pb: 2,
                          borderBottom: `1px dashed ${theme.palette.divider}`,
                          fontWeight: 400,
                          lineHeight: 1.6,
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        {service.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1,
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            color: "primary.main",
                          }}
                        >
                          <ArrowForward sx={{ fontSize: 16, mr: 1 }} /> Features
                        </Typography>
                        <Chip
                          label={`${service.features.length} included`}
                          size="small"
                          variant="outlined"
                          color="primary"
                          sx={{ height: 24, fontSize: "0.75rem" }}
                        />
                      </Box>
                      <List
                        sx={{
                          mt: 2,
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.03)"
                              : "rgba(0, 0, 0, 0.02)",
                          borderRadius: 2,
                          p: 1,
                          position: "relative",
                          zIndex: 1,
                          backdropFilter: "blur(8px)",
                          border: `1px solid ${
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(0, 0, 0, 0.03)"
                          }`,
                          boxShadow: `inset 0 1px 1px ${
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.03)"
                              : "rgba(255, 255, 255, 0.7)"
                          }`,
                        }}
                      >
                        {service.features.map((feature, index) => (
                          <ListItem
                            key={index}
                            disableGutters
                            sx={{
                              py: 1,
                              px: 1.5,
                              borderRadius: 1.5,
                              mb: 0.5,
                              transition: "all 0.2s",
                              position: "relative",
                              overflow: "hidden",
                              "&:hover": {
                                bgcolor:
                                  theme.palette.mode === "dark"
                                    ? "rgba(255, 255, 255, 0.05)"
                                    : "rgba(0, 0, 0, 0.04)",
                                transform: "translateX(4px)",
                                "&::after": {
                                  transform: "translateX(0)",
                                },
                              },
                              borderBottom:
                                index !== service.features.length - 1
                                  ? `1px solid ${theme.palette.divider}`
                                  : "none",
                              "&::after": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: 0,
                                height: "100%",
                                width: "3px",
                                background:
                                  "linear-gradient(to bottom, #3563E9, #6B8EFC)",
                                transform: "translateX(-3px)",
                                transition: "transform 0.2s ease-in-out",
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(135deg, #3563E9 0%, #6B8EFC 100%)",
                                  boxShadow: "0 2px 4px rgba(53, 99, 233, 0.3)",
                                  border: "1px solid rgba(255, 255, 255, 0.2)",
                                  color: "white",
                                  transition: "transform 0.2s",
                                  "&:hover": {
                                    transform: "scale(1.1)",
                                  },
                                }}
                              >
                                <Check sx={{ fontSize: 16 }} />
                              </Box>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  sx={{
                                    fontWeight: 500,
                                    color: theme.palette.text.primary,
                                  }}
                                >
                                  {feature}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        component={Link}
                        to="/book-ride"
                        variant="contained"
                        color="primary"
                        fullWidth
                        endIcon={<ArrowForward />}
                        sx={{
                          py: 1.2,
                          borderRadius: 2,
                          fontWeight: "bold",
                          background:
                            "linear-gradient(90deg, #3563E9 0%, #6B8EFC 100%)",
                          boxShadow: "0 4px 10px rgba(53, 99, 233, 0.3)",
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: "0 6px 15px rgba(53, 99, 233, 0.4)",
                            transform: "translateY(-2px)",
                          },
                        }}
                        aria-label={`Book ${service.name} ride`}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Container>

      {/* Benefits Section */}
      <Box
        sx={{
          position: "relative",
          py: { xs: 8, md: 12 },
          mt: 6,
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)"
                : "linear-gradient(180deg, rgba(247, 249, 252, 0.95) 0%, rgba(237, 242, 247, 0.95) 100%)",
            zIndex: -2,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              theme.palette.mode === "dark"
                ? "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")"
                : "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
            backgroundSize: "30px 30px",
            zIndex: -1,
          },
          clipPath: "polygon(0 0, 100% 5%, 100% 100%, 0 95%)",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6, position: "relative" }}>
            <Typography
              variant="h4"
              component="h2"
              fontWeight="bold"
              sx={{
                mb: 2,
                textAlign: "center",
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "4px",
                  background: "linear-gradient(90deg, #3563E9, #6B8EFC)",
                  borderRadius: "2px",
                },
              }}
            >
              Why Choose Next Ride?
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ maxWidth: "700px", mx: "auto", mt: 2 }}
            >
              Experience the difference with our premium service, professional
              drivers, and commitment to your safety and satisfaction.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: { xs: 4, md: 5 },
              position: "relative",
              zIndex: 1,
              mt: 8,
              mb: 4,
              px: { xs: 2, md: 0 },
              maxWidth: "1200px",
              mx: "auto",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "80%",
                height: "80%",
                transform: "translate(-50%, -50%)",
                background:
                  theme.palette.mode === "dark"
                    ? "radial-gradient(circle, rgba(53, 99, 233, 0.1) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(53, 99, 233, 0.05) 0%, transparent 70%)",
                zIndex: -1,
                pointerEvents: "none",
              },
            }}
          >
            {benefits.map((benefit, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  textAlign: "center",
                  background:
                    theme.palette.mode === "dark"
                      ? "rgba(30, 41, 59, 0.4)"
                      : "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 4,
                  p: 4,
                  height: "100%",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: `1px solid ${
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.03)"
                  }`,
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "5px",
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    opacity: 0.7,
                  },
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    p: 2.5,
                    bgcolor:
                      theme.palette.mode === "dark" ? "grey.800" : "white",
                    borderRadius: "50%",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                    border: `1px solid ${theme.palette.divider}`,
                    position: "relative",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                      opacity: 0.2,
                      zIndex: -1,
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: -4,
                      left: -4,
                      right: -4,
                      bottom: -4,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, rgba(53, 99, 233, 0.2) 0%, rgba(107, 142, 252, 0.1) 100%)",
                      zIndex: -2,
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {benefit.icon}
                  </Box>
                </Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    mb: 2,
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "40px",
                      height: "2px",
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      borderRadius: "1px",
                    },
                  }}
                >
                  {benefit.title}
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    mt: 2,
                    width: "100%",
                    maxWidth: "250px",
                    mx: "auto",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      opacity: 0.9,
                      fontSize: "0.95rem",
                    }}
                  >
                    {benefit.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #3563E9 0%, #1E3A8A 100%)",
          color: "white",
          py: { xs: 8, md: 10 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          mt: 8,
          clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 150%, rgba(107, 142, 252, 0.4) 0%, transparent 50%)",
            zIndex: 0,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            right: "10%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
            transform: "translateY(-50%)",
            zIndex: 0,
          },
        }}
      >
        <Container
          maxWidth="md"
          sx={{ position: "relative", zIndex: 1, py: 4 }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              mb: 2,
              background: "linear-gradient(90deg, #ffffff, #e0e7ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            Ready to Experience Our Services?
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: "auto" }}
          >
            Download our app or book a ride online now and enjoy premium
            transportation services tailored to your needs
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              flexWrap: "wrap",
              mt: 5,
            }}
          >
            <Button
              component={Link}
              to="/book-ride"
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<DirectionsCar />}
              sx={{
                px: 4,
                py: 1.8,
                borderRadius: 2,
                fontWeight: "bold",
                fontSize: "1.1rem",
                background: "linear-gradient(90deg, #FF6B00 0%, #FF9248 100%)",
                boxShadow: "0 4px 15px rgba(255, 107, 0, 0.4)",
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(255, 107, 0, 0.6)",
                  transform: "translateY(-3px)",
                },
              }}
              aria-label="Book your ride now"
            >
              Book Your Ride
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<Schedule />}
              sx={{
                px: 4,
                py: 1.8,
                borderRadius: 2,
                fontWeight: "bold",
                fontSize: "1.1rem",
                borderColor: "rgba(255, 255, 255, 0.5)",
                borderWidth: 2,
                color: "white",
                transition: "all 0.3s",
                "&:hover": {
                  borderColor: "white",
                  background: "rgba(255, 255, 255, 0.1)",
                },
              }}
              aria-label="Learn more about our services"
            >
              View Pricing
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Services;
