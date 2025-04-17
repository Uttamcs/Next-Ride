/**
 * This file provides mock implementations of Google Maps API functionality
 * for development and testing when the actual Google Maps API is not available
 * or when you want to avoid making actual API calls.
 */

// Mock Google Maps API
export const createMockGoogleMapsApi = () => {
  // Create a mock LatLng class
  class LatLng {
    constructor(lat, lng) {
      this.lat = lat;
      this.lng = lng;
    }

    lat() {
      return this.lat;
    }

    lng() {
      return this.lng;
    }

    toString() {
      return `(${this.lat}, ${this.lng})`;
    }
  }

  // Create a mock Size class
  class Size {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }
  }

  // Create a mock Map class
  class Map {
    constructor(mapDiv, options) {
      this.mapDiv = mapDiv;
      this.options = options;
      this.center = options.center;
      this.zoom = options.zoom;
      this.markers = [];
      this.listeners = {};
      
      // Create a simple visual representation of the map
      if (mapDiv) {
        mapDiv.style.backgroundColor = '#e5e3df';
        mapDiv.style.position = 'relative';
        mapDiv.style.overflow = 'hidden';
        mapDiv.style.display = 'flex';
        mapDiv.style.justifyContent = 'center';
        mapDiv.style.alignItems = 'center';
        
        const mapText = document.createElement('div');
        mapText.textContent = 'Mock Google Map';
        mapText.style.color = '#666';
        mapText.style.fontSize = '16px';
        mapText.style.fontFamily = 'Arial, sans-serif';
        
        mapDiv.appendChild(mapText);
      }
    }

    setCenter(latLng) {
      this.center = latLng;
    }

    setZoom(zoom) {
      this.zoom = zoom;
    }

    fitBounds(bounds) {
      this.bounds = bounds;
    }

    addListener(event, callback) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
      return { remove: () => {} };
    }
  }

  // Create a mock Marker class
  class Marker {
    constructor(options) {
      this.position = options.position;
      this.map = options.map;
      this.title = options.title;
      this.icon = options.icon;
      this.listeners = {};
      
      if (this.map) {
        this.map.markers.push(this);
      }
    }

    setMap(map) {
      this.map = map;
    }

    setPosition(latLng) {
      this.position = latLng;
    }

    addListener(event, callback) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
      return { remove: () => {} };
    }
  }

  // Create a mock LatLngBounds class
  class LatLngBounds {
    constructor() {
      this.bounds = {
        north: -Infinity,
        south: Infinity,
        east: -Infinity,
        west: Infinity
      };
    }

    extend(latLng) {
      const lat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
      const lng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;
      
      this.bounds.north = Math.max(this.bounds.north, lat);
      this.bounds.south = Math.min(this.bounds.south, lat);
      this.bounds.east = Math.max(this.bounds.east, lng);
      this.bounds.west = Math.min(this.bounds.west, lng);
      
      return this;
    }

    getCenter() {
      return new LatLng(
        (this.bounds.north + this.bounds.south) / 2,
        (this.bounds.east + this.bounds.west) / 2
      );
    }
  }

  // Create a mock DirectionsService class
  class DirectionsService {
    route(request, callback) {
      setTimeout(() => {
        const origin = request.origin;
        const destination = request.destination;
        
        // Calculate a mock distance and duration
        const lat1 = typeof origin.lat === 'function' ? origin.lat() : origin.lat;
        const lng1 = typeof origin.lng === 'function' ? origin.lng() : origin.lng;
        const lat2 = typeof destination.lat === 'function' ? destination.lat() : destination.lat;
        const lng2 = typeof destination.lng === 'function' ? destination.lng() : destination.lng;
        
        const distance = this.calculateDistance(lat1, lng1, lat2, lng2);
        const duration = Math.round(distance * 2); // Rough estimate: 2 minutes per km
        
        const result = {
          routes: [{
            legs: [{
              distance: { text: distance.toFixed(1) + ' km', value: distance * 1000 },
              duration: { text: duration + ' mins', value: duration * 60 },
              start_location: new LatLng(lat1, lng1),
              end_location: new LatLng(lat2, lng2),
              steps: []
            }],
            overview_path: [
              new LatLng(lat1, lng1),
              new LatLng((lat1 + lat2) / 2, (lng1 + lng2) / 2),
              new LatLng(lat2, lng2)
            ]
          }]
        };
        
        callback(result, 'OK');
      }, 500); // Simulate network delay
    }
    
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the earth in km
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) *
          Math.cos(this.deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance;
    }
    
    deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
  }

  // Create a mock DirectionsRenderer class
  class DirectionsRenderer {
    constructor(options) {
      this.options = options;
      this.map = options?.map;
      this.directions = null;
    }

    setMap(map) {
      this.map = map;
    }

    setDirections(directions) {
      this.directions = directions;
    }
  }

  // Create a mock Geocoder class
  class Geocoder {
    geocode(request, callback) {
      setTimeout(() => {
        if (request.address) {
          // Mock geocoding an address to coordinates
          const result = {
            results: [{
              geometry: {
                location: new LatLng(40.7128, -74.006) // Default to NYC
              },
              formatted_address: request.address
            }],
            status: 'OK'
          };
          callback(result.results, result.status);
        } else if (request.location) {
          // Mock reverse geocoding coordinates to an address
          const result = {
            results: [{
              formatted_address: '123 Mock Address, New York, NY 10001'
            }],
            status: 'OK'
          };
          callback(result.results, result.status);
        }
      }, 500); // Simulate network delay
    }
  }

  // Create a mock Places service
  class PlacesService {
    constructor(map) {
      this.map = map;
    }
    
    findPlaceFromQuery(request, callback) {
      setTimeout(() => {
        const results = [{
          name: request.query,
          geometry: {
            location: new LatLng(40.7128, -74.006) // Default to NYC
          }
        }];
        callback(results, 'OK');
      }, 500);
    }
  }

  // Create a mock Autocomplete class
  class Autocomplete {
    constructor(input, options) {
      this.input = input;
      this.options = options;
      this.listeners = {};
      
      // Add basic styling to the input
      if (input) {
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        input.style.padding = '8px';
        input.style.width = '100%';
      }
    }
    
    addListener(event, callback) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
      
      // For place_changed event, add an input event listener
      if (event === 'place_changed' && this.input) {
        this.input.addEventListener('input', () => {
          // Simulate place_changed event after user stops typing
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.listeners[event].forEach(cb => cb());
          }, 1000);
        });
      }
      
      return { remove: () => {} };
    }
    
    getPlace() {
      return {
        name: this.input.value,
        geometry: {
          location: new LatLng(40.7128, -74.006) // Default to NYC
        },
        formatted_address: this.input.value
      };
    }
  }

  // Return the mock Google Maps API
  return {
    maps: {
      Map,
      Marker,
      LatLng,
      LatLngBounds,
      Size,
      DirectionsService,
      DirectionsRenderer,
      Geocoder,
      places: {
        PlacesService,
        Autocomplete
      },
      TravelMode: {
        DRIVING: 'DRIVING',
        WALKING: 'WALKING',
        BICYCLING: 'BICYCLING',
        TRANSIT: 'TRANSIT'
      },
      Animation: {
        DROP: 'DROP',
        BOUNCE: 'BOUNCE'
      }
    }
  };
};

// Function to inject the mock Google Maps API into the window object
export const injectMockGoogleMapsApi = () => {
  if (!window.google) {
    window.google = createMockGoogleMapsApi();
    console.log('Mock Google Maps API injected');
  }
};

export default {
  createMockGoogleMapsApi,
  injectMockGoogleMapsApi
};
