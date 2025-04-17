import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { LocationOn, Search, MyLocation } from "@mui/icons-material";
import { loadGoogleMapsApi } from "../../utils/googleMapsLoader";
import GoogleMapComponent from "./GoogleMapComponent";

const LocationPicker = ({
  label = "Location",
  placeholder = "Enter a location",
  value = "",
  onChange,
  showMap = true,
  mapHeight = 300,
  required = false,
  error = false,
  helperText = "",
  fullWidth = true,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.209 }); // Default to Delhi, India
  const [apiError, setApiError] = useState(null);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const sessionToken = useRef(null);

  // Initialize Google Places Autocomplete service
  useEffect(() => {
    const initPlacesAPI = async () => {
      try {
        // Load Google Maps API
        await loadGoogleMapsApi();

        console.log("Google Maps API loaded, initializing Places services");

        if (
          !window.google ||
          !window.google.maps ||
          !window.google.maps.places
        ) {
          throw new Error("Google Maps Places API not available");
        }

        if (!sessionToken.current) {
          sessionToken.current =
            new window.google.maps.places.AutocompleteSessionToken();
          console.log("Session token created");
        }

        if (!autocompleteService.current) {
          autocompleteService.current =
            new window.google.maps.places.AutocompleteService();
          console.log("Autocomplete service initialized");
        }

        setApiError(null);
      } catch (error) {
        console.error("Error initializing Places API:", error);
        setApiError("Could not load location search. Please try again later.");
      }
    };

    initPlacesAPI();
  }, []);

  // Handle map load
  const handleMapLoad = (map) => {
    try {
      if (
        !placesService.current &&
        window.google &&
        window.google.maps &&
        window.google.maps.places
      ) {
        placesService.current = new window.google.maps.places.PlacesService(
          map
        );
        console.log("Places service initialized");
      }
    } catch (error) {
      console.error("Error initializing Places service:", error);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value) {
      setPredictions([]);
      return;
    }

    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.log("Google Maps API not loaded yet, trying to load it");
      loadGoogleMapsApi()
        .then(() => {
          if (
            !autocompleteService.current &&
            window.google &&
            window.google.maps &&
            window.google.maps.places
          ) {
            autocompleteService.current =
              new window.google.maps.places.AutocompleteService();
            console.log("Autocomplete service initialized after delayed load");
            // Try again after initializing
            handleInputChange(e);
          }
        })
        .catch((err) => {
          console.error("Failed to load Google Maps API:", err);
          setApiError(
            "Could not load location search. Please try again later."
          );
        });
      return;
    }

    if (autocompleteService.current) {
      setLoading(true);
      try {
        autocompleteService.current.getPlacePredictions(
          {
            input: value,
            sessionToken:
              sessionToken.current ||
              new window.google.maps.places.AutocompleteSessionToken(),
            componentRestrictions: { country: "in" }, // Restrict to India
          },
          (results, status) => {
            setLoading(false);
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              results
            ) {
              console.log("Got predictions:", results.length);
              setPredictions(results);
            } else {
              console.log("No predictions found, status:", status);
              setPredictions([]);
            }
          }
        );
      } catch (error) {
        console.error("Error getting place predictions:", error);
        setLoading(false);
        setPredictions([]);
      }
    } else {
      console.error("Autocomplete service not available");
    }
  };

  // Handle prediction selection
  const handlePredictionSelect = (prediction) => {
    setInputValue(prediction.description);
    setPredictions([]);

    if (placesService.current) {
      placesService.current.getDetails(
        {
          placeId: prediction.place_id,
          fields: ["geometry", "formatted_address", "name"],
          sessionToken: sessionToken.current,
        },
        (place, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            place
          ) {
            const location = {
              address: place.formatted_address || prediction.description,
              name: place.name,
              placeId: prediction.place_id,
              coordinates: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
            };

            setSelectedLocation(location);
            setMapCenter(location.coordinates);

            if (onChange) {
              onChange(location);
            }

            // Generate a new session token after a selection
            sessionToken.current =
              new window.google.maps.places.AutocompleteSessionToken();
          }
        }
      );
    }
  };

  // Handle map click
  const handleMapClick = async (coords) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: coords }, (results, status) => {
          if (status === "OK") {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });

      if (response && response.length > 0) {
        const place = response[0];
        setInputValue(place.formatted_address);

        const location = {
          address: place.formatted_address,
          name: place.formatted_address,
          placeId: place.place_id,
          coordinates: coords,
        };

        setSelectedLocation(location);

        if (onChange) {
          onChange(location);
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setMapCenter(coords);
          handleMapClick(coords);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      <TextField
        label={label}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        fullWidth={fullWidth}
        required={required}
        error={error || !!apiError}
        helperText={helperText}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <MyLocation
                  sx={{ cursor: "pointer" }}
                  onClick={getCurrentLocation}
                  color="primary"
                />
              )}
            </InputAdornment>
          ),
        }}
      />

      {predictions.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            mt: 1,
            maxHeight: 200,
            overflow: "auto",
            position: "absolute",
            zIndex: 1000,
            width: fullWidth ? "100%" : 300,
          }}
        >
          <List dense>
            {predictions.map((prediction) => (
              <ListItem
                key={prediction.place_id}
                button
                onClick={() => handlePredictionSelect(prediction)}
              >
                <ListItemIcon>
                  <LocationOn color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={prediction.structured_formatting.main_text}
                  secondary={prediction.structured_formatting.secondary_text}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {showMap && (
        <Box sx={{ mt: 2 }}>
          <GoogleMapComponent
            height={mapHeight}
            center={mapCenter}
            zoom={15}
            markers={
              selectedLocation
                ? [
                    {
                      position: selectedLocation.coordinates,
                      title: selectedLocation.name,
                    },
                  ]
                : []
            }
            onMapClick={handleMapClick}
            onMapLoad={handleMapLoad}
          />
        </Box>
      )}
    </Box>
  );
};

export default LocationPicker;
