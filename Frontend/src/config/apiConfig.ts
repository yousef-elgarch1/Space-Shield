
/**
 * API configuration for the debris tracking backend
 */
const apiConfig = {
  // Base URL for the API - update this to your actual Spring Boot backend URL
  baseUrl: 'http://localhost:8080/api',
  
  // Endpoints from your Spring Boot controllers
  endpoints: {
    realTimeOrbits: '/orbit/realtime',
    tleByType: '/tle/by-type',
    latestTle: '/tle/latest',
    latestTlePerObject: '/tle/latest-per-object',
    welcome: '/tle/welcome',
    fetch: '/tle/fetch'
  },
  
  // Request settings
  requestSettings: {
    // Time in milliseconds to wait before considering a request timed out
    timeout: 10000,
    
    // Time in milliseconds between polling for real-time updates
    pollingInterval: 5000, // Reduced to 5 seconds for more real-time updates
  }
};

/**
 * NOTE: MySQL Database Connection
 * 
 * Database credentials should NOT be stored in the frontend code.
 * They should be configured in your Spring Boot application's 
 * application.properties or application.yml file on the server side.
 * 
 * Example Spring Boot configuration (application.properties):
 * 
 * spring.datasource.url=jdbc:mysql://localhost:3306/spaceshieldDB
 * spring.datasource.username=your_mysql_username
 * spring.datasource.password=your_mysql_password
 * spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
 * spring.jpa.hibernate.ddl-auto=update
 * spring.jpa.show-sql=true
 */

export default apiConfig;
