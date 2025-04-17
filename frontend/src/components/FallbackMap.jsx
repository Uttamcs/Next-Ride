import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

/**
 * A fallback component to display when the Google Maps component fails to load
 * Shows a simple representation of the route with origin and destination
 */
const FallbackMap = ({ origin, destination, distance, duration }) => {
  return (
    <Paper 
      elevation={3}
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="medium" color="primary">
        Route Information
      </Typography>
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', my: 2 }}>
        {/* Origin */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
          <Box 
            sx={{ 
              bgcolor: 'success.light', 
              color: 'white', 
              borderRadius: '50%', 
              p: 1,
              mr: 2,
              display: 'flex'
            }}
          >
            <MyLocationIcon />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">Origin</Typography>
            <Typography variant="body1" fontWeight="medium">
              {origin?.address || 'Not specified'}
            </Typography>
          </Box>
        </Box>
        
        {/* Route line */}
        <Box sx={{ height: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: 2, height: 20, bgcolor: 'divider' }} />
          <ArrowDownwardIcon color="action" sx={{ my: 0.5 }} />
          <Box sx={{ width: 2, height: 20, bgcolor: 'divider' }} />
        </Box>
        
        {/* Destination */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2 }}>
          <Box 
            sx={{ 
              bgcolor: 'error.light', 
              color: 'white', 
              borderRadius: '50%', 
              p: 1,
              mr: 2,
              display: 'flex'
            }}
          >
            <LocationOnIcon />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">Destination</Typography>
            <Typography variant="body1" fontWeight="medium">
              {destination?.address || 'Not specified'}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Route details */}
      {(distance || duration) && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {distance && (
              <Box>
                <Typography variant="body2" color="text.secondary">Distance</Typography>
                <Typography variant="body1" fontWeight="medium">{distance}</Typography>
              </Box>
            )}
            {duration && (
              <Box>
                <Typography variant="body2" color="text.secondary">Duration</Typography>
                <Typography variant="body1" fontWeight="medium">{duration}</Typography>
              </Box>
            )}
          </Box>
        </>
      )}
      
      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ 
          position: 'absolute', 
          bottom: 8, 
          right: 8,
          fontStyle: 'italic'
        }}
      >
        Map visualization unavailable
      </Typography>
    </Paper>
  );
};

export default FallbackMap;
