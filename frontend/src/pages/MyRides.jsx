import React, { useEffect, useState, useRef } from "react";
import { useRide } from "../context/RideContext";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Button,
  TextField,
  IconButton,
  InputBase,
} from "@mui/material";
import {
  DirectionsCar,
  Search,
  FilterList,
  AccessTime,
  CreditCard,
  LocationOn,
  MyLocation,
  Clear,
  Refresh,
} from "@mui/icons-material";

const MyRides = () => {
  const { rideHistory, fetchRideHistory, loading } = useRide();
  const [tabValue, setTabValue] = useState(0);
  const [filteredRides, setFilteredRides] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchRideHistoryRef = useRef(fetchRideHistory);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    fetchRideHistoryRef.current = fetchRideHistory;
  }, [fetchRideHistory]);

  useEffect(() => {
    if (dataLoaded) return;

    const loadRides = async () => {
      try {
        await fetchRideHistoryRef.current();
        setDataLoaded(true);
      } catch (error) {
        console.error("Error loading rides:", error);
        setDataLoaded(true);
      }
    };

    loadRides();
  }, [dataLoaded]);

  useEffect(() => {
    if (rideHistory && rideHistory.rides) {
      filterRides();
    }
  }, [rideHistory, tabValue, searchTerm]);

  const filterRides = () => {
    let filtered = [...(rideHistory.rides || [])];

    if (tabValue === 1) {
      filtered = filtered.filter((ride) => ride.status === "completed");
    } else if (tabValue === 2) {
      filtered = filtered.filter((ride) => ride.status === "cancelled");
    } else if (tabValue === 3) {
      filtered = filtered.filter((ride) =>
        ["requested", "accepted", "in-progress"].includes(ride.status)
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ride) =>
          (ride.pickupLocation?.address || "").toLowerCase().includes(term) ||
          (ride.dropLocation?.address || "").toLowerCase().includes(term) ||
          (ride.captain &&
            (ride.captain.fullname || "").toLowerCase().includes(term))
      );
    }

    filtered.sort(
      (a, b) =>
        new Date(b.requestedAt || b.createdAt || 0) -
        new Date(a.requestedAt || a.createdAt || 0)
    );

    setFilteredRides(filtered);
  };

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const getRideStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "in-progress":
        return "primary";
      case "requested":
      case "accepted":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Prepare the ride list items
  const renderRideListItems = () => {
    return filteredRides.map((ride, index) => (
      <Box key={ride._id}>
        {index > 0 && <Divider component="li" />}
        <ListItem
          alignItems="flex-start"
          sx={{
            py: 3,
            "&:hover": { bgcolor: "action.hover" },
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = `/rides/${ride._id}`)}
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
                  mb: 1,
                }}
              >
                <Typography variant="h6" fontWeight="medium">
                  Ride on {formatDate(ride.requestedAt || ride.createdAt)}
                </Typography>
                <Chip
                  label={ride.status.replace("-", " ").replace("_", " ")}
                  color={getRideStatusColor(ride.status)}
                  sx={{ textTransform: "capitalize" }}
                />
              </Box>
            }
            secondary={
              <Typography component="span" variant="body2">
                <Box component="span" sx={{ display: "block" }}>
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <MyLocation
                      sx={{
                        mr: 1,
                        fontSize: 20,
                        color: "primary.main",
                      }}
                    />
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {ride.pickupLocation?.address || "Unknown location"}
                    </Typography>
                  </Box>

                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <LocationOn
                      sx={{
                        mr: 1,
                        fontSize: 20,
                        color: "error.main",
                      }}
                    />
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {ride.dropLocation?.address || "Unknown destination"}
                    </Typography>
                  </Box>

                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <AccessTime
                        fontSize="small"
                        sx={{
                          mr: 0.5,
                          fontSize: 16,
                          color: "text.secondary",
                        }}
                      />
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {ride.duration ? `${ride.duration} min` : "N/A"}
                      </Typography>
                    </Box>

                    <Box
                      component="span"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <CreditCard
                        fontSize="small"
                        sx={{
                          mr: 0.5,
                          fontSize: 16,
                          color: "text.secondary",
                        }}
                      />
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        ${ride.fare || "N/A"}
                      </Typography>
                    </Box>

                    {ride.captain && (
                      <Box
                        component="span"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          alt={ride.captain.fullname || "Captain"}
                          sx={{ width: 20, height: 20, mr: 0.5 }}
                        >
                          {(ride.captain.fullname || "C")[0]}
                        </Avatar>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {ride.captain.fullname || "Captain"}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Typography>
            }
          />
        </ListItem>
      </Box>
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          My Rides
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your ride history
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            <Tab label="All Rides" />
            <Tab label="Completed" />
            <Tab label="Cancelled" />
            <Tab label="Active" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search rides by location or driver name"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ mr: 2, display: "none" }}
            />

            {/* Replace TextField with InputBase which has better customization */}
            <Box sx={{ position: "relative", flexGrow: 1, mr: 2 }}>
              <Search
                sx={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 1,
                  color: "text.secondary",
                }}
              />
              <InputBase
                fullWidth
                placeholder="Search rides by location or driver name"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  pl: 5,
                  pr: searchTerm ? 5 : 2,
                  py: 1,
                  width: "100%",
                }}
              />
              {searchTerm && (
                <IconButton
                  onClick={clearSearch}
                  sx={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                  }}
                >
                  <Clear />
                </IconButton>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                sx={{ whiteSpace: "nowrap" }}
                onClick={() => {
                  setDataLoaded(false);
                }}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                sx={{ whiteSpace: "nowrap" }}
              >
                Filter
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : filteredRides.length > 0 ? (
            <List sx={{ width: "100%" }}>
              {React.useMemo(() => renderRideListItems(), [filteredRides])}
            </List>
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <DirectionsCar
                sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                No rides found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm
                  ? "No rides match your search criteria"
                  : tabValue === 0
                  ? "You haven't taken any rides yet"
                  : tabValue === 1
                  ? "You don't have any completed rides"
                  : tabValue === 2
                  ? "You don't have any cancelled rides"
                  : "You don't have any active rides"}
              </Typography>
              <Button
                onClick={() => (window.location.href = "/book-ride")}
                variant="contained"
              >
                Book a Ride
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default MyRides;
