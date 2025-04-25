import React, { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "../config";

// Default map container style
const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
  overflow: "hidden",
};

const MapComponent = ({
  apiKey,
  locations = [],
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  height = "400px",
  width = "100%",
  showInfoWindow = true,
}) => {
  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Callback when map is loaded
  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  // Callback when map is unmounted
  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  // Close info window when component unmounts or locations change
  useEffect(() => {
    return () => {
      setSelectedLocation(null);
    };
  }, [locations]);

  // Handle marker click
  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  // If there's an error loading the map
  if (loadError) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          textAlign: "center",
          height: height,
          width: width,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "12px",
        }}
      >
        <LocationOnIcon color="error" sx={{ fontSize: 40, mb: 2 }} />
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Map
        </Typography>
        <Typography variant="body2" color="text.secondary">
          There was a problem loading Google Maps. Please try again later.
        </Typography>
      </Paper>
    );
  }

  // If the map is still loading
  if (!isLoaded) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          textAlign: "center",
          height: height,
          width: width,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "12px",
        }}
      >
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Loading Map
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we load the map...
        </Typography>
      </Paper>
    );
  }

  return (
    <Box
      sx={{
        height: height,
        width: width,
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: 3,
      }}
    >
      <GoogleMap
        mapContainerStyle={{ ...containerStyle, height: height, width: width }}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          fullscreenControl: true,
          streetViewControl: true,
          mapTypeControl: true,
          zoomControl: true,
        }}
      >
        {/* Render markers for each location */}
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.title}
            onClick={() => handleMarkerClick(location)}
            animation={window.google?.maps?.Animation?.DROP}
            icon={{
              url:
                location.icon ||
                "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: window.google?.maps?.Size
                ? new window.google.maps.Size(40, 40)
                : null,
            }}
          />
        ))}

        {/* Info Window for selected location */}
        {showInfoWindow && selectedLocation && (
          <InfoWindow
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <Box sx={{ p: 1, maxWidth: 200 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {selectedLocation.title}
              </Typography>
              {selectedLocation.description && (
                <Typography variant="body2">
                  {selectedLocation.description}
                </Typography>
              )}
              {selectedLocation.address && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, fontSize: "0.8rem" }}
                >
                  {selectedLocation.address}
                </Typography>
              )}
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>
    </Box>
  );
};

export default MapComponent;
