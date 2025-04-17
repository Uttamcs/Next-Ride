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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isConnectionError, setIsConnectionError] = useState(false);
  const { register, loading } = useCombinedAuth();

  const steps = ["Personal Information", "Account Security"];

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

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      // Validate name
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      } else {
        // Check if name has first and last name
        const nameParts = formData.name.trim().split(" ");
        if (nameParts.length < 2) {
          newErrors.name = "Please provide both first and last name";
        } else if (nameParts[0].length < 3) {
          newErrors.name = "First name must be at least 3 characters";
        } else if (nameParts[1].length < 3) {
          newErrors.name = "Last name must be at least 3 characters";
        }
      }

      // Validate email
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
      ) {
        newErrors.email = "Invalid email address";
      }

      // Validate phone
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
        newErrors.phone = "Phone number must be 10 digits";
      }
    } else if (activeStep === 1) {
      // Validate password
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (formData.password.length > 20) {
        newErrors.password = "Password must be at most 20 characters";
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one lowercase letter";
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter";
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
      }

      // Validate confirm password
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) {
      return;
    }

    setServerError("");

    try {
      // Call register with properly formatted data
      await register(
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.replace(/[^0-9]/g, ""), // Remove non-numeric characters
          password: formData.password,
        },
        "user"
      );
      // Navigation is handled in the register function in AuthContext
    } catch (err) {
      console.error("Registration error:", err);

      // Handle connection errors with more helpful messages
      if (
        err.message &&
        (err.message.includes("connect to server") ||
          err.message.includes("No response from server"))
      ) {
        setServerError(
          "Cannot connect to the server. Please make sure the backend server is running at http://localhost:3300"
        );
        setIsConnectionError(true);
        return;
      }

      // Handle different error formats that might come from the backend
      if (err.errors && Array.isArray(err.errors)) {
        // Handle validation errors array from express-validator
        const errorMessages = err.errors.map((e) => e.msg).join(", ");
        setServerError(
          errorMessages || "Registration failed. Please try again."
        );
      } else if (err.errors && typeof err.errors === "object") {
        // Handle mongoose validation errors
        const errorMessages = Object.values(err.errors).join(", ");
        setServerError(
          errorMessages || "Registration failed. Please try again."
        );
      } else if (err.message && err.message.includes("already exists")) {
        // Handle user already exists error
        setServerError(
          "An account with this email already exists. Please use a different email or try logging in."
        );
      } else if (
        err.message &&
        err.message.includes("No response from server")
      ) {
        // Handle no response error
        setServerError(
          "No response from server. Please make sure the backend server is running at http://localhost:3300"
        );
      } else {
        // Handle simple error message
        setServerError(err.message || "Registration failed. Please try again.");
      }
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
              Create an Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join Next Ride for a better ride experience
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
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                  autoFocus
                />

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
                <Box sx={{ position: "relative" }}>
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
                    aria-label="password"
                  />
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    sx={{
                      position: "absolute",
                      right: 14,
                      top: 14,
                      zIndex: 1,
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Box>

                <Box sx={{ position: "relative" }}>
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
                    aria-label="confirm password"
                  />
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    sx={{
                      position: "absolute",
                      right: 14,
                      top: 14,
                      zIndex: 1,
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  By creating an account, you agree to our{" "}
                  <Link
                    to="/terms"
                    style={{ textDecoration: "none", color: "primary.main" }}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    style={{ textDecoration: "none", color: "primary.main" }}
                  >
                    Privacy Policy
                  </Link>
                </Typography>
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

            <Grid container justifyContent="center">
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
                Want to register as a captain instead?{" "}
                <Link
                  to="/captain-register"
                  style={{ textDecoration: "none", color: "primary.main" }}
                >
                  <Typography
                    component="span"
                    variant="body2"
                    color="primary"
                    fontWeight="medium"
                  >
                    Register as Captain
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

export default Register;
