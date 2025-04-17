import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  DirectionsCar,
  TwoWheeler,
  ElectricRickshaw,
} from "@mui/icons-material";
import LocationPicker from "../maps/LocationPicker";
import { loadGoogleMapsApi } from "../../utils/googleMapsLoader";

const RideBookingForm = ({ onSubmit, loading = false, error = null }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [rideType, setRideType] = useState("car");
  const [estimatedFare, setEstimatedFare] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [distance, setDistance] = useState(null);
  const [fareLoading, setFareLoading] = useState(false);
  const [fareError, setFareError] = useState(null);

  // Calculate estimated fare, time and distance when both pickup and destination are selected
  useEffect(() => {
    if (pickup && destination) {
      calculateEstimates();
    } else {
      setEstimatedFare(null);
      setEstimatedTime(null);
      setDistance(null);
    }
  }, [pickup, destination, rideType]);

  // Calculate estimates using Google Maps Distance Matrix API
  const calculateEstimates = async () => {
    if (
      !pickup ||
      !destination ||
      !pickup.coordinates ||
      !destination.coordinates
    ) {
      return;
    }

    setFareLoading(true);
    setFareError(null);

    try {
      // Load the Google Maps API if not already loaded
      if (
        !window.google ||
        !window.google.maps ||
        !window.google.maps.DistanceMatrixService
      ) {
        console.log("Loading Google Maps API for distance calculation");
        await loadGoogleMapsApi();
      }

      // Check if API loaded successfully
      if (
        !window.google ||
        !window.google.maps ||
        !window.google.maps.DistanceMatrixService
      ) {
        throw new Error("Failed to load Google Maps Distance Matrix API");
      }

      const service = new window.google.maps.DistanceMatrixService();

      const response = await new Promise((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [
              new window.google.maps.LatLng(
                pickup.coordinates.lat,
                pickup.coordinates.lng
              ),
            ],
            destinations: [
              new window.google.maps.LatLng(
                destination.coordinates.lat,
                destination.coordinates.lng
              ),
            ],
            travelMode: "DRIVING",
            unitSystem: window.google.maps.UnitSystem.METRIC,
          },
          (response, status) => {
            if (status === "OK") {
              resolve(response);
            } else {
              reject(new Error(`Distance Matrix request failed: ${status}`));
            }
          }
        );
      });

      if (response.rows[0].elements[0].status === "OK") {
        const distanceValue = response.rows[0].elements[0].distance.value; // in meters
        const durationValue = response.rows[0].elements[0].duration.value; // in seconds

        // Calculate fare based on ride type and distance
        let baseFare = 0;
        let ratePerKm = 0;

        switch (rideType) {
          case "bike":
            baseFare = 20;
            ratePerKm = 6;
            break;
          case "auto":
            baseFare = 30;
            ratePerKm = 8;
            break;
          case "car":
          default:
            baseFare = 50;
            ratePerKm = 12;
            break;
        }

        const distanceInKm = distanceValue / 1000;
        const fare = Math.round(baseFare + distanceInKm * ratePerKm);

        setDistance(response.rows[0].elements[0].distance.text);
        setEstimatedTime(response.rows[0].elements[0].duration.text);
        setEstimatedFare(fare);
      } else {
        setFareError("Could not calculate distance between locations");
      }
    } catch (error) {
      console.error("Error calculating estimates:", error);
      setFareError("Error calculating fare. Please try again.");
    } finally {
      setFareLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!pickup || !destination) {
      return;
    }

    if (onSubmit) {
      onSubmit({
        pickup,
        destination,
        rideType,
        estimatedFare,
        estimatedTime,
        distance,
      });
    }
  };

  const getRideTypeIcon = (type) => {
    switch (type) {
      case "bike":
        return <TwoWheeler />;
      case "auto":
        return <ElectricRickshaw />;
      case "car":
      default:
        return <DirectionsCar />;
    }
  };

  return (
    <Paper
      elevation={3}
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        borderRadius: 2,
        maxWidth: isMobile ? "100%" : 500,
        mx: "auto",
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
        Book Your Ride
      </Typography>

      <Box sx={{ mb: 3 }}>
        <LocationPicker
          label="Pickup Location"
          placeholder="Enter pickup location"
          onChange={setPickup}
          showMap={false}
          required
          error={!pickup && error === "Please select pickup location"}
          helperText={
            !pickup && error === "Please select pickup location"
              ? "Pickup location is required"
              : ""
          }
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <LocationPicker
          label="Destination"
          placeholder="Enter destination"
          onChange={setDestination}
          showMap={false}
          required
          error={!destination && error === "Please select destination"}
          helperText={
            !destination && error === "Please select destination"
              ? "Destination is required"
              : ""
          }
        />
      </Box>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="ride-type-label">Ride Type</InputLabel>
        <Select
          labelId="ride-type-label"
          value={rideType}
          label="Ride Type"
          onChange={(e) => setRideType(e.target.value)}
        >
          <MenuItem value="car">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <DirectionsCar sx={{ mr: 1 }} />
              Car
            </Box>
          </MenuItem>
          <MenuItem value="bike">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TwoWheeler sx={{ mr: 1 }} />
              Bike
            </Box>
          </MenuItem>
          <MenuItem value="auto">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ElectricRickshaw sx={{ mr: 1 }} />
              Auto
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      {fareError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {fareError}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {(estimatedFare || fareLoading) && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 1,
            border: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Ride Details
          </Typography>

          {fareLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2">Distance:</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {distance}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2">Estimated Time:</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {estimatedTime}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2">Estimated Fare:</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  ₹{estimatedFare}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={!pickup || !destination || loading || fareLoading}
        startIcon={getRideTypeIcon(rideType)}
        sx={{ py: 1.5 }}
      >
        {loading ? <CircularProgress size={24} /> : "Book Now"}
      </Button>
    </Paper>
  );
};

export default RideBookingForm;
