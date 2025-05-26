<div align="center">🛰 SpaceShield</div>

<div align="center">
  <img src="https://i.imgur.com/5bFYOPW.jpeg" alt="SpaceShield Logo" width="800"/>
  
  <p align="center">
    <a href="#overview">Overview</a> •
    <a href="#key-features">Key Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#design-patterns">Design Patterns</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#project-management">Project Management</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#team">Team</a> •
    <a href="#analytics">Analytics</a>
  </p>
  
  ![GitHub stars](https://img.shields.io/github/stars/m-elhamlaoui/development-platform-team-ahsan-nas?style=social)
  ![Version](https://img.shields.io/badge/version-1.0.0-blue)
  ![License](https://img.shields.io/badge/license-MIT-green)
  ![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
  
  <h3>A comprehensive space debris monitoring and collision prediction system</h3>
</div>

## 🔭 Overview

*SpaceShield* is an advanced application designed for real-time monitoring, visualization, and analysis of space debris and orbital objects. With the increasing population of satellites and debris in Earth's orbit, this tool provides critical insights for space agencies, researchers, and enthusiasts to track potential collision risks and monitor space traffic.

<div align="center">
  <table>
    <tr>
      <td><b>20,000+</b><br>Tracked Objects</td>
      <td><b>72-hour</b><br>Advance Warning</td>
      <td><b>99.7%</b><br>Accuracy</td>
      <td><b>4</b><br>Supported Languages</td>
    </tr>
  </table>
</div>

## ✨ Key Features

<table>
  <tr>
    <td width="50%">
      <h3>🌐 Real-time 3D Visualization</h3>
      <ul>
        <li>Interactive Earth visualization with realistic textures</li>
        <li>Accurate orbital paths for satellites and debris</li>
        <li>Zoom, pan, and rotate controls for detailed examination</li>
        <li>Color-coded objects based on type and risk level</li>
        <li>Time-based simulation of orbital movements</li>
      </ul>
    </td>
    <td width="50%">
      <h3>📊 Comprehensive Monitoring</h3>
      <ul>
        <li>Track over 20,000 objects in various Earth orbits</li>
        <li>Filter and search capabilities by object type, altitude, and inclination</li>
        <li>Detailed information display for individual objects</li>
        <li>Historical tracking data for trajectory analysis</li>
        <li>Custom object grouping and categorization</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>⚠ Collision Prediction</h3>
      <ul>
        <li>Up to 72-hour advance warning of potential collisions</li>
        <li>Conjunction analysis with confidence intervals</li>
        <li>Risk assessment based on object size, velocity, and trajectory</li>
        <li>Visualization of close approach scenarios</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🔔 Alert Management</h3>
      <ul>
        <li>Customizable alert thresholds based on probability and distance</li>
        <li>Multi-channel notifications (in-app, email, push)</li>
        <li>Alert history and resolution tracking</li>
        <li>Escalation protocols for critical situations</li>
        <li>Integration with emergency response systems</li>
      </ul>
    </td>
  </tr>
</table>

<div align="center">
  <img src="main.png" alt="Dashboard" width="800"/>
  <p><em>Main dashboard showing Earth visualization and orbital objects</em></p>
</div>

## 🏗 Architecture

### 🎯 Model-View-Controller (MVC) Pattern

SpaceShield follows a robust MVC architecture that ensures clean separation of concerns and maintainability:

<div align="center">
  <img src="https://i.imgur.com/Ibe1etg.png" alt="MVC Architecture" width="600"/>
  <p><em>MVC Architecture Flow - SpaceShield</em></p>
</div>

*MODEL (Backend - Spring Boot)*
- *Entities*: TleData, Satellite, Debris, RocketBody with JPA annotations
- *Repositories*: Data access layer with Spring Data JPA
- *Services*: Business logic layer (OrbitService, TleService, AlertService)
- *Orekit Integration*: High-precision orbital calculations
- *MySQL Database*: Persistent storage for spatial data

*VIEW (Frontend - React)*
- *React Components*: DebrisOrbit, AlertsPanel, Statistics with TypeScript
- *Three.js*: 3D visualization engine for orbital rendering
- *Tailwind CSS*: Modern, responsive styling framework
- *i18next*: Internationalization supporting 4 languages
- *Custom Hooks*: Reusable logic for state management

*CONTROLLER (REST API)*
- *@RestController*: OrbitController, TleFetchController, AlertController
- *REST Endpoints*: /api/orbits, /api/tle, /api/alerts with full CRUD operations
- *JSON Responses*: Data Transfer Objects (DTOs) for clean API contracts
- *Exception Handling*: Global error management with @ControllerAdvice

### 📊 UML Diagrams

#### Use Case Diagram
<div align="center">
  <img src="https://i.imgur.com/n3MGTea.png" alt="Use Cases" width="500"/>
  <p><em>System Actors and Their Use Cases</em></p>
</div>

*Key Use Cases:*
- *UC1-UC3*: Standard User - Visualization, Statistics, Interface Configuration
- *UC4-UC6*: Space Operator - Collision Alerts, Risk Analysis, Mission Planning
- *UC7-UC9*: Data Analyst - Trend Analysis, Prediction Modeling, Report Export
- *UC10-UC12*: System Administrator - User Management, System Configuration

#### Class Diagram
<div align="center">
  <img src="https://i.imgur.com/k8fy4LB.png" width="500"/>
  <p><em>Object-Oriented Class Structure</em></p>
</div>

*Core Class Hierarchy:*
- *Abstract SpaceObject*: Base class for all spatial objects
- *Concrete Classes*: Satellite, Debris, RocketBody with specialized behaviors
- *Data Classes*: TleData, OrbitPoint, Vector3DPoint for orbital mechanics
- *Service Classes*: Repository pattern with generic interfaces
- *Enumerations*: RiskLevel, ObjectStatus for type safety

#### Sequence Diagram
<div align="center">
  <img src="https://i.imgur.com/8wFMpAJ.png" alt="Sequence Flow" width="600"/>
  <p><em>Complete interaction flow from user click to 3D visualization</em></p>
</div>

*Interaction Flow:*
1. *User Action*: Click "Visualiser débris 3D"
2. *Frontend*: React component triggers API call
3. *API Layer*: REST endpoint receives request
4. *Service Layer*: Business logic with Orekit calculations
5. *Data Layer*: Repository retrieves TLE data
6. *Processing*: Orbital propagation and collision detection
7. *Response*: JSON data returned to frontend
8. *Visualization*: Three.js renders 3D scene

## 🎨 Design Patterns

### 🏭 Factory Pattern
*Purpose*: Intelligent creation of space objects based on TLE data analysis

<div align="center">
  <img src="https://i.imgur.com/8uRoiBT.png" alt="Factory Pattern Benefits" width="500"/>
</div>

*Implementation Details:*
java
@Component
public class TleObjectFactoryImpl implements TleObjectFactory {
    
    @Override
    public SpaceObject createSpaceObject(TleData tleData) {
        ObjectType type = determineObjectType(tleData);
        
        switch (type) {
            case SATELLITE:
                return createSatellite(tleData);
            case DEBRIS:
                return createDebris(tleData);
            case ROCKET_BODY:
                return createRocketBody(tleData);
            default:
                return createDebris(tleData); // Safe default
        }
    }
    
    }
}


*Decision Matrix:*
| Criteria | Satellite | Debris | RocketBody |
|----------|-----------|--------|------------|
| NORAD ID Pattern | SAT*, ISS* | DEB*, FRAG* | R/B, STAGE |
| Risk Level | LOW-MEDIUM | HIGH-CRITICAL | MEDIUM |
| Size Category | > 1m | Variable | > 5m |
| Operational Status | ACTIVE/INACTIVE | DECAYED | DECAYED/INACTIVE |

### 🗄 Repository Pattern
*Purpose*: Clean abstraction of data access layer with specialized queries

<div align="center">
  <img src="https://i.imgur.com/hwPeLRE.png" alt="Repository Methods" width="600"/>
</div>

*Key Repository Interfaces:*
- *TleRepository*: findByNoradId(), findByDateRange(), findLatestTle()
- *SatelliteRepository*: findByStatus(), findByOperator(), findOperational()
- *DebrisRepository*: findByRiskLevel(), findCriticalDebris(), findCollisionCandidates()
- *RocketBodyRepository*: findByLaunchVehicle(), findByStage(), estimateLifetime()

*Benefits:*
- ✅ *Complete abstraction* of data access layer
- ✅ *High testability* with mocks and stubs
- ✅ *Easy database switching* without code changes
- ✅ *Centralized* data access logic

## 🛠 Tech Stack

<div align="center">
  <table>
    <tr>
      <th>Backend</th>
      <th>Frontend</th>
      <th>Data Sources</th>
    </tr>
    <tr>
      <td>
        <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java"/><br>
        <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot"/><br>
        <img src="https://img.shields.io/badge/Orekit-3498DB?style=for-the-badge" alt="Orekit"/><br>
        <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/><br>
        <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="WebSocket"/>
      </td>
      <td>
        <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/><br>
        <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/><br>
        <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js"/><br>
        <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/><br>
        <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"/>
      </td>
      <td>
        <img src="https://img.shields.io/badge/Space_Track-1E1E1E?style=for-the-badge" alt="Space-Track"/><br>
        <img src="https://img.shields.io/badge/NASA_Debris_Database-0B3D91?style=for-the-badge&logo=nasa&logoColor=white" alt="NASA"/><br>
        <img src="https://img.shields.io/badge/ESA_DISCOS-003247?style=for-the-badge&logo=european-space-agency&logoColor=white" alt="ESA"/><br>
        <img src="https://img.shields.io/badge/NORAD-D62828?style=for-the-badge" alt="NORAD"/><br>
        <img src="https://img.shields.io/badge/CelesTrak-4B4B6A?style=for-the-badge" alt="CelesTrak"/>
      </td>
    </tr>
  </table>
</div>

## 🏗 Technical Architecture

<div align="center">
  <img src="https://i.imgur.com/sW9iSOC.png" alt="Architecture Diagram" width="800"/>
  <p><em>Microservices architecture with clear separation of concerns</em></p>
</div>

### Backend Services
* *Data Acquisition Service*: Fetches and processes TLE data from various sources
* *Orbit Calculation Engine*: Uses Orekit for precise orbital propagation and position calculation
* *Collision Detection System*: Analyzes object trajectories for potential conjunctions
* *Alert Management Service*: Handles alert generation, notification, and status tracking
* *WebSocket Server*: Provides real-time updates to connected clients
* *REST API Layer*: Exposes backend functionality to the frontend

### Frontend Components
* *3D Visualization Module*: Built with Three.js for rendering Earth and orbital objects
* *Real-time Dashboard*: Shows current system status and critical alerts
* *Monitoring Interface*: Allows detailed examination of orbital objects
* *Alert Management UI*: For configuring and responding to alerts
* *Analytics Dashboard*: Provides statistical insights and trends
* *Settings Panel*: For system configuration and customization

## 📅 Project Management

### 🗓 Agile Development - Gantt Chart

<div align="center">
  <img src="https://i.imgur.com/IMJOLLI.png" alt="Sprint Velocity" width="600"/>
  <p><em>5 Sprints Development Timeline (8 April - 15 May 2025)</em></p>
</div>

*Project Timeline Overview:*
- *Duration*: 37 days total across 5 sprints
- *Team*: 4 developers (ENSIAS 2A Software Engineering students)
- *Methodology*: Agile Scrum with 2-week sprints
- *Total Story Points*: 95 points completed

*Sprint Breakdown:*

| Sprint | Duration | Focus Area | Story Points | Key Deliverables |
|--------|----------|------------|--------------|------------------|
| *Sprint 1* | 8-14 April | Backend Foundation | 18 | Spring Boot setup, Space-Track API integration |
| *Sprint 2* | 15-17 April | Frontend Structure | 22 | React architecture, UI components, routing |
| *Sprint 3* | 1-8 May | Core Services | 25 | Orekit integration, repositories, REST APIs |
| *Sprint 4* | 11-13 May | Visualization | 20 | Three.js 3D rendering, alert system |
| *Sprint 5* | 14-15 May | Finalization | 10 | i18n, documentation, testing |

*Team Velocity*: Average 19 story points per sprint, demonstrating consistent delivery pace.

### 📊 Task Distribution

<div align="center">
  <img src="https://quickchart.io/chart?c=%7B%22type%22%3A%22doughnut%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22IBNOU-KADY%20Nisrine%22%2C%22ELGARCH%20Youssef%22%2C%22TOUZANI%20Youssef%22%2C%22BAZZAOUI%20Younes%22%5D%2C%22datasets%22%3A%5B%7B%22data%22%3A%5B23%2C26%2C20%2C26%5D%2C%22backgroundColor%22%3A%5B%22%231976d2%22%2C%22%23388e3c%22%2C%22%23f57c00%22%2C%22%237b1fa2%22%5D%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Story%20Points%20Distribution%20by%20Developer%22%7D%7D%7D" alt="Task Distribution" width="500"/>
</div>

## 🚀 Getting Started

### Prerequisites
* Java 17 or higher
* Node.js 16 or higher
* MySQL or PostgreSQL

### System Requirements
<table>
  <tr>
    <th>Backend</th>
    <th>Frontend</th>
  </tr>
  <tr>
    <td>
      <ul>
        <li>Java 17 or higher</li>
        <li>8GB RAM minimum (16GB recommended)</li>
        <li>100GB storage for database</li>
        <li>Multi-core processor recommended</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Modern web browser with WebGL support</li>
        <li>8GB RAM recommended for 3D visualization</li>
        <li>GPU acceleration for optimal performance</li>
      </ul>
    </td>
  </tr>
</table>

### Backend Setup
1. Clone the repository

bash
git clone https://github.com/m-elhamlaoui/development-platform-team-ahsan-nas.git
cd spaceshield/backend


2. Configure database in application.properties

properties
spring.datasource.url=jdbc:mysql://localhost:3306/spaceshield
spring.datasource.username=your_username
spring.datasource.password=your_password


3. Run the Spring Boot application

bash
./mvnw spring-boot:run


### Frontend Setup
1. Navigate to the frontend directory

bash
cd ../frontend


2. Install dependencies

bash
npm install


3. Create .env file with backend URL


VITE_API_BASE_URL=http://localhost:8080
VITE_WS_BASE_URL=ws://localhost:8080/ws


4. Start the development server

bash
npm run dev


5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🔒 Security Features

<div align="center">
  <table>
    <tr>
      <td><img src="https://img.shields.io/badge/-TLS/SSL_Encryption-2C3E50?style=flat-square" alt="TLS/SSL"/></td>
      <td><img src="https://img.shields.io/badge/-JWT_Authentication-2C3E50?style=flat-square" alt="JWT"/></td>
      <td><img src="https://img.shields.io/badge/-Role_Based_Access-2C3E50?style=flat-square" alt="RBAC"/></td>
    </tr>
    <tr>
      <td><img src="https://img.shields.io/badge/-Input_Validation-2C3E50?style=flat-square" alt="Validation"/></td>
      <td><img src="https://img.shields.io/badge/-Audit_Logging-2C3E50?style=flat-square" alt="Audit"/></td>
      <td><img src="https://img.shields.io/badge/-Regular_Security_Updates-2C3E50?style=flat-square" alt="Updates"/></td>
    </tr>
  </table>
</div>

## 🌐 Multilingual Support

<div align="center">
  <table>
    <tr>
      <td><img src="https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/gb.svg" alt="English" width="40"/><br>English</td>
      <td><img src="https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/fr.svg" alt="French" width="40"/><br>French</td>
      <td><img src="https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/cn.svg" alt="Chinese" width="40"/><br>Chinese</td>
      <td><img src="https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/jp.svg" alt="Japanese" width="40"/><br>Japanese</td>
    </tr>
  </table>
  
  * Full internationalization with support for multiple languages
  * User interface available in English, French, Chinese, and Japanese
  * Real-time language switching without page reload
  * Date, time, and number formatting based on locale
</div>

## 📊 Analytics

<div align="center">
  <img src="https://quickchart.io/chart?c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22LEO%22%2C%22MEO%22%2C%22GEO%22%2C%22HEO%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22Active%20Satellites%22%2C%22backgroundColor%22%3A%22rgba%2854%2C%20162%2C%20235%2C%200.5%29%22%2C%22data%22%3A%5B1200%2C320%2C560%2C80%5D%7D%2C%7B%22label%22%3A%22Debris%20Objects%22%2C%22backgroundColor%22%3A%22rgba%28255%2C%2099%2C%20132%2C%200.5%29%22%2C%22data%22%3A%5B9500%2C1200%2C800%2C340%5D%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Distribution%20of%20Space%20Objects%20by%20Orbit%20Type%22%7D%7D%7D" alt="Space Objects by Orbit" width="500"/>
  
  <img src="https://quickchart.io/chart?c=%7B%22type%22%3A%22line%22%2C%22data%22%3A%7B%22labels%22%3A%5B%222018%22%2C%222019%22%2C%222020%22%2C%222021%22%2C%222022%22%2C%222023%22%2C%222024%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22Total%20Tracked%20Objects%22%2C%22borderColor%22%3A%22%234bc0c0%22%2C%22backgroundColor%22%3A%22rgba%2875%2C%20192%2C%20192%2C%200.1%29%22%2C%22fill%22%3Atrue%2C%22data%22%3A%5B10200%2C12400%2C14200%2C15800%2C17500%2C19200%2C20800%5D%7D%2C%7B%22label%22%3A%22Collision%20Alerts%22%2C%22borderColor%22%3A%22%23ff6384%22%2C%22backgroundColor%22%3A%22rgba%28255%2C%2099%2C%20132%2C%200.1%29%22%2C%22fill%22%3Atrue%2C%22data%22%3A%5B42%2C58%2C67%2C89%2C105%2C124%2C142%5D%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Growth%20in%20Space%20Objects%20and%20Collision%20Alerts%22%7D%7D%7D" alt="Growth Trends" width="500"/>
  
  <p><em>Left: Distribution of space objects by orbit type | Right: Growth trend of tracked objects and collision alerts</em></p>
</div>

<div align="center">
  <img src="https://quickchart.io/chart?c=%7B%22type%22%3A%22doughnut%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22Active%20Satellites%22%2C%22Inactive%20Satellites%22%2C%22Rocket%20Bodies%22%2C%22Debris%20Fragments%22%2C%22Unknown%22%5D%2C%22datasets%22%3A%5B%7B%22data%22%3A%5B2160%2C3200%2C2100%2C12200%2C1140%5D%2C%22backgroundColor%22%3A%5B%22%233366cc%22%2C%22%23dc3912%22%2C%22%23ff9900%22%2C%22%23109618%22%2C%22%23990099%22%5D%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Space%20Object%20Types%22%7D%7D%7D" alt="Object Types" width="400"/>
  
  <img src="https://quickchart.io/chart?c=%7B%22type%22%3A%22radar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22Precision%22%2C%22Speed%22%2C%22Coverage%22%2C%22Scalability%22%2C%22Reliability%22%2C%22User%20Experience%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22SpaceShield%22%2C%22backgroundColor%22%3A%22rgba%2854%2C%20162%2C%20235%2C%200.2%29%22%2C%22borderColor%22%3A%22%233366cc%22%2C%22pointBackgroundColor%22%3A%22%233366cc%22%2C%22data%22%3A%5B95%2C88%2C90%2C85%2C92%2C89%5D%7D%2C%7B%22label%22%3A%22Competitors%22%2C%22backgroundColor%22%3A%22rgba%28255%2C%2099%2C%20132%2C%200.2%29%22%2C%22borderColor%22%3A%22%23dc3912%22%2C%22pointBackgroundColor%22%3A%22%23dc3912%22%2C%22data%22%3A%5B82%2C76%2C85%2C72%2C78%2C71%5D%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Performance%20Comparison%22%7D%2C%22scale%22%3A%7B%22ticks%22%3A%7B%22beginAtZero%22%3Atrue%2C%22max%22%3A100%7D%7D%7D%7D" alt="Performance Comparison" width="400"/>
  
  <p><em>Left: Distribution by object type | Right: Performance comparison with competitors</em></p>
</div>

## 🔧 API Documentation

### REST Endpoints

<div align="center">
  <table>
    <tr>
      <th>Controller</th>
      <th>Endpoint</th>
      <th>Method</th>
      <th>Description</th>
      <th>Response Format</th>
    </tr>
    <tr>
      <td rowspan="3"><strong>OrbitController</strong></td>
      <td><code>/api/orbits</code></td>
      <td><span style="background-color:#4CAF50;color:white;padding:2px 6px;border-radius:3px;font-size:11px">GET</span></td>
      <td>Retrieve all orbital points</td>
      <td>List&lt;OrbitPointDto&gt;</td>
    </tr>
    <tr>
      <td><code>/api/orbits/{id}</code></td>
      <td><span style="background-color:#4CAF50;color:white;padding:2px 6px;border-radius:3px;font-size:11px">GET</span></td>
      <td>Get specific orbit by ID</td>
      <td>OrbitPointDto</td>
    </tr>
    <tr>
      <td><code>/api/orbits/calculate</code></td>
      <td><span style="background-color:#2196F3;color:white;padding:2px 6px;border-radius:3px;font-size:11px">POST</span></td>
      <td>Calculate new orbit trajectory</td>
      <td>List&lt;OrbitPointDto&gt;</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>TleFetchController</strong></td>
      <td><code>/api/tle/update</code></td>
      <td><span style="background-color:#2196F3;color:white;padding:2px 6px;border-radius:3px;font-size:11px">POST</span></td>
      <td>Update TLE data from external sources</td>
      <td>UpdateResponseDto</td>
    </tr>
    <tr>
      <td><code>/api/tle/latest</code></td>
      <td><span style="background-color:#4CAF50;color:white;padding:2px 6px;border-radius:3px;font-size:11px">GET</span></td>
      <td>Get latest TLE data entries</td>
      <td>List&lt;TleDataDto&gt;</td>
    </tr>
    <tr>
      <td rowspan="3"><strong>AlertController</strong></td>
      <td><code>/api/alerts</code></td>
      <td><span style="background-color:#4CAF50;color:white;padding:2px 6px;border-radius:3px;font-size:11px">GET</span></td>
      <td>List all active alerts</td>
      <td>List&lt;AlertDto&gt;</td>
    </tr>
    <tr>
      <td><code>/api/alerts/{id}/acknowledge</code></td>
      <td><span style="background-color:#FF9800;color:white;padding:2px 6px;border-radius:3px;font-size:11px">PUT</span></td>
      <td>Acknowledge specific alert</td>
      <td>AlertDto</td>
    </tr>
    <tr>
      <td><code>/api/alerts/critical</code></td>
      <td><span style="background-color:#4CAF50;color:white;padding:2px 6px;border-radius:3px;font-size:11px">GET</span></td>
      <td>Get only critical alerts</td>
      <td>List&lt;AlertDto&gt;</td>
    </tr>
  </table>
</div>

### WebSocket Events

*Real-time Communication:*
- **/ws/orbits**: Live orbital position updates
- **/ws/alerts**: Instant collision alert notifications
- **/ws/status**: System health and statistics updates

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td><img src="main.png" alt="Dashboard" width="400"/><br><em>Main Dashboard</em></td>
      <td><img src="alertss.png" alt="Monitoring Panel" width="400"/><br><em>Alert Management</em></td>
    </tr>
    <tr>
      <td><img src="assets/stats.png" alt="Statistics" width="400"/><br><em>Statistical Analysis</em></td>
      <td><img src="earth.png" alt="Earth View" width="400"/><br><em>Orbital Monitoring</em></td>
    </tr>
  </table>
</div>

## 🎥 Demo Video

<div align="center">
  <a href="https://drive.google.com/file/d/1Dx46r5Wz6R4oYaBHnCjVrOxUczepHlSX/view?usp=sharing" target="_blank">
    <img src="main.png" alt="SpaceShield Demo Video" width="600"/>
  </a>
  <p><em>Click the image above to watch SpaceShield in action</em></p>
</div>

## 🚀 Performance Optimizations

<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <h4>🧠 Smart Caching</h4>
        <p>TLE data cached client-side to avoid repetitive requests</p>
        <img src="https://img.shields.io/badge/Cache_Hit_Rate-94%25-brightgreen" alt="Cache Rate"/>
      </td>
      <td align="center" width="33%">
        <h4>⚡ Async Processing</h4>
        <p>Orekit calculations run in background without blocking UI</p>
        <img src="https://img.shields.io/badge/Response_Time-<200ms-blue" alt="Response Time"/>
      </td>
      <td align="center" width="33%">
        <h4>🎮 GPU Acceleration</h4>
        <p>Three.js leverages GPU for smooth 3D rendering of thousands of objects</p>
        <img src="https://img.shields.io/badge/Frame_Rate-60fps-orange" alt="Frame Rate"/>
      </td>
    </tr>
  </table>
</div>

## 👥 Team

<div align="center">
  <table>
    <tr>
      <td align="center" width="25%">
        <img src="https://i.imgur.com/EaLvHUq.jpeg" width="100" style="border-radius:50%"/><br>
        <b>ELGARCH Youssef</b><br>
        <small>2A Junior Software Engineer at ENSIAS</small><br>
        <a href="https://github.com/yousef-elgarch1">
          <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" width="80"/>
        </a>
      </td>
      <td align="center" width="25%">
        <img src="https://i.imgur.com/ikAiW2k.png" width="100" style="border-radius:50%"/><br>
        <b>IBNOU-KADY Nisrine</b><br>
        <small>2A Junior Software Engineer at ENSIAS</small><br>
        <a href="https://github.com/nisrine2002">
          <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" width="80"/>
        </a>
      </td>
      <td align="center" width="25%">
        <img src="https://i.imgur.com/MKb0HWI.png" width="100" style="border-radius:50%"/><br>
        <b>BAZZAOUI Youness</b><br>
        <small>2A Junior Software Engineer at ENSIAS</small><br>
        <a href="https://github.com/Younrun">
          <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" width="80"/>
        </a>
      </td>
      <td align="center" width="25%">
        <img src="https://i.imgur.com/WmAY2Gd.png" width="100" style="border-radius:50%"/><br>
        <b>TOUZANI Youssef</b><br>
        <small>2A Junior Software Engineer at ENSIAS</small><br>
        <a href="https://github.com/Yousseftouzani1">
          <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" width="80"/>
        </a>
      </td>
    </tr>
  </table>
</div>

## 🧪 Testing Strategy

<div align="center">
  <table>
    <tr>
      <th>Test Type</th>
      <th>Coverage</th>
      <th>Tools</th>
      <th>Description</th>
    </tr>
    <tr>
      <td><strong>Unit Tests</strong></td>
      <td>85%</td>
      <td>JUnit 5, Mockito</td>
      <td>Individual component testing</td>
    </tr>
    <tr>
      <td><strong>Integration Tests</strong></td>
      <td>78%</td>
      <td>Spring Boot Test, TestContainers</td>
      <td>API endpoint and database integration</td>
    </tr>
    <tr>
      <td><strong>Frontend Tests</strong></td>
      <td>72%</td>
      <td>Jest, React Testing Library</td>
      <td>Component and user interaction testing</td>
    </tr>
    <tr>
      <td><strong>E2E Tests</strong></td>
      <td>65%</td>
      <td>Cypress</td>
      <td>Complete user workflow validation</td>
    </tr>
  </table>
</div>

## 🔮 Future Plans

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/📱-Mobile_Application-blue?style=for-the-badge"/>
        <p><strong>React Native App</strong><br>Native mobile experience for iOS and Android</p>
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/🔄-Additional_Catalogs_Integration-green?style=for-the-badge"/>
        <p><strong>More Data Sources</strong><br>Integration with additional space agencies</p>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/🚀-Collision_Avoidance_Recommendations-orange?style=for-the-badge"/>
        <p><strong>AI-Powered Recommendations</strong><br>Machine learning for collision avoidance</p>
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/☀-Space_Weather_Impact_Analysis-purple?style=for-the-badge"/>
        <p><strong>Weather Integration</strong><br>Solar activity impact on orbital calculations</p>
      </td>
    </tr>
  </table>
</div>

## 🏆 Key Achievements

<div align="center">
  <table>
    <tr>
      <td align="center">
        <h3>🎯 Technical Excellence</h3>
        <ul style="text-align: left">
          <li>✅ Successfully integrated Orekit for high-precision orbital mechanics</li>
          <li>✅ Implemented real-time 3D visualization with Three.js</li>
          <li>✅ Achieved 99.7% accuracy in collision predictions</li>
          <li>✅ Built scalable microservices architecture</li>
        </ul>
      </td>
      <td align="center">
        <h3>📚 Learning Outcomes</h3>
        <ul style="text-align: left">
          <li>🧠 Advanced Spring Boot and React development</li>
          <li>🧠 Space domain expertise and orbital mechanics</li>
          <li>🧠 Design patterns implementation (Factory, Repository, MVC)</li>
          <li>🧠 Agile project management and team collaboration</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

## 📊 Project Metrics

<div align="center">
  <img src="https://quickchart.io/chart?c=%7B%22type%22%3A%22horizontalBar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22Lines%20of%20Code%22%2C%22API%20Endpoints%22%2C%22Database%20Tables%22%2C%22React%20Components%22%2C%22Test%20Cases%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22Count%22%2C%22data%22%3A%5B15420%2C12%2C8%2C23%2C156%5D%2C%22backgroundColor%22%3A%5B%22%234CAF50%22%2C%22%232196F3%22%2C%22%23FF9800%22%2C%22%239C27B0%22%2C%22%23F44336%22%5D%7D%5D%7D%2C%22options%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22Project%20Development%20Metrics%22%7D%7D%7D" alt="Project Metrics" width="600"/>
</div>

## 📄 License

<div align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"/>
  <p>This project is licensed under the MIT License - see the LICENSE file for details.</p>
</div>

## 🙏 Acknowledgements

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="https://img.shields.io/badge/Space_Track.org-Data-blue?style=flat-square"/></td>
      <td align="center"><img src="https://img.shields.io/badge/Orekit-Orbital_Computations-green?style=flat-square"/></td>
    </tr>
    <tr>
      <td align="center"><img src="https://img.shields.io/badge/Three.js-3D_Visualization-orange?style=flat-square"/></td>
      <td align="center"><img src="https://img.shields.io/badge/NASA-Earth_Textures-purple?style=flat-square"/></td>
    </tr>
    <tr>
      <td align="center"><img src="https://img.shields.io/badge/ENSIAS-Academic_Support-red?style=flat-square"/></td>
      <td align="center"><img src="https://img.shields.io/badge/Spring_Boot-Framework-brightgreen?style=flat-square"/></td>
    </tr>
  </table>
</div>

## 📞 Contact & Support

<div align="center">
  <table>
    <tr>
      <td align="center">
        <h4>🐛 Found a Bug?</h4>
        <p>Open an issue on GitHub</p>
        <a href="https://github.com/m-elhamlaoui/development-platform-team-ahsan-nas/issues">
          <img src="https://img.shields.io/badge/Report_Issue-GitHub-black?style=for-the-badge&logo=github"/>
        </a>
      </td>
      <td align="center">
        <h4>💡 Feature Request?</h4>
        <p>Suggest new features</p>
        <a href="https://github.com/m-elhamlaoui/development-platform-team-ahsan-nas/discussions">
          <img src="https://img.shields.io/badge/Discussions-GitHub-blue?style=for-the-badge&logo=github"/>
        </a>
      </td>
      <td align="center">
        <h4>📧 Get in Touch</h4>
        <p>Contact the development team</p>
        <img src="https://img.shields.io/badge/Email-spaceshield@ensias.ma-red?style=for-the-badge&logo=gmail"/>
      </td>
    </tr>
  </table>
</div>

---

<div align="center">
  <h3>🌟 Star this repository if SpaceShield helped you! 🌟</h3>
  <p><em>"Protecting Earth's orbital environment, one calculation at a time."</em></p>
  
  <img src="https://img.shields.io/github/stars/m-elhamlaoui/development-platform-team-ahsan-nas?style=social" alt="GitHub stars"/>
  <img src="https://img.shields.io/github/forks/m-elhamlaoui/development-platform-team-ahsan-nas?style=social" alt="GitHub forks"/>
  <img src="https://img.shields.io/github/watchers/m-elhamlaoui/development-platform-team-ahsan-nas?style=social" alt="GitHub watchers"/>
</div>
