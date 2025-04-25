# NextDrive - Ride Booking Application

A modern ride booking and rental service web application built with the MERN stack.

## Environment Setup

### API Keys

The application uses several API keys that should be stored in environment variables for security. Create a `.env` file in the root of the frontend directory with the following variables:

```
# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Backend API URL (if different from default)
VITE_API_BASE_URL=http://your-backend-url/api
```

### Google Maps API Key

The application uses Google Maps for displaying maps and location services. To set up your Google Maps API key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API
4. Create an API key with appropriate restrictions:
   - HTTP referrers (websites): Add your domain
   - API restrictions: Restrict to the APIs listed above
5. Copy the API key to your `.env` file as `VITE_GOOGLE_MAPS_API_KEY`

### API Key Security

For production deployment, ensure you:

1. Set up proper HTTP referrer restrictions on your API keys
2. Do not commit `.env` files to version control
3. Set up environment variables in your hosting platform (Vercel, Netlify, etc.)
4. Consider using a proxy server for sensitive API calls

## Development

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Configuration

The application configuration is centralized in `src/config/index.js`. This file exports all environment variables and application settings.

To add a new configuration value:

1. Add it to the appropriate `.env` file
2. Import and export it in `src/config/index.js`
3. Import it from the config file in your components

Example:

```javascript
// In .env
VITE_NEW_API_KEY = your_api_key;

// In src/config/index.js
export const NEW_API_KEY = import.meta.env.VITE_NEW_API_KEY;

// In your component
import { NEW_API_KEY } from "../config";
```

This ensures all configuration is managed in one place and makes it easier to update settings across the application.
