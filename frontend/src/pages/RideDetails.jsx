import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRide } from "../context/RideContext";
import MapComponent from "../components/Map";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  Chip,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  IconButton,
} from "@mui/material";
import {
  DirectionsCar,
  MyLocation,
  LocationOn,
  AccessTime,
  CreditCard,
  Star,
  Phone,
  Message,
  Cancel,
  ArrowBack,
  Receipt,
} from "@mui/icons-material";
import RideService from "../services/ride.service";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cancelRide, rateRide, loading: rideContextLoading } = useRide();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [ratingSuccess, setRatingSuccess] = useState("");

  useEffect(() => {
    fetchRideDetails();
  }, [id]);

  const fetchRideDetails = async () => {
    try {
      setLoading(true);
      // In a real app, you would have a service method to get a specific ride
      // For now, we'll simulate it
      const response = await RideService.getRideHistory();
      const foundRide = response.rides.find((r) => r._id === id);

      if (foundRide) {
        // Adapt the ride data to match the component's expectations
        const adaptedRide = {
          ...foundRide,
          origin: foundRide.pickupLocation ||
            foundRide.origin || {
              address: "Unknown location",
              coordinates: { latitude: 0, longitude: 0 },
            },
          destination: foundRide.dropLocation ||
            foundRide.destination || {
              address: "Unknown destination",
              coordinates: { latitude: 0, longitude: 0 },
            },
          captain: foundRide.captain
            ? {
                ...foundRide.captain,
                name: foundRide.captain.fullname || "Unknown Driver",
                carModel: foundRide.captain.vehicleType || "Car",
                carColor: foundRide.captain.vehicleColor || "Unknown",
                carPlate: foundRide.captain.vehicleNumber || "Unknown",
                rating: foundRide.captain.rating || 4.5,
                totalRides: 100, // Default value
              }
            : null,
          createdAt:
            foundRide.requestedAt ||
            foundRide.createdAt ||
            new Date().toISOString(),
        };

        setRide(adaptedRide);
      } else {
        setError("Ride not found");
      }
    } catch (error) {
      setError("Failed to fetch ride details");
      console.error("Error fetching ride details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRatingDialog = () => {
    setRatingDialogOpen(true);
    setRatingError("");
    setRatingSuccess("");
  };

  const handleCloseRatingDialog = () => {
    setRatingDialogOpen(false);
  };

  const handleOpenCancelDialog = () => {
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitRating = async () => {
    if (rating < 1) {
      setRatingError("Please select a rating");
      return;
    }

    try {
      await rateRide(ride._id, rating, comment);
      setRatingSuccess("Thank you for your feedback!");

      // Update the ride object with the new rating
      setRide({
        ...ride,
        rating: {
          value: rating,
          comment,
        },
        status: "completed",
      });

      setTimeout(() => {
        handleCloseRatingDialog();
      }, 2000);
    } catch (error) {
      setRatingError(error.message || "Failed to submit rating");
    }
  };

  const handleCancelRide = async () => {
    try {
      await cancelRide(ride._id);

      // Update the ride object with cancelled status
      setRide({
        ...ride,
        status: "cancelled",
      });

      handleCloseCancelDialog();
    } catch (error) {
      setError(error.message || "Failed to cancel ride");
      handleCloseCancelDialog();
    }
  };

  const getRideStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "in_progress":
      case "in-progress":
        return "primary";
      case "pending":
      case "requested":
      case "accepted":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActiveStep = (status) => {
    switch (status) {
      case "pending":
      case "requested":
        return 0;
      case "accepted":
        return 1;
      case "in_progress":
      case "in-progress":
        return 2;
      case "completed":
        return 3;
      case "cancelled":
        return -1;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !ride) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Ride not found"}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/my-rides")}>
          Back to My Rides
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => navigate("/my-rides")} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Ride Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {formatDate(ride.createdAt)}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Ride Information
              </Typography>
              <Chip
                label={ride.status.replace("_", " ").replace("-", " ")}
                color={getRideStatusColor(ride.status)}
                sx={{ textTransform: "capitalize" }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <MyLocation sx={{ mr: 2, color: "primary.main" }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pickup
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {ride.origin.address}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <LocationOn sx={{ mr: 2, color: "error.main" }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Destination
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {ride.destination.address}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Ride Type
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ textTransform: "capitalize" }}
                >
                  {ride.rideType}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Distance
                </Typography>
                <Typography variant="body1">
                  {ride.distance ? `${ride.distance} km` : "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body1">
                  {ride.duration ? `${ride.duration} min` : "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Fare
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  ${ride.fare || ride.estimatedFare}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="h6" gutterBottom>
                Ride Progress
              </Typography>

              {ride.status === "cancelled" ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  This ride was cancelled{" "}
                  {ride.cancelledBy ? `by ${ride.cancelledBy}` : ""}.
                  {ride.cancellationReason && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Reason: {ride.cancellationReason}
                    </Typography>
                  )}
                </Alert>
              ) : (
                <Stepper
                  activeStep={getActiveStep(ride.status)}
                  orientation="vertical"
                >
                  <Step>
                    <StepLabel>Ride Requested</StepLabel>
                    <StepContent>
                      <Typography variant="body2">
                        You requested a ride on {formatDate(ride.createdAt)}.
                      </Typography>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Driver Assigned</StepLabel>
                    <StepContent>
                      <Typography variant="body2">
                        {ride.status === "accepted" ||
                        ride.status === "in_progress" ||
                        ride.status === "completed"
                          ? `${ride.captain?.name} accepted your ride request.`
                          : "Waiting for a driver to accept your ride request."}
                      </Typography>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Ride in Progress</StepLabel>
                    <StepContent>
                      <Typography variant="body2">
                        {ride.status === "in_progress" ||
                        ride.status === "in-progress" ||
                        ride.status === "completed"
                          ? "Your ride is in progress."
                          : "Your driver will pick you up soon."}
                      </Typography>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Ride Completed</StepLabel>
                    <StepContent>
                      <Typography variant="body2">
                        {ride.status === "completed"
                          ? "You have reached your destination."
                          : "Your ride will be completed once you reach your destination."}
                      </Typography>
                    </StepContent>
                  </Step>
                </Stepper>
              )}
            </Box>

            {(ride.status === "pending" ||
              ride.status === "requested" ||
              ride.status === "accepted") && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={handleOpenCancelDialog}
                  disabled={rideContextLoading}
                >
                  Cancel Ride
                </Button>
              </Box>
            )}

            {ride.status === "completed" && !ride.rating && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Star />}
                  onClick={handleOpenRatingDialog}
                  disabled={rideContextLoading}
                >
                  Rate this Ride
                </Button>
              </Box>
            )}
          </Paper>

          <Paper
            elevation={3}
            sx={{ borderRadius: 2, overflow: "hidden", height: 300 }}
          >
            <MapComponent
              origin={ride.origin.coordinates}
              destination={ride.destination.coordinates}
              captainLocation={ride.captainLocation}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {ride.captain ? (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Driver Information
              </Typography>

              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Avatar
                  src={ride.captain.profilePicture}
                  alt={ride.captain.name}
                  sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}
                />
                <Typography variant="h6">{ride.captain.name}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Star sx={{ color: "warning.main", mr: 0.5, fontSize: 18 }} />
                  <Typography variant="body2">
                    {ride.captain.rating} ({ride.captain.totalRides} rides)
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Vehicle Details
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Model:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {ride.captain.carModel}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Color:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {ride.captain.carColor}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Plate:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {ride.captain.carPlate}
                  </Typography>
                </Grid>
              </Grid>

              {(ride.status === "accepted" ||
                ride.status === "in_progress" ||
                ride.status === "in-progress") && (
                <>
                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="outlined" startIcon={<Phone />} fullWidth>
                      Call
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Message />}
                      fullWidth
                    >
                      Message
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          ) : (
            (ride.status === "pending" || ride.status === "requested") && (
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Finding a Driver
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 2,
                  }}
                >
                  <CircularProgress sx={{ mb: 2 }} />
                  <Typography variant="body1" align="center">
                    We're looking for a driver near you. This usually takes 1-3
                    minutes.
                  </Typography>
                </Box>
              </Paper>
            )
          )}

          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Payment Details
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CreditCard sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                {ride.paymentMethod}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Fare Breakdown
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={8}>
                <Typography variant="body2">Base Fare</Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                <Typography variant="body2">
                  $
                  {ride.baseFare ||
                    (ride.fare
                      ? (ride.fare * 0.7).toFixed(2)
                      : (ride.estimatedFare * 0.7).toFixed(2))}
                </Typography>
              </Grid>

              <Grid item xs={8}>
                <Typography variant="body2">Distance Charge</Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                <Typography variant="body2">
                  $
                  {ride.distanceCharge ||
                    (ride.fare
                      ? (ride.fare * 0.2).toFixed(2)
                      : (ride.estimatedFare * 0.2).toFixed(2))}
                </Typography>
              </Grid>

              <Grid item xs={8}>
                <Typography variant="body2">Time Charge</Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                <Typography variant="body2">
                  $
                  {ride.timeCharge ||
                    (ride.fare
                      ? (ride.fare * 0.1).toFixed(2)
                      : (ride.estimatedFare * 0.1).toFixed(2))}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={8}>
                <Typography variant="body1" fontWeight="bold">
                  Total Fare
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="primary.main"
                >
                  ${ride.fare || ride.estimatedFare}
                </Typography>
              </Grid>
            </Grid>

            {ride.status === "completed" && (
              <Button
                variant="outlined"
                startIcon={<Receipt />}
                fullWidth
                sx={{ mt: 2 }}
              >
                Download Receipt
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Rating Dialog */}
      <Dialog
        open={ratingDialogOpen}
        onClose={handleCloseRatingDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rate Your Ride</DialogTitle>
        <DialogContent>
          {ratingError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {ratingError}
            </Alert>
          )}

          {ratingSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {ratingSuccess}
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              my: 2,
            }}
          >
            <Typography variant="body1" gutterBottom>
              How was your ride with {ride.captain?.name || "your driver"}?
            </Typography>
            <Rating
              name="ride-rating"
              value={rating}
              onChange={handleRatingChange}
              size="large"
              sx={{ fontSize: "3rem", my: 2 }}
            />
            <TextField
              label="Additional Comments (Optional)"
              multiline
              rows={4}
              value={comment}
              onChange={handleCommentChange}
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRatingDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitRating}
            disabled={rideContextLoading || !!ratingSuccess}
          >
            {rideContextLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Submit Rating"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Ride Dialog */}
      <Dialog open={cancelDialogOpen} onClose={handleCloseCancelDialog}>
        <DialogTitle>Cancel Ride</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this ride? Cancellation fees may
            apply.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>No, Keep Ride</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelRide}
            disabled={rideContextLoading}
          >
            {rideContextLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Yes, Cancel Ride"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RideDetails;
