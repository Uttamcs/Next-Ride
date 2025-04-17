import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ServerConnectionError = ({ message }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
        mt: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          textAlign: 'center',
          borderRadius: 2,
          border: '1px solid #f44336',
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" color="error" gutterBottom>
          Server Connection Error
        </Typography>
        <Typography variant="body1" paragraph>
          {message || 'Cannot connect to the server. Please make sure the backend server is running.'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          To start the backend server, open a terminal and run:
          <Box
            component="pre"
            sx={{
              bgcolor: 'background.paper',
              p: 2,
              mt: 1,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              textAlign: 'left',
              overflowX: 'auto',
            }}
          >
            cd Backend
            npm run dev
          </Box>
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button component={Link} to="/" variant="outlined">
            Return to Home
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ServerConnectionError;
