// src/config/apiConfig.ts

/**
 * API configuration for the space debris tracking backend
 */
const apiConfig = {
  // Base URL for the API - update this to your actual Spring Boot backend URL
  baseUrl: 'http://localhost:8080',
  
  // Endpoints from your Spring Boot controllers
  endpoints: {
    // Orbit Controller endpoints
    realTimeOrbits: '/api/orbit/realtime',
    predictOrbit: '/api/orbit/predict',
    
    // Home Controller endpoints
    tleByType: '/api/tle/by-type',
    latestTle: '/api/tle/latest',
    latestTlePerObject: '/api/tle/latest-per-object',
    welcome: '/api/tle/welcome',
    
    // TleFetch Controller endpoints
    fetch: '/api/tle/fetch'
  },
  
  // Request settings
  requestSettings: {
    // Time in milliseconds to wait before considering a request timed out
    timeout: 10000,
    
    // Time in milliseconds between polling for real-time updates
    pollingInterval: 5000, // 5 seconds for real-time updates
  },
  
  // CORS configuration
  // This is for reference only - actual CORS settings must be configured in your Spring Boot backend
  corsSettings: {
    allowedOrigins: ['http://localhost:5173', 'http://localhost:8080'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*'],
    allowCredentials: true
  }
};

export default apiConfig;