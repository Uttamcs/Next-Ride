import React, { useState, useEffect, Fragment } from "react";
import { useCombinedAuth } from "../context/CombinedAuthContext";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  CircularProgress,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  DirectionsCar,
  AttachMoney,
  Star,
  Timeline,
  LocationOn,
  Person,
  CheckCircle,
  Cancel,
  AccessTime,
} from "@mui/icons-material";

const CaptainDashboard = () => {
  const { currentUser, userType, loading } = useCombinedAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [earnings, setEarnings] = useState({ today: 0, week: 0, month: 0 });
  const [stats, setStats] = useState({
    totalRides: 0,
    completionRate: 0,
    rating: 0,
    cancelRate: 0,
  });
  const [recentRides, setRecentRides] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setDashboardLoading(true);
      try {
        // In a real app, these would be API calls
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        setEarnings({
          today: 1250,
          week: 8450,
          month: 32500,
        });

        setStats({
          totalRides: 142,
          completionRate: 96,
          rating: 4.8,
          cancelRate: 4,
        });

        setRecentRides([
          {
            id: "r123",
            passenger: "Rahul Sharma",
            pickup: "Connaught Place",
            dropoff: "Saket",
            date: "2023-06-15",
            time: "14:30",
            amount: 350,
            status: "completed",
          },
          {
            id: "r124",
            passenger: "Priya Patel",
            pickup: "Lajpat Nagar",
            dropoff: "Noida Sector 18",
            date: "2023-06-15",
            time: "12:15",
            amount: 420,
            status: "completed",
          },
          {
            id: "r125",
            passenger: "Amit Kumar",
            pickup: "Hauz Khas",
            dropoff: "Gurgaon Cyber City",
            date: "2023-06-14",
            time: "18:45",
            amount: 480,
            status: "completed",
          },
        ]);

        // Set availability based on user data or default to true
        setIsAvailable(currentUser?.isAvailable ?? true);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setDashboardLoading(false);
      }
    };

    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  const handleAvailabilityChange = (event) => {
    const newAvailability = event.target.checked;
    setIsAvailable(newAvailability);

    // In a real app, this would update the captain's availability status in the backend
    console.log("Captain availability changed to:", newAvailability);
  };

  if (loading || dashboardLoading) {
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Captain Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {currentUser?.fullname?.firstName || "Captain"}! Manage
          your rides and track your earnings.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Availability Status */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: isAvailable
                ? "success.light"
                : "action.disabledBackground",
              color: isAvailable ? "success.contrastText" : "text.secondary",
              transition: "all 0.3s ease",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: isAvailable ? "success.main" : "action.disabled",
                    width: 48,
                    height: 48,
                    mr: 2,
                  }}
                >
                  {isAvailable ? <CheckCircle /> : <Cancel />}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {isAvailable ? "You are Online" : "You are Offline"}
                  </Typography>
                  <Typography variant="body2">
                    {isAvailable
                      ? "You are visible to passengers and can receive ride requests"
                      : "You are not visible to passengers and will not receive ride requests"}
                  </Typography>
                </Box>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={isAvailable}
                    onChange={handleAvailabilityChange}
                    color="success"
                  />
                }
                label={isAvailable ? "Online" : "Offline"}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Earnings Cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardHeader
              title="Today's Earnings"
              titleTypographyProps={{
                variant: "subtitle1",
                fontWeight: "medium",
              }}
              avatar={
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <AttachMoney />
                </Avatar>
              }
            />
            <CardContent>
              <Typography
                variant="h4"
                component="div"
                fontWeight="bold"
                color="primary.main"
              >
                ₹{earnings.today.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Keep up the good work!
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardHeader
              title="This Week"
              titleTypographyProps={{
                variant: "subtitle1",
                fontWeight: "medium",
              }}
              avatar={
                <Avatar sx={{ bgcolor: "secondary.main" }}>
                  <Timeline />
                </Avatar>
              }
            />
            <CardContent>
              <Typography
                variant="h4"
                component="div"
                fontWeight="bold"
                color="secondary.main"
              >
                ₹{earnings.week.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {earnings.week > 5000
                  ? "Great progress this week!"
                  : "Keep driving to increase your earnings"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardHeader
              title="This Month"
              titleTypographyProps={{
                variant: "subtitle1",
                fontWeight: "medium",
              }}
              avatar={
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <AttachMoney />
                </Avatar>
              }
            />
            <CardContent>
              <Typography
                variant="h4"
                component="div"
                fontWeight="bold"
                color="success.main"
              >
                ₹{earnings.month.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {earnings.month > 30000
                  ? "Excellent monthly performance!"
                  : "You're making good progress"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2 }}>
            <CardHeader
              title="Performance Statistics"
              titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <DirectionsCar
                      color="primary"
                      sx={{ fontSize: 40, mb: 1 }}
                    />
                    <Typography variant="h5" fontWeight="bold">
                      {stats.totalRides}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Rides
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {stats.completionRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completion Rate
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Star sx={{ fontSize: 40, mb: 1, color: "#FFD700" }} />
                    <Typography variant="h5" fontWeight="bold">
                      {stats.rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Rating
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Cancel color="error" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {stats.cancelRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cancellation Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Rides */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2 }}>
            <CardHeader
              title="Recent Rides"
              titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
              action={
                <Button color="primary" size="small">
                  View All
                </Button>
              }
            />
            <Divider />
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {recentRides.map((ride) => (
                <Fragment key={ride.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: "primary.light" }}>
                        <Person />
                      </Avatar>
                    </ListItemIcon>
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
                            {ride.passenger}
                          </Typography>
                          <Chip
                            label={`₹${ride.amount}`}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography component="span" variant="body2">
                          <Box
                            component="span"
                            sx={{
                              display: "block",
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 0.5,
                              }}
                            >
                              <LocationOn
                                fontSize="small"
                                color="action"
                                sx={{ mr: 0.5 }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                component="span"
                              >
                                {ride.pickup} to {ride.dropoff}
                              </Typography>
                            </Box>
                            <Box
                              component="span"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 0.5,
                              }}
                            >
                              <AccessTime
                                fontSize="small"
                                color="action"
                                sx={{ mr: 0.5 }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                component="span"
                              >
                                {ride.date} at {ride.time}
                              </Typography>
                            </Box>
                          </Box>
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Fragment>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CaptainDashboard;
