import { useState } from "react";
import { Link } from "react-router-dom";
import { useCombinedAuth } from "../context/CombinedAuthContext";
import ServerConnectionError from "../components/ServerConnectionError";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const CaptainRegister = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    vehicleType: "car",
    vehicleNumber: "",
    vehicleColor: "",
    capacity: 4,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isConnectionError, setIsConnectionError] = useState(false);
  const { register, loading } = useCombinedAuth();

  const steps = ["Personal Information", "Vehicle Details", "Account Security"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    if (step === 0) {
      // Validate personal information
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
        isValid = false;
      } else if (formData.firstName.trim().length < 3) {
        newErrors.firstName = "First name must be at least 3 characters";
        isValid = false;
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
        isValid = false;
      } else if (formData.lastName.trim().length < 3) {
        newErrors.lastName = "Last name must be at least 3 characters";
        isValid = false;
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
        isValid = false;
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
        isValid = false;
      } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
        newErrors.phone = "Phone number must be 10 digits";
        isValid = false;
      }
    } else if (step === 1) {
      // Validate vehicle details
      if (!formData.vehicleNumber.trim()) {
        newErrors.vehicleNumber = "Vehicle number is required";
        isValid = false;
      } else if (formData.vehicleNumber.trim().length < 5) {
        newErrors.vehicleNumber = "Please enter a valid vehicle number";
        isValid = false;
      }

      if (!formData.vehicleColor.trim()) {
        newErrors.vehicleColor = "Vehicle color is required";
        isValid = false;
      }

      if (!formData.capacity || formData.capacity < 1) {
        newErrors.capacity = "Capacity must be at least 1";
        isValid = false;
      }
    } else if (step === 2) {
      // Validate password
      if (!formData.password) {
        newErrors.password = "Password is required";
        isValid = false;
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
        isValid = false;
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(activeStep)) {
      return;
    }

    setServerError("");
    setIsConnectionError(false);

    try {
      // Call register with properly formatted data
      await register(
        {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber.trim(),
          vehicleColor: formData.vehicleColor.trim(),
          capacity: parseInt(formData.capacity),
          phone: formData.phone.replace(/[^0-9]/g, ""), // Remove non-numeric characters
        },
        "captain"
      );
      // Navigation is handled in the register function in CombinedAuthContext
    } catch (err) {
      console.error("Registration error:", err);

      // Handle connection errors with more helpful messages
      if (
        err.isConnectionError ||
        (err.message &&
          (err.message.includes("connect to server") ||
            err.message.includes("No response from server") ||
            err.message.includes("Network error")))
      ) {
        setServerError(
          "Cannot connect to the server. The application will work in offline mode."
        );
        setIsConnectionError(true);
        return;
      }

      // Handle other errors
      setServerError(err.message || "Registration failed. Please try again.");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      {isConnectionError ? (
        <ServerConnectionError message={serverError} />
      ) : (
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Become a Captain
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join Next Ride as a driver and start earning
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {serverError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {serverError}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={
              activeStep === steps.length - 1 ? handleSubmit : handleNext
            }
          >
            {activeStep === 0 && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </>
            )}

            {activeStep === 1 && (
              <>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>
                  <Select
                    labelId="vehicle-type-label"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    label="Vehicle Type"
                  >
                    <MenuItem value="car">Car</MenuItem>
                    <MenuItem value="bike">Bike</MenuItem>
                    <MenuItem value="auto">Auto</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Vehicle Number"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors.vehicleNumber}
                  helperText={errors.vehicleNumber}
                />

                <TextField
                  fullWidth
                  label="Vehicle Color"
                  name="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors.vehicleColor}
                  helperText={errors.vehicleColor}
                />

                <TextField
                  fullWidth
                  label="Seating Capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors.capacity}
                  helperText={errors.capacity}
                  InputProps={{ inputProps: { min: 1, max: 10 } }}
                />
              </>
            )}

            {activeStep === 2 && (
              <>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
                mb: 2,
              }}
            >
              {activeStep > 0 && (
                <Button onClick={handleBack} variant="outlined">
                  Back
                </Button>
              )}
              <Button
                type={activeStep === steps.length - 1 ? "submit" : "button"}
                variant="contained"
                onClick={
                  activeStep === steps.length - 1 ? undefined : handleNext
                }
                disabled={loading}
                sx={{ ml: activeStep > 0 ? "auto" : 0 }}
              >
                {activeStep === steps.length - 1 ? (
                  loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Create Account"
                  )
                ) : (
                  "Next"
                )}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Typography variant="body2">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{ textDecoration: "none", color: "primary.main" }}
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      color="primary"
                      fontWeight="medium"
                    >
                      Sign in
                    </Typography>
                  </Link>
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Want to register as a passenger instead?{" "}
                <Link
                  to="/register"
                  style={{ textDecoration: "none", color: "primary.main" }}
                >
                  <Typography
                    component="span"
                    variant="body2"
                    color="primary"
                    fontWeight="medium"
                  >
                    Register as Passenger
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default CaptainRegister;
