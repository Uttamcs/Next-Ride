// Utility functions for handling offline mode

// Check if the app is in offline mode
export const isOfflineMode = () => {
  // Check if we're using mock data (offline mode)
  const token = localStorage.getItem('token');
  return token && token.startsWith('mock-');
};

// Get offline status from localStorage or navigator
export const isOffline = () => {
  // First check if we're using mock data
  if (isOfflineMode()) {
    return true;
  }
  
  // Then check browser's online status
  return !navigator.onLine;
};

export default {
  isOfflineMode,
  isOffline
};
