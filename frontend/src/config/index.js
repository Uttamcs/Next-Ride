/**
 * Application configuration
 * This file centralizes all environment variables and configuration settings
 */

// API keys
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Map default settings
export const DEFAULT_MAP_CENTER = {
  lat: 20.5937, // Center of India
  lng: 78.9629
};

export const DEFAULT_MAP_ZOOM = 5;

// Other configuration settings
export const APP_NAME = 'NextDrive';
export const SUPPORT_EMAIL = 'support@nextdrive.com';
export const SUPPORT_PHONE = '+91 1234567890';

export default {
  GOOGLE_MAPS_API_KEY,
  API_BASE_URL,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  APP_NAME,
  SUPPORT_EMAIL,
  SUPPORT_PHONE
};
