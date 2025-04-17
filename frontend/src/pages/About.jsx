import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Divider,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  LocalTaxi,
  Security,
  Speed,
  Payment,
  SupportAgent,
  EmojiPeople,
  ArrowForward,
  AppShortcut,
  LocationOn,
  DirectionsCar,
  Star,
} from "@mui/icons-material";
import heroCarImage from "../assets/images/hero-car.svg";
import { useTheme } from "@mui/material/styles";

const About = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <LocalTaxi fontSize="large" color="primary" />,
      title: "Reliable Rides",
      description:
        "Our network of professional drivers ensures you always get a reliable ride when you need it.",
    },
    {
      icon: <Security fontSize="large" color="primary" />,
      title: "Safety First",
      description:
        "Your safety is our priority. All drivers are verified and rides are tracked in real-time.",
    },
    {
      icon: <Speed fontSize="large" color="primary" />,
      title: "Fast Pickups",
      description:
        "With drivers available 24/7, you can get a ride within minutes of booking.",
    },
    {
      icon: <Payment fontSize="large" color="primary" />,
      title: "Easy Payments",
      description:
        "Multiple payment options make it convenient to pay for your rides.",
    },
    {
      icon: <SupportAgent fontSize="large" color="primary" />,
      title: "24/7 Support",
      description:
        "Our customer support team is always available to assist you with any issues.",
    },
    {
      icon: <EmojiPeople fontSize="large" color="primary" />,
      title: "Friendly Service",
      description:
        "Our drivers are trained to provide a pleasant and comfortable experience.",
    },
  ];

  const teamMembers = [
    {
      name: "Uttam Kumar",
      position: "Founder & Full Stack Developer",
      bio: "Uttam started NextDrive to revolutionize how people book rides and rentals. With deep expertise in full-stack development, DSA, and cybersecurity, he brings both technical excellence and user-first design into every line of code.",
      avatar: "/avatar-placeholder.png", // Replace with your actual image path when available
    },
    // Add more team members here if needed
  ];

  return (
    <Box>
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            About NextDrive
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800, mb: 4 }}>
            We're on a mission to redefine modern mobility with smarter, safer,
            and more affordable ride-booking and rental services.
          </Typography>
        </Container>
      </Box>

      {/* Our Story Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h2"
              fontWeight="bold"
              gutterBottom
            >
              Our Story
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Founded in 2024 by Uttam Kumar, a passionate developer with a
              vision to make mobility seamless, NextDrive began as a college
              project and quickly grew into a promising transportation platform.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Combining expertise in full-stack development and cybersecurity,
              Uttam built a platform that not only makes ride-booking and
              rentals easier but also ensures safety and transparency at every
              step.
            </Typography>
            <Typography variant="body1">
              Today, NextDrive is on a path to serve cities across India,
              building a sustainable and inclusive transportation ecosystem.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                borderRadius: 4,
                overflow: "hidden",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                },
              }}
            >
              <Box
                component="img"
                src={heroCarImage}
                alt="NextDrive story"
                sx={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: 2,
                  boxShadow: 3,
                  filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.15))",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.100",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            Why Choose NextDrive
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 800, mx: "auto" }}
          >
            We combine technology and exceptional service to provide you with
            the best ride experience
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                key={index}
                sx={{ maxWidth: "350px" }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    height: "100%",
                    minHeight: "280px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    borderRadius: 2,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box
                    sx={{ mb: 2, display: "flex", justifyContent: "center" }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    fontWeight="bold"
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Meet Our Team
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 800, mx: "auto" }}
        >
          The passionate people behind NextDrive working to transform
          transportation
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 2,
                      boxShadow: 2,
                    }}
                  />
                  <Typography
                    variant="h5"
                    component="h3"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {member.position}
                  </Typography>
                </Box>
                <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                  <Typography variant="body1" color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            How to Book a Ride
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 8, maxWidth: 800, mx: "auto" }}
          >
            Experience the simplicity of booking a ride with NextDrive in just a
            few steps
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
                    bgcolor: "primary.main",
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
                      bgcolor: "secondary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      boxShadow: 2,
                    },
                  }}
                >
                  <AppShortcut sx={{ fontSize: 40 }} />
                </Paper>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Download the App
                </Typography>
                <Typography variant="body2" color="text.secondary">
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
              <ArrowForward
                sx={{ fontSize: 40, color: "primary.main", opacity: 0.7 }}
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
                    bgcolor: "primary.main",
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
                      bgcolor: "secondary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      boxShadow: 2,
                    },
                  }}
                >
                  <LocationOn sx={{ fontSize: 40 }} />
                </Paper>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Set Your Location
                </Typography>
                <Typography variant="body2" color="text.secondary">
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
              <ArrowForward
                sx={{ fontSize: 40, color: "primary.main", opacity: 0.7 }}
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
                    bgcolor: "primary.main",
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
                      bgcolor: "secondary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      boxShadow: 2,
                    },
                  }}
                >
                  <DirectionsCar sx={{ fontSize: 40 }} />
                </Paper>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Book Your Ride
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose your preferred vehicle type and confirm booking
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
              <ArrowForward
                sx={{ fontSize: 40, color: "primary.main", opacity: 0.7 }}
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
                    bgcolor: "primary.main",
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
                      bgcolor: "secondary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      boxShadow: 2,
                    },
                  }}
                >
                  <Star sx={{ fontSize: 40 }} />
                </Paper>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Enjoy & Rate
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enjoy your ride and rate your experience afterward
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Ready to experience the easiest way to get around town?
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1.1rem",
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 5,
                  transform: "translateY(-2px)",
                },
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            gutterBottom
          >
            Our Mission
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            To make transportation accessible, affordable, and sustainable for
            everyone
          </Typography>
          <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)", my: 4 }} />
          <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
            Join us on our journey to transform how people move around cities.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
