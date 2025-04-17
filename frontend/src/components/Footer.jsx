import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  DirectionsCar,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        pt: 8,
        pb: 4,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "5px",
          background: "linear-gradient(90deg, #3563E9 0%, #6B8EFC 100%)",
        },
        boxShadow: "0px -4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  bgcolor: "primary.main",
                  borderRadius: "12px",
                  p: 1,
                  mr: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(53, 99, 233, 0.2)",
                }}
              >
                <DirectionsCar sx={{ color: "white", fontSize: 24 }} />
              </Box>
              <Typography
                variant="h5"
                component={Link}
                to="/"
                sx={{
                  fontWeight: 800,
                  color: "text.primary",
                  textDecoration: "none",
                  letterSpacing: "0.5px",
                  background:
                    "linear-gradient(90deg, #3563E9 0%, #6B8EFC 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                }}
              >
                NEXT RIDE
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 350 }}
            >
              Next Ride is a modern ride booking service that connects
              passengers with reliable drivers for a seamless transportation
              experience.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <IconButton
                aria-label="Facebook"
                size="small"
                sx={{
                  bgcolor: "rgba(53, 99, 233, 0.1)",
                  color: "primary.main",
                  transition: "all 0.3s",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 10px rgba(53, 99, 233, 0.3)",
                  },
                }}
              >
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                size="small"
                sx={{
                  bgcolor: "rgba(53, 99, 233, 0.1)",
                  color: "primary.main",
                  transition: "all 0.3s",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 10px rgba(53, 99, 233, 0.3)",
                  },
                }}
              >
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="Instagram"
                size="small"
                sx={{
                  bgcolor: "rgba(53, 99, 233, 0.1)",
                  color: "primary.main",
                  transition: "all 0.3s",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 10px rgba(53, 99, 233, 0.3)",
                  },
                }}
              >
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="LinkedIn"
                size="small"
                sx={{
                  bgcolor: "rgba(53, 99, 233, 0.1)",
                  color: "primary.main",
                  transition: "all 0.3s",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 10px rgba(53, 99, 233, 0.3)",
                  },
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="YouTube"
                size="small"
                sx={{
                  bgcolor: "rgba(53, 99, 233, 0.1)",
                  color: "primary.main",
                  transition: "all 0.3s",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 10px rgba(53, 99, 233, 0.3)",
                  },
                }}
              >
                <YouTube fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              sx={{
                position: "relative",
                display: "inline-block",
                pb: 1,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "30px",
                  height: "2px",
                  bgcolor: "primary.main",
                  borderRadius: "2px",
                },
              }}
            >
              Company
            </Typography>
            <List dense disablePadding>
              {["About Us", "Careers", "Blog", "Press"].map((item) => (
                <ListItem key={item} disablePadding sx={{ py: 0.7 }}>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        component={Link}
                        to={`/${item.toLowerCase().replace(" ", "-")}`}
                        sx={{
                          color: "text.secondary",
                          textDecoration: "none",
                          transition: "all 0.2s",
                          display: "inline-block",
                          "&:hover": {
                            color: "primary.main",
                            transform: "translateX(5px)",
                          },
                        }}
                      >
                        {item}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              sx={{
                position: "relative",
                display: "inline-block",
                pb: 1,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "30px",
                  height: "2px",
                  bgcolor: "primary.main",
                  borderRadius: "2px",
                },
              }}
            >
              Information
            </Typography>
            <List dense disablePadding>
              {[
                "Services",
                "How it Works",
                "Safety",
                "Cities",
                "Help Center",
              ].map((item) => (
                <ListItem key={item} disablePadding sx={{ py: 0.7 }}>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        component={Link}
                        to={`/${item.toLowerCase().replace(" ", "-")}`}
                        sx={{
                          color: "text.secondary",
                          textDecoration: "none",
                          transition: "all 0.2s",
                          display: "inline-block",
                          "&:hover": {
                            color: "primary.main",
                            transform: "translateX(5px)",
                          },
                        }}
                      >
                        {item}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              sx={{
                position: "relative",
                display: "inline-block",
                pb: 1,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "30px",
                  height: "2px",
                  bgcolor: "primary.main",
                  borderRadius: "2px",
                },
              }}
            >
              Legal
            </Typography>
            <List dense disablePadding>
              {[
                "Terms of Service",
                "Privacy Policy",
                "Cookie Policy",
                "Accessibility",
              ].map((item) => (
                <ListItem key={item} disablePadding sx={{ py: 0.7 }}>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        component={Link}
                        to={`/${item.toLowerCase().replace(" ", "-")}`}
                        sx={{
                          color: "text.secondary",
                          textDecoration: "none",
                          transition: "all 0.2s",
                          display: "inline-block",
                          "&:hover": {
                            color: "primary.main",
                            transform: "translateX(5px)",
                          },
                        }}
                      >
                        {item}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              sx={{
                position: "relative",
                display: "inline-block",
                pb: 1,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "30px",
                  height: "2px",
                  bgcolor: "primary.main",
                  borderRadius: "2px",
                },
              }}
            >
              Contact
            </Typography>
            <List dense disablePadding>
              <ListItem disablePadding sx={{ py: 0.7 }}>
                <EmailIcon
                  sx={{
                    fontSize: 18,
                    mr: 1,
                    color: "primary.main",
                    opacity: 0.8,
                  }}
                />
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        transition: "all 0.2s",
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                    >
                      support@nextride.com
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem disablePadding sx={{ py: 0.7 }}>
                <PhoneIcon
                  sx={{
                    fontSize: 18,
                    mr: 1,
                    color: "primary.main",
                    opacity: 0.8,
                  }}
                />
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        transition: "all 0.2s",
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                    >
                      +(91)9999900001
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem disablePadding sx={{ py: 0.7 }}>
                <LocationOnIcon
                  sx={{
                    fontSize: 18,
                    mr: 1,
                    color: "primary.main",
                    opacity: 0.8,
                  }}
                />
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        transition: "all 0.2s",
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                    >
                      GLA University, Mathura
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, opacity: 0.6 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              "& span": {
                color: "primary.main",
                fontWeight: "bold",
                mx: 0.5,
              },
            }}
          >
            © {year} <span>Next Ride</span>. All rights reserved.
          </Typography>
          <Stack
            direction="row"
            spacing={3}
            sx={{
              mt: { xs: 2, sm: 0 },
              "& a": {
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -2,
                  left: 0,
                  width: 0,
                  height: "2px",
                  bgcolor: "primary.main",
                  transition: "width 0.3s ease",
                },
                "&:hover::after": {
                  width: "100%",
                },
              },
            }}
          >
            <Typography
              variant="body2"
              component={Link}
              to="/terms-of-service"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                fontWeight: 500,
                transition: "all 0.2s",
                "&:hover": { color: "primary.main" },
              }}
            >
              Terms
            </Typography>
            <Typography
              variant="body2"
              component={Link}
              to="/privacy-policy"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                fontWeight: 500,
                transition: "all 0.2s",
                "&:hover": { color: "primary.main" },
              }}
            >
              Privacy
            </Typography>
            <Typography
              variant="body2"
              component={Link}
              to="/cookie-policy"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                fontWeight: 500,
                transition: "all 0.2s",
                "&:hover": { color: "primary.main" },
              }}
            >
              Cookies
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
