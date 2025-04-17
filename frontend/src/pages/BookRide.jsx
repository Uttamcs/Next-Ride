import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRide } from "../context/RideContext";
import { useCombinedAuth } from "../context/CombinedAuthContext";
import { useThemeMode } from "../context/ThemeContext";
import MapComponent from "../components/Map";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  Chip,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  useTheme,
  alpha,
} from "@mui/material";
import {
  MyLocation,
  LocationOn,
  DirectionsCar,
  AccessTime,
  AttachMoney,
  Search,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";

const BookRide = () => {
  const { isAuthenticated } = useCombinedAuth();
  const { requestRide, getEstimatedFare, loading } = useRide();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [rideOptions, setRideOptions] = useState([
    {
      id: "economy",
      name: "Economy",
      price: 0,
      time: "5-10 min",
      selected: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: 0,
      time: "3-8 min",
      selected: false,
    },
    {
      id: "luxury",
      name: "Luxury",
      price: 0,
      time: "8-15 min",
      selected: false,
    },
  ]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [fareEstimate, setFareEstimate] = useState(null);
  const [error, setError] = useState("");
  const [searchingLocation, setSearchingLocation] = useState(false);

  const steps = ["Set Location", "Choose Ride", "Confirm & Pay"];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/book-ride" } });
    } else {
      // Check if there's ride data passed from the home page
      const tempRideData = localStorage.getItem("tempRideData");
      if (tempRideData) {
        try {
          const { pickup, destination, rideType } = JSON.parse(tempRideData);
          setOriginAddress(pickup);
          setDestinationAddress(destination);

          // Clear the temp data after using it
          localStorage.removeItem("tempRideData");

          // Simulate a search for the addresses to get coordinates
          setTimeout(() => {
            handleAddressSearch("origin");
            setTimeout(() => {
              handleAddressSearch("destination");
            }, 500);
          }, 500);
        } catch (error) {
          console.error("Error parsing temp ride data:", error);
        }
      }
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (origin && destination) {
      estimateFare();
    }
  }, [origin, destination]);

  const estimateFare = async () => {
    try {
      const estimate = await getEstimatedFare(origin, destination);
      setFareEstimate(estimate);

      // Update ride options with estimated prices
      setRideOptions((prev) =>
        prev.map((option) => {
          let multiplier = 1;
          if (option.id === "premium") multiplier = 1.5;
          if (option.id === "luxury") multiplier = 2.5;

          return {
            ...option,
            price: Math.round(estimate.baseFare * multiplier),
          };
        })
      );
    } catch (error) {
      console.error("Error estimating fare:", error);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && (!origin || !destination)) {
      setError("Please set both pickup and destination locations");
      return;
    }

    if (activeStep === 1 && !rideOptions.some((option) => option.selected)) {
      setError("Please select a ride option");
      return;
    }

    setError("");
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleRideOptionSelect = (optionId) => {
    setRideOptions((prev) =>
      prev.map((option) => ({
        ...option,
        selected: option.id === optionId,
      }))
    );
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      const selectedOption = rideOptions.find((option) => option.selected);

      // Get the distance and duration from the fare estimate
      const distance = fareEstimate ? parseFloat(fareEstimate.distance) : 5;
      const duration = fareEstimate ? fareEstimate.duration : 15;

      const rideData = {
        origin: {
          address: originAddress,
          coordinates: origin,
        },
        destination: {
          address: destinationAddress,
          coordinates: destination,
        },
        rideType: selectedOption.id,
        paymentMethod,
        estimatedFare: selectedOption.price,
        distance,
        duration,
      };

      // Show loading state
      setLoading(true);

      // Request the ride
      const response = await requestRide(rideData);

      // Show success message
      toast.success("Ride booked successfully! Redirecting to your rides...");

      // Delay navigation slightly to allow the toast to be seen
      setTimeout(() => {
        navigate("/my-rides");
      }, 1500);
    } catch (error) {
      console.error("Error booking ride:", error);
      setError(error.message || "Failed to book ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    setSearchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setOrigin(currentLocation);
          setOriginAddress("Current Location");
          setSearchingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Could not get your current location. Please enter it manually."
          );
          setSearchingLocation(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setSearchingLocation(false);
    }
  };

  // Geocode address to coordinates (simplified - in a real app, use a geocoding service)
  const handleAddressSearch = (type) => {
    // This is a placeholder - in a real app, you would use a geocoding service like Google Maps or Mapbox
    const address = type === "origin" ? originAddress : destinationAddress;
    console.log(`Searching for ${type} address: ${address}`);

    // For demo purposes, set random coordinates near New York City
    const baseCoords = {
      latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
      longitude: -74.006 + (Math.random() - 0.5) * 0.1,
    };

    if (type === "origin") {
      setOrigin(baseCoords);
    } else {
      setDestination(baseCoords);
    }
  };

  const theme = useTheme();
  const { mode } = useThemeMode();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          background:
            mode === "dark"
              ? `linear-gradient(145deg, ${alpha(
                  theme.palette.background.paper,
                  0.9
                )}, ${alpha(theme.palette.background.default, 0.9)})`
              : `linear-gradient(145deg, ${alpha("#ffffff", 0.9)}, ${alpha(
                  "#f5f5f5",
                  0.9
                )})`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Book a Ride
          </Typography>
          <Stepper
            activeStep={activeStep}
            sx={{
              mt: 3,
              "& .MuiStepLabel-root .Mui-completed": {
                color: "success.main",
              },
              "& .MuiStepLabel-root .Mui-active": {
                color: "primary.main",
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box>
          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary.dark"
                    fontWeight="bold"
                  >
                    Set Your Pickup & Destination
                  </Typography>

                  <Card
                    variant="outlined"
                    sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Pickup Location
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Enter pickup address"
                          value={originAddress}
                          onChange={(e) => setOriginAddress(e.target.value)}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <MyLocation color="primary" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => handleAddressSearch("origin")}
                                  edge="end"
                                  size="small"
                                >
                                  <Search />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Button
                          variant="text"
                          startIcon={<MyLocation />}
                          onClick={handleUseCurrentLocation}
                          disabled={searchingLocation}
                          size="small"
                          sx={{ mt: 1 }}
                        >
                          {searchingLocation
                            ? "Getting location..."
                            : "Use current location"}
                        </Button>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Destination
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Where are you going?"
                          value={destinationAddress}
                          onChange={(e) =>
                            setDestinationAddress(e.target.value)
                          }
                          variant="outlined"
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationOn color="error" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    handleAddressSearch("destination")
                                  }
                                  edge="end"
                                  size="small"
                                >
                                  <Search />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {fareEstimate && (
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      borderColor: "primary.light",
                      boxShadow: `0 0 0 1px ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        px: 2,
                        py: 1,
                        borderBottom: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.1
                        )}`,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color="primary.dark"
                      >
                        Trip Details
                      </Typography>
                    </Box>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                mr: 1,
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                              }}
                            >
                              <DirectionsCarIcon
                                fontSize="small"
                                color="info"
                              />
                            </Box>
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Distance
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {fareEstimate.distance} km
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                mr: 1,
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: alpha(theme.palette.warning.main, 0.1),
                              }}
                            >
                              <AccessTime fontSize="small" color="warning" />
                            </Box>
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Duration
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {fareEstimate.duration} min
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}
              </Grid>

              <Grid item xs={12} md={7}>
                <Box
                  sx={{
                    height: 450,
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <MapComponent
                    origin={origin}
                    destination={destination}
                    onOriginChange={setOrigin}
                    onDestinationChange={setDestination}
                  />
                </Box>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                color="primary.dark"
                fontWeight="bold"
              >
                Choose Your Ride
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Select the type of ride that best suits your needs and budget
              </Typography>

              <Grid container spacing={3}>
                {rideOptions.map((option) => (
                  <Grid item xs={12} sm={4} key={option.id}>
                    <Paper
                      variant={option.selected ? "elevation" : "outlined"}
                      elevation={option.selected ? 3 : 0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        cursor: "pointer",
                        borderColor: option.selected
                          ? "primary.main"
                          : "divider",
                        borderWidth: option.selected ? 2 : 1,
                        transition: "all 0.2s",
                        bgcolor: option.selected
                          ? alpha(theme.palette.primary.main, 0.05)
                          : "background.paper",
                        transform: option.selected ? "scale(1.02)" : "scale(1)",
                        boxShadow: option.selected
                          ? `0 0 0 1px ${alpha(
                              theme.palette.primary.main,
                              0.5
                            )}`
                          : "none",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: alpha(theme.palette.primary.main, 0.02),
                        },
                      }}
                      onClick={() => handleRideOptionSelect(option.id)}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <DirectionsCar
                          sx={{
                            fontSize: 40,
                            mr: 1,
                            color: option.selected
                              ? "primary.main"
                              : "text.secondary",
                          }}
                        />
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {option.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {option.time} arrival
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AttachMoney fontSize="small" color="success" />
                          <Typography variant="h6" color="success.main">
                            ${option.price}
                          </Typography>
                        </Box>

                        <Radio
                          checked={option.selected}
                          onChange={() => handleRideOptionSelect(option.id)}
                          value={option.id}
                          name="ride-option"
                          color="primary"
                        />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary.dark"
                  fontWeight="bold"
                >
                  Payment Method
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Choose how you'd like to pay for your ride
                </Typography>

                <Card
                  variant="outlined"
                  sx={{ borderRadius: 2, overflow: "hidden" }}
                >
                  <CardContent>
                    <FormControl component="fieldset" fullWidth>
                      <RadioGroup
                        name="payment-method"
                        value={paymentMethod}
                        onChange={handlePaymentMethodChange}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Paper
                              variant={
                                paymentMethod === "cash"
                                  ? "elevation"
                                  : "outlined"
                              }
                              elevation={paymentMethod === "cash" ? 2 : 0}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                borderColor:
                                  paymentMethod === "cash"
                                    ? "primary.main"
                                    : "divider",
                                bgcolor:
                                  paymentMethod === "cash"
                                    ? alpha(theme.palette.primary.main, 0.05)
                                    : "background.paper",
                              }}
                            >
                              <FormControlLabel
                                value="cash"
                                control={<Radio />}
                                label={
                                  <Box sx={{ ml: 1 }}>
                                    <Typography
                                      variant="body1"
                                      fontWeight="medium"
                                    >
                                      Cash
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Pay with cash after ride
                                    </Typography>
                                  </Box>
                                }
                                sx={{ m: 0, width: "100%" }}
                              />
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Paper
                              variant={
                                paymentMethod === "card"
                                  ? "elevation"
                                  : "outlined"
                              }
                              elevation={paymentMethod === "card" ? 2 : 0}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                borderColor:
                                  paymentMethod === "card"
                                    ? "primary.main"
                                    : "divider",
                                bgcolor:
                                  paymentMethod === "card"
                                    ? alpha(theme.palette.primary.main, 0.05)
                                    : "background.paper",
                              }}
                            >
                              <FormControlLabel
                                value="card"
                                control={<Radio />}
                                label={
                                  <Box sx={{ ml: 1 }}>
                                    <Typography
                                      variant="body1"
                                      fontWeight="medium"
                                    >
                                      Credit/Debit Card
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Pay with saved card
                                    </Typography>
                                  </Box>
                                }
                                sx={{ m: 0, width: "100%" }}
                              />
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Paper
                              variant={
                                paymentMethod === "wallet"
                                  ? "elevation"
                                  : "outlined"
                              }
                              elevation={paymentMethod === "wallet" ? 2 : 0}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                borderColor:
                                  paymentMethod === "wallet"
                                    ? "primary.main"
                                    : "divider",
                                bgcolor:
                                  paymentMethod === "wallet"
                                    ? alpha(theme.palette.primary.main, 0.05)
                                    : "background.paper",
                              }}
                            >
                              <FormControlLabel
                                value="wallet"
                                control={<Radio />}
                                label={
                                  <Box sx={{ ml: 1 }}>
                                    <Typography
                                      variant="body1"
                                      fontWeight="medium"
                                    >
                                      Wallet
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Pay with wallet balance
                                    </Typography>
                                  </Box>
                                }
                                sx={{ m: 0, width: "100%" }}
                              />
                            </Paper>
                          </Grid>
                        </Grid>
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                color="primary.dark"
                fontWeight="bold"
              >
                Confirm Your Ride
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Please review your ride details before confirming
              </Typography>

              <Card
                variant="outlined"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  boxShadow: `0 0 0 1px ${alpha(
                    theme.palette.primary.main,
                    0.05
                  )}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <MyLocation sx={{ mr: 2, color: "primary.main" }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Pickup
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {originAddress}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <LocationOn sx={{ mr: 2, color: "error.main" }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Destination
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {destinationAddress}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DirectionsCar
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Ride Type
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {
                              rideOptions.find((option) => option.selected)
                                ?.name
                            }
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTime sx={{ mr: 1, color: "text.secondary" }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Estimated Time
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {fareEstimate?.duration || "--"} min
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AttachMoney sx={{ mr: 1, color: "text.secondary" }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Payment Method
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {paymentMethod}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: alpha(theme.palette.success.main, 0.2),
                  boxShadow: `0 0 0 1px ${alpha(
                    theme.palette.success.main,
                    0.05
                  )}`,
                }}
              >
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    px: 3,
                    py: 1.5,
                    borderBottom: `1px solid ${alpha(
                      theme.palette.success.main,
                      0.1
                    )}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="success.dark"
                  >
                    Fare Breakdown
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={8}>
                      <Typography variant="body1">Base Fare</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "right" }}>
                      <Typography variant="body1">
                        ${fareEstimate?.baseFare || 0}
                      </Typography>
                    </Grid>

                    <Grid item xs={8}>
                      <Typography variant="body1">Distance Charge</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "right" }}>
                      <Typography variant="body1">
                        ${fareEstimate?.distanceCharge || 0}
                      </Typography>
                    </Grid>

                    <Grid item xs={8}>
                      <Typography variant="body1">Time Charge</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "right" }}>
                      <Typography variant="body1">
                        ${fareEstimate?.timeCharge || 0}
                      </Typography>
                    </Grid>

                    {rideOptions.find((option) => option.selected)?.id !==
                      "economy" && (
                      <>
                        <Grid item xs={8}>
                          <Typography variant="body1">
                            {
                              rideOptions.find((option) => option.selected)
                                ?.name
                            }{" "}
                            Service
                          </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: "right" }}>
                          <Typography variant="body1">
                            $
                            {rideOptions.find((option) => option.selected)
                              ?.price - fareEstimate?.baseFare || 0}
                          </Typography>
                        </Grid>
                      </>
                    )}

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid item xs={8}>
                      <Typography variant="h6" fontWeight="bold">
                        Total Fare
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "right" }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="primary.main"
                      >
                        $
                        {rideOptions.find((option) => option.selected)?.price ||
                          0}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              pt: 3,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBack />}
              variant="outlined"
              sx={{ px: 3 }}
            >
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{
                  px: 4,
                  py: 1.2,
                  bgcolor: "success.main",
                  "&:hover": {
                    bgcolor: "success.dark",
                  },
                }}
              >
                Confirm Booking
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                sx={{ px: 3 }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookRide;
