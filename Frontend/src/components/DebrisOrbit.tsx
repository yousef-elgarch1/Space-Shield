import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { ObjectType } from '@/hooks/useDebrisData';

interface DebrisOrbitProps {
  radius: number;
  color: string;
  objectType?: ObjectType;  // Make objectType optional
  particles?: number;
  orbitAngle: number;
  speed: number;
  predictedOrbitPoints?: Array<{
    latitude: number;
    longitude: number;
    altitude: number;
  }>;
  isSatellite?: boolean;
}

export const DebrisOrbit: React.FC<DebrisOrbitProps> = ({ 
  radius, 
  color, 
  objectType = 'UNKNOWN',  // Default to 'UNKNOWN' if not provided
  particles = 20, 
  orbitAngle,
  speed,
  predictedOrbitPoints,
  isSatellite = false
}) => {
  const particlesRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Line>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Create a custom orbit path when predicted points are available
  useEffect(() => {
    if (orbitRef.current && predictedOrbitPoints && predictedOrbitPoints.length > 0) {
      try {
        // Convert latitude/longitude to 3D points
        const points = predictedOrbitPoints.map(point => {
          const phi = (90 - point.latitude) * (Math.PI / 180);
          const theta = (point.longitude + 180) * (Math.PI / 180);
          
          const alt = typeof point.altitude === 'number' ? point.altitude : parseFloat(String(point.altitude));
          const normalizedAlt = Math.min(Math.max(alt, 100000), 3000000); // Clamp to reasonable values
          const r = 2 + (normalizedAlt / 1000000); // Scale altitude to scene size
          
          const x = -(r * Math.sin(phi) * Math.cos(theta));
          const z = r * Math.sin(phi) * Math.sin(theta);
          const y = r * Math.cos(phi);
          
          return new THREE.Vector3(x, y, z);
        });

        // Filter out any invalid points (NaN, undefined)
        const validPoints = points.filter(p => 
          !isNaN(p.x) && !isNaN(p.y) && !isNaN(p.z) && 
          p.x !== undefined && p.y !== undefined && p.z !== undefined
        );
        
        if (validPoints.length < 3) {
          // Not enough points for a proper curve, use default orbit
          return;
        }

        // Create a smooth curve from the points
        const curve = new THREE.CatmullRomCurve3(validPoints);
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
        
        // Update the orbit line
        orbitRef.current.geometry.dispose();
        orbitRef.current.geometry = geometry;
      } catch (error) {
        console.warn("Error creating orbital curve:", error);
        // Fallback to default orbit
      }
    }
  }, [predictedOrbitPoints]);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * speed;
    }
  });

  // Create default orbit path if no prediction data
  const orbitCurve = new THREE.EllipseCurve(
    0, 0,             // center x, y
    radius, radius,   // x radius, y radius
    0, 2 * Math.PI,   // start angle, end angle
    false,            // clockwise
    orbitAngle        // rotation
  );
  
  const orbitPoints = orbitCurve.getPoints(100);
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);

  // Position particles along the orbit
  const particlePositions = Array.from({ length: particles }).map((_, i) => {
    const angle = (i / particles) * Math.PI * 2;
    const x = Math.cos(angle + orbitAngle) * radius;
    const y = Math.sin(angle + orbitAngle) * radius * Math.cos(orbitAngle);
    const z = Math.sin(angle + orbitAngle) * radius * Math.sin(orbitAngle);
    return new THREE.Vector3(x, y, z);
  });

  // Generate descriptive labels based on object type
  const getTypeDetails = () => {
    // Make sure objectType is defined and a string before calling toLowerCase()
    const objType = objectType ? objectType.toString() : 'UNKNOWN';
    
    switch (objType.toUpperCase()) {
      case 'SATELLITE':
        return {
          type: "Active Satellite",
          origins: ["USA", "EU", "China", "Russia", "Japan", "India"],
          years: Array.from({length: 20}, (_, i) => 2005 + i),
          sizes: ["1.5m - 3m", "3m - 5m", "5m - 10m"],
          velocities: ["7.5 km/s", "7.8 km/s", "8.1 km/s"]
        };
      case 'ROCKET BODY':
        return {
          type: "Rocket Body",
          origins: ["SpaceX", "Roscosmos", "NASA", "ESA", "ISRO", "CNSA"],
          years: Array.from({length: 30}, (_, i) => 1995 + i),
          sizes: ["3m - 5m", "5m - 10m", "10m - 15m"],
          velocities: ["7.2 km/s", "7.6 km/s", "7.9 km/s"]
        };
      case 'DEBRIS':
        return {
          type: "Space Debris",
          origins: ["Satellite Collision", "Rocket Fragment", "Mission Related Object"],
          years: Array.from({length: 40}, (_, i) => 1985 + i),
          sizes: ["10cm - 50cm", "50cm - 1m", "1m - 2m"],
          velocities: ["7.4 km/s", "8.2 km/s", "10.1 km/s"]
        };
      default:
        return {
          type: "Unknown Object",
          origins: ["Unknown"],
          years: Array.from({length: 20}, (_, i) => 2005 + i),
          sizes: ["Unknown"],
          velocities: ["~7.5 km/s"]
        };
    }
  };

  // Generate random data for debris tooltips
  const generateDebrisData = (index: number) => {
    const details = getTypeDetails();
    
    return {
      id: `debris-${index}`,
      type: details.type,
      origin: details.origins[Math.floor(Math.random() * details.origins.length)],
      year: details.years[Math.floor(Math.random() * details.years.length)],
      size: details.sizes[Math.floor(Math.random() * details.sizes.length)],
      velocity: details.velocities[Math.floor(Math.random() * details.velocities.length)]
    };
  };

  return (
    <group>
      {/* Orbit path */}
      <line ref={orbitRef}>
        <bufferGeometry attach="geometry" {...orbitGeometry} />
        <lineBasicMaterial 
          attach="material" 
          color={color} 
          transparent={true} 
          opacity={0.3} 
        />
      </line>
      
      {/* Debris particles */}
      <group ref={particlesRef}>
        {particlePositions.map((position, i) => {
          const isSatelliteModel = isSatellite && i % 5 === 0;
          const debrisData = generateDebrisData(i);
          
          return (
            <mesh 
              key={i} 
              position={position}
              onPointerOver={() => setHoveredIndex(i)}
              onPointerOut={() => setHoveredIndex(null)}
            >
              {isSatelliteModel ? (
                // Satellite model
                <group>
                  <mesh>
                    <boxGeometry args={[0.1, 0.1, 0.2]} />
                    <meshStandardMaterial 
                      color={hoveredIndex === i ? "#ffffff" : color} 
                      emissive={hoveredIndex === i ? "#ffffff" : color}
                      emissiveIntensity={hoveredIndex === i ? 1 : 0.5}
                    />
                  </mesh>
                  <mesh position={[0, 0, 0.15]}>
                    <boxGeometry args={[0.3, 0.02, 0.02]} />
                    <meshStandardMaterial color={hoveredIndex === i ? "#ffffff" : "#aaaaaa"} />
                  </mesh>
                </group>
              ) : objectType === 'ROCKET BODY' ? (
                // Rocket body
                <mesh>
                  <cylinderGeometry args={[0.04, 0.08, 0.2, 8]} />
                  <meshStandardMaterial 
                    color={hoveredIndex === i ? "#ffffff" : color} 
                    emissive={hoveredIndex === i ? "#ffffff" : color}
                    emissiveIntensity={hoveredIndex === i ? 1 : 0.5}
                  />
                </mesh>
              ) : (
                // Regular debris
                <mesh>
                  <sphereGeometry args={[0.04 + Math.random() * 0.03]} />
                  <meshStandardMaterial 
                    color={hoveredIndex === i ? "#ffffff" : color} 
                    emissive={hoveredIndex === i ? "#ffffff" : color}
                    emissiveIntensity={hoveredIndex === i ? 1 : 0.5}
                  />
                </mesh>
              )}
              
              {/* Tooltip for hovered particle */}
              {hoveredIndex === i && (
                <Html position={[0, 0.2, 0]} center distanceFactor={10}>
                  <div className="bg-black bg-opacity-80 p-2 rounded text-white text-xs whitespace-nowrap">
                    <div className="font-bold">{debrisData.type}</div>
                    <div>Origin: {debrisData.origin}</div>
                    <div>Year: {debrisData.year}</div>
                    <div>Size: {debrisData.size}</div>
                    <div>Velocity: {debrisData.velocity}</div>
                  </div>
                </Html>
              )}
            </mesh>
          );
        })}
      </group>
    </group>
  );
};