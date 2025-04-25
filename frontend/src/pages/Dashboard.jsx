import React, { useEffect, useState, useRef } from "react";
import { useCombinedAuth } from "../context/CombinedAuthContext";
import { useRide } from "../context/RideContext";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
} from "@mui/material";
import {
  DirectionsCar,
  History,
  CreditCard,
  Star,
  LocationOn,
  MyLocation,
  AccessTime,
  ArrowForward,
  Refresh,
} from "@mui/icons-material";

const Dashboard = () => {
  const { currentUser: user, loading: authLoading } = useCombinedAuth();
  const { activeRide, fetchRideHistory, loading: rideLoading } = useRide();
  const [recentRides, setRecentRides] = useState([]);

  // Use a ref to store the fetchRideHistory function to prevent infinite re-renders
  const fetchRideHistoryRef = useRef(fetchRideHistory);

  // Use a flag to track if we've already loaded the data
  const [dataLoaded, setDataLoaded] = useState(false);

  // Pre-compute memoized components to avoid conditional hook calls
  const viewRideDetailsButton = React.useMemo(
    () =>
      activeRide && (
        <Button
          onClick={() => (window.location.href = `/rides/${activeRide._id}`)}
          variant="contained"
          endIcon={<ArrowForward />}
        >
          View Ride Details
        </Button>
      ),
    [activeRide?._id]
  );

  const bookRideButton = React.useMemo(
    () => (
      <Button
        onClick={() => (window.location.href = "/book-ride")}
        variant="contained"
        size="large"
        sx={{ px: 4 }}
      >
        Book a Ride
      </Button>
    ),
    []
  );

  const viewAllButton = React.useMemo(
    () => (
      <Button
        onClick={() => (window.location.href = "/my-rides")}
        endIcon={<ArrowForward />}
        size="small"
      >
        View All
      </Button>
    ),
    []
  );

  const recentRidesList = React.useMemo(() => {
    return recentRides.slice(0, 3).map((ride) => (
      <ListItem
        key={ride._id}
        alignItems="flex-start"
        sx={{
          mb: 1,
          p: 2,
          borderRadius: 1,
          bgcolor: "background.default",
          "&:hover": { bgcolor: "action.hover" },
          cursor: "pointer",
        }}
        onClick={() => (window.location.href = `/rides/${ride._id}`)}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <DirectionsCar />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1" fontWeight="medium">
                {ride.dropLocation?.address ||
                  ride.destination?.address ||
                  "Unknown destination"}
              </Typography>
              <Chip
                label={(ride.status || "pending").replace("_", " ")}
                size="small"
                color={getRideStatusColor(ride.status || "pending")}
                sx={{ textTransform: "capitalize" }}
              />
            </Box>
          }
          secondary={
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                component="span"
              >
                From:{" "}
                {ride.pickupLocation?.address ||
                  ride.origin?.address ||
                  "Unknown location"}
              </Typography>
              <Box sx={{ display: "flex", mt: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mr: 2,
                  }}
                >
                  <AccessTime fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(ride.requestedAt || ride.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CreditCard fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                  <Typography variant="body2" color="text.secondary">
                    ${ride.fare || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </>
          }
        />
      </ListItem>
    ));
  }, [recentRides]);

  const quickActionsList = React.useMemo(
    () => (
      <>
        <ListItem
          disablePadding
          sx={{ py: 1, cursor: "pointer" }}
          onClick={() => (window.location.href = "/book-ride")}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <DirectionsCar color="primary" />
          </ListItemIcon>
          <ListItemText primary="Book a Ride" />
        </ListItem>
        <ListItem
          disablePadding
          sx={{ py: 1, cursor: "pointer" }}
          onClick={() => (window.location.href = "/my-rides")}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <History color="primary" />
          </ListItemIcon>
          <ListItemText primary="View Ride History" />
        </ListItem>
        <ListItem
          disablePadding
          sx={{ py: 1, cursor: "pointer" }}
          onClick={() => (window.location.href = "/profile")}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <CreditCard color="primary" />
          </ListItemIcon>
          <ListItemText primary="Manage Profile" />
        </ListItem>
      </>
    ),
    []
  );

  const bookNowButton = React.useMemo(
    () => (
      <Button
        onClick={() => (window.location.href = "/book-ride")}
        variant="contained"
        fullWidth
      >
        Book Now
      </Button>
    ),
    []
  );

  useEffect(() => {
    // Update the ref when the function changes
    fetchRideHistoryRef.current = fetchRideHistory;
  }, [fetchRideHistory]);

  useEffect(() => {
    // Only load data once
    if (dataLoaded) return;

    const loadData = async () => {
      try {
        const data = await fetchRideHistoryRef.current();
        if (data && data.rides && Array.isArray(data.rides)) {
          // Store all rides for stats calculation
          setRecentRides(data.rides);
        } else {
          setRecentRides([]);
        }
        // Mark data as loaded
        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching ride history:", error);
        setRecentRides([]);
        // Even on error, mark as loaded to prevent infinite retries
        setDataLoaded(true);
      }
    };

    loadData();
  }, [dataLoaded]); // Only depend on dataLoaded flag

  const getRideStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "in_progress":
        return "primary";
      case "pending":
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

  if (authLoading) {
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Welcome back, {user?.fullname?.firstName || user?.name || "User"}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your rides and account from your personal dashboard.
        </Typography>
      </Box>

      {/* Active Ride Card */}
      {activeRide ? (
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Your Active Ride
            </Typography>
            <Chip
              label={(activeRide.status || "pending").replace("_", " ")}
              color={getRideStatusColor(activeRide.status || "pending")}
              sx={{ textTransform: "capitalize" }}
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <MyLocation sx={{ mr: 2, color: "primary.main" }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Pickup
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {activeRide.pickupLocation?.address ||
                        activeRide.origin?.address ||
                        "Unknown location"}
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
                      {activeRide.dropLocation?.address ||
                        activeRide.destination?.address ||
                        "Unknown destination"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Ride Type
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {activeRide.vehicleType ||
                      activeRide.rideType ||
                      "Standard"}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Estimated Fare
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    ${activeRide.fare || activeRide.estimatedFare || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Method
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {activeRide.paymentMethod || "Cash"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              {activeRide.captain && (
                <Box sx={{ textAlign: "center" }}>
                  <Avatar
                    src={activeRide.captain.profilePicture}
                    alt={
                      activeRide.captain.fullname ||
                      activeRide.captain.name ||
                      "Captain"
                    }
                    sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    {activeRide.captain.fullname ||
                      activeRide.captain.name ||
                      "Captain"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Your Captain
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                    }}
                  >
                    <Star sx={{ color: "warning.main", mr: 0.5 }} />
                    <Typography variant="body1">
                      {activeRide.captain.rating} (
                      {activeRide.captain.totalRides} rides)
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {activeRide.captain.vehicleType ||
                      activeRide.captain.carModel ||
                      "Car"}{" "}
                    •{" "}
                    {activeRide.captain.vehicleColor ||
                      activeRide.captain.carColor ||
                      "Unknown"}{" "}
                    •{" "}
                    {activeRide.captain.vehicleNumber ||
                      activeRide.captain.carPlate ||
                      "Unknown"}
                  </Typography>
                  <Button variant="outlined" fullWidth>
                    Contact Captain
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            {viewRideDetailsButton}
          </Box>
        </Paper>
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <DirectionsCar sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            No Active Rides
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 500 }}
          >
            You don't have any active rides at the moment. Book a new ride to
            get started!
          </Typography>
          {bookRideButton}
        </Paper>
      )}

      {/* Dashboard Widgets */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, height: "100%", borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Recent Rides
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  onClick={() => {
                    setDataLoaded(false); // Reset the dataLoaded flag to trigger a refresh
                  }}
                  size="small"
                  disabled={rideLoading}
                  startIcon={<Refresh />}
                >
                  Refresh
                </Button>
                {viewAllButton}
              </Box>
            </Box>

            {rideLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : recentRides.length > 0 ? (
              <List sx={{ width: "100%" }}>{recentRidesList}</List>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <History
                  sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                />
                <Typography variant="body1" color="text.secondary">
                  You haven't taken any rides yet.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Quick Actions
                  </Typography>
                  <List>
                    {/* Use memo to prevent re-renders */}
                    {quickActionsList}
                  </List>
                </CardContent>
                <CardActions>{bookNowButton}</CardActions>
              </Card>
            </Grid>

            <Grid item>
              <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Your Stats
                  </Typography>
                  <List>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText
                        primary="Total Rides"
                        secondary={recentRides.length || 0}
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText
                        primary="Completed Rides"
                        secondary={
                          recentRides.filter(
                            (ride) => ride.status === "completed"
                          ).length || 0
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText
                        primary="Cancelled Rides"
                        secondary={
                          recentRides.filter(
                            (ride) => ride.status === "cancelled"
                          ).length || 0
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText
                        primary="Average Rating"
                        secondary={
                          <Typography component="span" variant="body2">
                            <Box
                              component="span"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <Star
                                sx={{
                                  color: "warning.main",
                                  mr: 0.5,
                                  fontSize: 18,
                                }}
                              />
                              {"4.5"}
                            </Box>
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
