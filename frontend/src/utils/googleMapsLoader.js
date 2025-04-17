import { GOOGLE_MAPS_API_KEY } from '../config/keys';

// Global state to track loading status
let isLoading = false;
let isLoaded = false;
let loadError = null;
const callbacks = [];

/**
 * Loads the Google Maps API with the required libraries
 * @param {Function} callback - Function to call when the API is loaded
 * @returns {Promise} - Promise that resolves when the API is loaded
 */
export const loadGoogleMapsApi = (callback) => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.google && window.google.maps) {
      isLoaded = true;
      if (callback) callback();
      resolve(window.google.maps);
      return;
    }

    // If already loading, add to callback queue
    if (isLoading) {
      if (callback) callbacks.push(callback);
      callbacks.push((maps) => resolve(maps));
      callbacks.push((error) => reject(error));
      return;
    }

    // Start loading
    isLoading = true;
    
    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&callback=googleMapsCallback`;
    script.async = true;
    script.defer = true;
    
    // Define callback function
    window.googleMapsCallback = () => {
      console.log('Google Maps API loaded successfully');
      isLoaded = true;
      isLoading = false;
      
      // Call all callbacks
      if (callback) callback(window.google.maps);
      callbacks.forEach(cb => {
        try {
          if (typeof cb === 'function') cb(window.google.maps);
        } catch (e) {
          console.error('Error in Google Maps callback:', e);
        }
      });
      
      resolve(window.google.maps);
    };
    
    // Handle errors
    script.onerror = (error) => {
      console.error('Failed to load Google Maps API:', error);
      loadError = error;
      isLoading = false;
      
      // Call error callbacks
      callbacks.forEach(cb => {
        if (typeof cb === 'function') cb(error);
      });
      
      reject(error);
    };
    
    // Add script to document
    document.head.appendChild(script);
  });
};

/**
 * Checks if the Google Maps API is loaded
 * @returns {Boolean} - True if the API is loaded
 */
export const isGoogleMapsLoaded = () => {
  return isLoaded && window.google && window.google.maps;
};

/**
 * Gets the Google Maps API error if any
 * @returns {Error|null} - The error or null
 */
export const getGoogleMapsError = () => {
  return loadError;
};

export default {
  loadGoogleMapsApi,
  isGoogleMapsLoaded,
  getGoogleMapsError
};
