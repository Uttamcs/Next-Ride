import React, { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { loadGoogleMapsApi } from "../../utils/googleMapsLoader";

const GoogleMapComponent = ({
  height = 400,
  width = "100%",
  center = { lat: 28.6139, lng: 77.209 }, // Default to Delhi, India
  zoom = 12,
  markers = [],
  onMapClick,
  onMarkerClick,
  onMapLoad,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Load Google Maps API
        await loadGoogleMapsApi();

        if (!mapRef.current) return;

        console.log("Initializing map with Google Maps API");

        // Initialize the map
        const mapOptions = {
          center,
          zoom,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
        };

        const map = new window.google.maps.Map(mapRef.current, mapOptions);
        mapInstanceRef.current = map;

        // Add markers if provided
        const mapMarkers = markers.map((markerData) => {
          const marker = new window.google.maps.Marker({
            position: markerData.position,
            map,
            title: markerData.title || "",
            icon: markerData.icon,
          });

          if (onMarkerClick) {
            marker.addListener("click", () => {
              onMarkerClick(markerData, marker);
            });
          }

          return marker;
        });

        // Add click event listener if provided
        if (onMapClick) {
          map.addListener("click", (event) => {
            onMapClick({
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            });
          });
        }

        // Call onMapLoad callback if provided
        if (onMapLoad) {
          onMapLoad(map, mapMarkers);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error initializing Google Maps:", err);
        setError(
          "Failed to initialize Google Maps: " +
            (err.message || "Unknown error")
        );
        setLoading(false);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        // Clean up any event listeners or resources if needed
      }
    };
  }, [center, zoom, markers, onMapClick, onMarkerClick, onMapLoad]);

  if (error) {
    return (
      <Box
        sx={{
          height,
          width,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", height, width }}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255, 255, 255, 0.7)",
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        ref={mapRef}
        sx={{
          height: "100%",
          width: "100%",
          borderRadius: 1,
          overflow: "hidden",
        }}
      />
    </Box>
  );
};

export default GoogleMapComponent;
