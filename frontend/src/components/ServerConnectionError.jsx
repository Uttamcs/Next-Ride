import React from "react";
import { Box, Typography, Paper, Button, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloudOffIcon from "@mui/icons-material/CloudOff";

const ServerConnectionError = ({ message }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
        mt: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          textAlign: "center",
          borderRadius: 2,
          border: "1px solid #ed6c02", // warning color
        }}
      >
        <CloudOffIcon color="warning" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" color="warning.main" gutterBottom>
          Offline Mode
        </Typography>

        <Alert severity="info" sx={{ mb: 3, textAlign: "left" }}>
          The application is running in offline mode. You can still use most
          features, but data will not be synchronized with the server until
          connection is restored.
        </Alert>

        <Typography variant="body1" paragraph>
          {message ||
            "Cannot connect to the server. The application will work in offline mode."}
        </Typography>

        <Typography variant="body2" sx={{ mb: 3 }}>
          You can continue using the application in offline mode or try to
          reconnect to the server.
        </Typography>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
          <Button component={Link} to="/" variant="outlined">
            Return to Home
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => window.location.reload()}
          >
            Try to Reconnect
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
          >
            Continue in Offline Mode
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ServerConnectionError;
