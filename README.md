<div align="center">
  <img src="assets/logo.png" alt="SpaceShield Logo" width="300"/>
  <h1>SpaceShield</h1>
  <p>A comprehensive space debris monitoring and collision prediction system</p>
</div>

## Overview

SpaceShield is an advanced application designed for real-time monitoring, visualization, and analysis of space debris and orbital objects. With the increasing population of satellites and debris in Earth's orbit, this tool provides critical insights for space agencies, researchers, and enthusiasts to track potential collision risks and monitor space traffic.

## Features

* **Real-time 3D Visualization**
   * Interactive Earth visualization with realistic textures and lighting
   * Accurate orbital paths for satellites and debris
   * Zoom, pan, and rotate controls for detailed examination
   * Color-coded objects based on type and risk level
   * Time-based simulation of orbital movements

* **Comprehensive Monitoring**
   * Track over 20,000 objects in various Earth orbits
   * Filter and search capabilities by object type, altitude, and inclination
   * Detailed information display for individual objects
   * Historical tracking data for trajectory analysis
   * Custom object grouping and categorization

* **Collision Prediction**
   * Machine learning algorithms for collision probability assessment
   * Up to 72-hour advance warning of potential collisions
   * Conjunction analysis with confidence intervals
   * Risk assessment based on object size, velocity, and trajectory
   * Visualization of close approach scenarios

* **Alert Management**
   * Customizable alert thresholds based on probability and distance
   * Multi-channel notifications (in-app, email, push)
   * Alert history and resolution tracking
   * Escalation protocols for critical situations
   * Integration with emergency response systems

* **Statistical Analysis**
   * Comprehensive analytics on orbital object populations
   * Density maps of debris concentrations
   * Trend analysis of space debris growth
   * Orbit decay predictions
   * Interactive charts and data visualizations

## Tech Stack

### Backend
* **Java** with Spring Boot
* **Spring Data JPA** for database operations
* **Spring WebSocket** for real-time updates
* **Orekit** for precise orbital calculations
* **MySQL/PostgreSQL** for data persistence

### Frontend
* **React** with TypeScript
* **Three.js** and **React Three Fiber** for 3D visualization
* **Recharts** for data visualization
* **Tailwind CSS** for styling
* **Axios** for API communication
* **WebSocket** for real-time updates

## Technical Architecture

The application follows a microservices architecture with clear separation of concerns:

### Backend Services
* **Data Acquisition Service**: Fetches and processes TLE data from various sources
* **Orbit Calculation Engine**: Uses Orekit for precise orbital propagation and position calculation
* **Collision Detection System**: Analyzes object trajectories for potential conjunctions
* **Alert Management Service**: Handles alert generation, notification, and status tracking
* **WebSocket Server**: Provides real-time updates to connected clients
* **REST API Layer**: Exposes backend functionality to the frontend

### Frontend Components
* **3D Visualization Module**: Built with Three.js for rendering Earth and orbital objects
* **Real-time Dashboard**: Shows current system status and critical alerts
* **Monitoring Interface**: Allows detailed examination of orbital objects
* **Alert Management UI**: For configuring and responding to alerts
* **Analytics Dashboard**: Provides statistical insights and trends
* **Settings Panel**: For system configuration and customization

## Data Sources

SpaceShield aggregates data from multiple authoritative sources:

* **Space-Track**: Primary source for TLE data and satellite catalog
* **NASA Debris Database**: Additional information on debris objects
* **ESA DISCOS**: European Space Agency's Database and Information System Characterising Objects in Space
* **NORAD**: North American Aerospace Defense Command catalog
* **CelesTrak**: Supplementary TLE and satellite information

## Getting Started

### Prerequisites
* Java 17 or higher
* Node.js 16 or higher
* MySQL or PostgreSQL

### System Requirements
* **Backend**:
   * Java 17 or higher
   * 8GB RAM minimum (16GB recommended)
   * 100GB storage for database
   * Multi-core processor recommended for orbital calculations

* **Frontend**:
   * Modern web browser with WebGL support
   * 8GB RAM recommended for 3D visualization
   * GPU acceleration for optimal performance

### Backend Setup
1. Clone the repository

```bash
git clone https://github.com/m-elhamlaoui/development-platform-team-ahsan-nas.git
cd spaceshield/backend
```

2. Configure database in `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/spaceshield
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Run the Spring Boot application

```bash
./mvnw spring-boot:run
```

### Frontend Setup
1. Navigate to the frontend directory

```bash
cd ../frontend
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file with backend URL

```
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_BASE_URL=ws://localhost:8080/ws
```

4. Start the development server

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Deployment

### Build Frontend

```bash
cd frontend
npm run build
```

### Package Application

```bash
cd backend
./mvnw package
```

The resulting JAR file can be deployed to any Java-capable server.

## Security Features
* **Data Encryption**: All communications secured via TLS/SSL
* **Authentication**: User authentication via JWT tokens
* **Authorization**: Role-based access control for different system functions
* **Input Validation**: Comprehensive validation to prevent injection attacks
* **Audit Logging**: Tracking of critical operations for security oversight

## Screenshots
<div align="center">
  <img src="assets/page1.png" alt="Dashboard" width="800"/>
  <p><em>Main dashboard showing Earth visualization and orbital objects</em></p>
</div>

<div align="center">
  <img src="assets/alert.png" alt="Monitoring Panel" width="800"/>
  <p><em>Monitoring panel with detailed object information</em></p>
</div>

<div align="center">
  <img src="assets/stats.png" alt="Statistics" width="800"/>
  <p><em>Statistical analysis of orbital objects</em></p>
</div>


## Future Plans
* Mobile application for on-the-go monitoring
* Integration with additional space object catalogs
* Advanced collision avoidance recommendations
* Historical trend analysis
* Space weather impact analysis

## Contributors
* **ELGARCH Youssef** - Visualization & Frontend Dev
* **IBNOU-KADY Nisrine** - Data Processign & Alert System 
* **BAZZAOUI Youness** - System Architecture & Database Design
* **TOUZANI Youssef** - Backend Development & Orbital Mechanics

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
* Data provided by Space-Track.org
* Orbital computations powered by Orekit
* 3D visualization enabled by Three.js
* Earth textures courtesy of NASA
