import { useEffect, useState, useRef } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  Alert,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import { GOOGLE_MAPS_API_KEY } from "../config/keys";
import { injectMockGoogleMapsApi } from "../services/mock-maps.service";
import FallbackMap from "./FallbackMap";

const MapComponent = ({
  origin,
  destination,
  captainLocation,
  onOriginChange,
  onDestinationChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const mapRef = useRef(null);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      // Check if Google Maps API is already loaded
      if (window.google && window.google.maps) {
        console.log("Google Maps API already loaded");
        setMapLoaded(true);
        return;
      }

      // Try to load the actual Google Maps API
      try {
        console.log("Loading Google Maps API script");
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log("Google Maps API loaded successfully");
          setMapLoaded(true);
        };
        script.onerror = (e) => {
          console.error("Failed to load Google Maps API:", e);
          console.log("Falling back to mock Google Maps API");
          // Inject mock Google Maps API
          injectMockGoogleMapsApi();
          setMapLoaded(true);
        };

        // Set a timeout to fall back to mock API if loading takes too long
        const timeoutId = setTimeout(() => {
          if (!window.google || !window.google.maps) {
            console.log("Google Maps API loading timed out, using mock API");
            injectMockGoogleMapsApi();
            setMapLoaded(true);
          }
        }, 5000); // 5 second timeout

        document.head.appendChild(script);

        // Clear timeout on cleanup
        return () => clearTimeout(timeoutId);
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
        // Fall back to mock API
        injectMockGoogleMapsApi();
        setMapLoaded(true);
      }
    };

    const cleanup = loadGoogleMapsScript();

    // Cleanup function
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // Initialize map when API is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    try {
      const mapOptions = {
        center: { lat: 28.6139, lng: 77.209 }, // Default to Delhi, India
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);

      const newDirectionsRenderer = new window.google.maps.DirectionsRenderer({
        map: newMap,
        suppressMarkers: true, // We'll add custom markers
        polylineOptions: {
          strokeColor: "#4285F4",
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      });
      setDirectionsRenderer(newDirectionsRenderer);
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Error initializing map. Please refresh the page.");
    }
  }, [mapLoaded]);

  // Set initial location based on user's position
  useEffect(() => {
    if (navigator.geolocation && !origin && mapLoaded) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (onOriginChange) {
            onOriginChange({
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            });
          }

          // Center map on user's location
          if (map) {
            map.setCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Could not access your location. Please enable location services."
          );
        }
      );
    }
  }, [mapLoaded, map, origin, onOriginChange]);

  // Update map with route when origin and destination are set
  useEffect(() => {
    if (!mapLoaded || !map || !directionsRenderer || !origin || !destination)
      return;

    calculateRouteInfo();

    // Add markers for origin and destination
    const originMarker = new window.google.maps.Marker({
      position: { lat: origin.latitude, lng: origin.longitude },
      map,
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
        scaledSize: new window.google.maps.Size(40, 40),
      },
      title: "Pickup Location",
    });

    const destinationMarker = new window.google.maps.Marker({
      position: { lat: destination.latitude, lng: destination.longitude },
      map,
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new window.google.maps.Size(40, 40),
      },
      title: "Destination",
    });

    // Calculate and display route
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: origin.latitude, lng: origin.longitude },
        destination: { lat: destination.latitude, lng: destination.longitude },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);

          // Extract distance and duration from directions result
          const route = result.routes[0];
          if (route && route.legs && route.legs[0]) {
            setDistance(route.legs[0].distance.text);
            setDuration(route.legs[0].duration.text);
          }
        } else {
          console.error("Directions request failed:", status);
          // Fall back to simple calculation
          calculateSimpleRouteInfo();
        }
      }
    );

    // Fit bounds to include both markers
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: origin.latitude, lng: origin.longitude });
    bounds.extend({ lat: destination.latitude, lng: destination.longitude });
    map.fitBounds(bounds);

    // Create an array to track all markers for cleanup
    const markers = [originMarker, destinationMarker];

    // Add captain marker if available
    if (captainLocation) {
      // Create captain marker and add to cleanup on unmount
      const captainMarker = new window.google.maps.Marker({
        position: {
          lat: captainLocation.latitude,
          lng: captainLocation.longitude,
        },
        map,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        },
        title: "Captain",
      });

      // Add to markers array for cleanup
      markers.push(captainMarker);
    }

    // Cleanup function to remove all markers when component unmounts
    return () => {
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [
    mapLoaded,
    map,
    directionsRenderer,
    origin,
    destination,
    captainLocation,
  ]);

  // Simple distance calculation using Haversine formula (fallback)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Fallback route calculation if Google Directions API fails
  const calculateSimpleRouteInfo = () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate distance using Haversine formula
      const distanceInKm = calculateDistance(
        origin.latitude,
        origin.longitude,
        destination.latitude,
        destination.longitude
      );

      // Estimate duration (assuming average speed of 30 km/h)
      const durationInMinutes = Math.round((distanceInKm / 30) * 60);

      setDistance(distanceInKm.toFixed(2) + " km");
      setDuration(durationInMinutes + " mins");
    } catch (error) {
      console.error("Error calculating route:", error);
      setError("Error calculating route information.");
    } finally {
      setLoading(false);
    }
  };

  // Original route calculation method (kept for compatibility)
  const calculateRouteInfo = () => {
    if (!mapLoaded) {
      calculateSimpleRouteInfo();
      return;
    }

    setLoading(true);
    // The actual calculation is now handled in the useEffect that sets up the route
  };

  // Determine if we should show the fallback map
  const showFallbackMap = error || (!mapLoaded && origin && destination);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {error && !showFallbackMap && (
        <Alert
          severity="error"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            right: 10,
            zIndex: 1000,
          }}
        >
          {error}
        </Alert>
      )}

      {showFallbackMap ? (
        // Show fallback map when there's an error or when we have origin/destination but map isn't loaded
        <FallbackMap
          origin={{ address: origin ? "Your location" : "Not set" }}
          destination={{
            address: destination ? "Your destination" : "Not set",
          }}
          distance={distance}
          duration={duration}
        />
      ) : (
        // Show actual Google Map
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.default",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Google Map */}
          <Box
            ref={mapRef}
            sx={{
              flex: 1,
              position: "relative",
            }}
          >
            {/* Fallback content if map is not loaded */}
            {!mapLoaded && (
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "#1A2027" : "#E3F2FD",
                }}
              >
                <CircularProgress size={40} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Loading map...
                </Typography>
              </Box>
            )}
          </Box>

          {/* Route information */}
          {origin && destination && (
            <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
              <Stack
                direction="row"
                spacing={2}
                divider={<Divider orientation="vertical" flexItem />}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Distance
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {distance}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {duration}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Route
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" noWrap>
                    {origin && destination ? "Direct route" : "Not available"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </Paper>
      )}

      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            bgcolor: "background.paper",
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <CircularProgress size={30} thickness={4} />
        </Box>
      )}
    </Box>
  );
};

export default MapComponent;
