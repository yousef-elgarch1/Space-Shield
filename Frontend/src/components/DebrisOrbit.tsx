import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export type ObjectType = 'SATELLITE' | 'ROCKET BODY' | 'DEBRIS' | 'UNKNOWN';

interface DebrisOrbitProps {
  radius: number;
  color: string;
  objectType?: ObjectType;
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
  objectType = 'UNKNOWN',
  particles = 20, 
  orbitAngle,
  speed,
  predictedOrbitPoints,
  isSatellite = false
}) => {
  const particlesRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Line>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Add individual particle references for independent movement
  const particleRefs = useRef<THREE.Mesh[]>([]);
  
  // Use this to store particle initial positions for animation
  const particleBasePositions = useRef<THREE.Vector3[]>([]);
  
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

        // Filter out any invalid points
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

  // Create orbit bands similar to LeoLabs visualization
  const createOrbitPaths = () => {
    // Create additional semi-transparent bands for a more dynamic appearance
    const orbitGeometries = [];
    const orbitMaterials = [];
    const orbitLines = [];
    
    for (let i = 0; i < 3; i++) {
      // Modify the orbit slightly for each band
      const variationRadius = radius * (1 + (i - 1) * 0.015);
      const curve = new THREE.EllipseCurve(
        0, 0,
        variationRadius, variationRadius,
        0, 2 * Math.PI,
        false,
        orbitAngle + (i - 1) * 0.05
      );
      
      const points = curve.getPoints(100);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      orbitGeometries.push(geometry);
      
      // Create a semi-transparent material with different opacities
      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: i === 1 ? 0.4 : 0.2,
      });
      orbitMaterials.push(material);
      
      const line = new THREE.Line(geometry, material);
      orbitLines.push(line);
    }
    
    return orbitLines;
  };

  // Initialize particle positions and save the base positions
  useEffect(() => {
    // Store base positions for animation reference
    particleBasePositions.current = particlePositions.map(pos => pos.clone());
    
    // Initialize particle refs array
    particleRefs.current = new Array(particles);
  }, [particles]);

  // Add more realistic movement with individual variations
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      // Base rotation for all particles
      particlesRef.current.rotation.y = clock.getElapsedTime() * speed;
      
      // Add slight wobble for more realistic orbit motion
      const groupWobbleX = Math.sin(clock.getElapsedTime() * speed * 0.2) * 0.02;
      const groupWobbleZ = Math.cos(clock.getElapsedTime() * speed * 0.3) * 0.02;
      
      particlesRef.current.rotation.x = groupWobbleX;
      particlesRef.current.rotation.z = groupWobbleZ;
      
      // Individual particle movements
      for (let i = 0; i < particleRefs.current.length; i++) {
        const particle = particleRefs.current[i];
        if (particle && particleBasePositions.current[i]) {
          // Generate unique movement pattern for each particle
          const uniqueOffset = i * 0.1;
          const time = clock.getElapsedTime();
          
          // Create slight oscillation around the original position
          const wobbleX = Math.sin(time * 0.5 + uniqueOffset) * 0.01;
          const wobbleY = Math.cos(time * 0.3 + uniqueOffset) * 0.01;
          const wobbleZ = Math.sin(time * 0.7 + uniqueOffset) * 0.01;
          
          // Get the base position
          const basePos = particleBasePositions.current[i];
          
          // Apply the wobble to make particle oscillate around its orbital position
          particle.position.x = basePos.x + wobbleX;
          particle.position.y = basePos.y + wobbleY;
          particle.position.z = basePos.z + wobbleZ;
          
          // Rotation for debris objects
          if (objectType === 'DEBRIS') {
            particle.rotation.x += 0.01;
            particle.rotation.z += 0.005;
          }
        }
      }
    }
  });

  // Create standard orbit path
  const orbitCurve = new THREE.EllipseCurve(
    0, 0,
    radius, radius,
    0, 2 * Math.PI,
    false,
    orbitAngle
  );
  
  const orbitPoints = orbitCurve.getPoints(100);
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);

  // Position particles along the orbit with variation to create more realistic clusters
  const particlePositions = Array.from({ length: particles }).map((_, i) => {
    // Base angle with some randomness to spread out particles
    const angle = (i / particles) * Math.PI * 2 + Math.random() * 0.1;
    
    // Add some variation to the orbit to create more realistic clusters
    const radiusVariation = radius * (1 + (Math.random() - 0.5) * 0.1);
    const angleVariation = orbitAngle + (Math.random() - 0.5) * 0.1;
    
    // Calculate position with variations
    const x = Math.cos(angle + angleVariation) * radiusVariation;
    const y = Math.sin(angle + angleVariation) * radiusVariation * Math.cos(angleVariation);
    const z = Math.sin(angle + angleVariation) * radiusVariation * Math.sin(angleVariation);
    
    return new THREE.Vector3(x, y, z);
  });

  // Generate more realistic descriptive labels
  const getTypeDetails = () => {
    switch (objectType.toUpperCase()) {
      case 'SATELLITE':
        return {
          type: "Payload",
          origins: ["USA", "EU", "China", "Russia", "Japan", "India", "UK", "France"],
          years: Array.from({length: 20}, (_, i) => 2005 + i),
          sizes: ["1.5m - 3m", "3m - 5m", "5m - 10m"],
          velocities: ["7.5 km/s", "7.8 km/s", "8.1 km/s"],
          purposes: ["Earth Observation", "Communications", "Navigation", "Science", "Military"]
        };
      case 'ROCKET BODY':
        return {
          type: "Rocket Body",
          origins: ["SpaceX", "Roscosmos", "NASA", "ESA", "ISRO", "CNSA", "ULA", "Arianespace"],
          years: Array.from({length: 30}, (_, i) => 1995 + i),
          sizes: ["3m - 5m", "5m - 10m", "10m - 15m"],
          velocities: ["7.2 km/s", "7.6 km/s", "7.9 km/s"],
          rocketTypes: ["Falcon 9", "Soyuz", "Atlas V", "Delta IV", "Ariane 5", "Long March"]
        };
      case 'DEBRIS':
        return {
          type: "Debris",
          origins: ["Satellite Collision", "Rocket Fragment", "Mission Related Object", "Anti-Satellite Test"],
          years: Array.from({length: 40}, (_, i) => 1985 + i),
          sizes: ["10cm - 50cm", "50cm - 1m", "1m - 2m"],
          velocities: ["7.4 km/s", "8.2 km/s", "10.1 km/s"],
          riskLevels: ["Low", "Medium", "High"]
        };
      default:
        return {
          type: "Unknown",
          origins: ["Unknown"],
          years: Array.from({length: 20}, (_, i) => 2005 + i),
          sizes: ["Unknown"],
          velocities: ["~7.5 km/s"]
        };
    }
  };

  // Generate realistic debris data for tooltips
  const generateDebrisData = (index) => {
    const details = getTypeDetails();
    
    const baseData = {
      id: `debris-${index}`,
      type: details.type,
      origin: details.origins[Math.floor(Math.random() * details.origins.length)],
      year: details.years[Math.floor(Math.random() * details.years.length)],
      size: details.sizes[Math.floor(Math.random() * details.sizes.length)],
      velocity: details.velocities[Math.floor(Math.random() * details.velocities.length)],
      purpose: "N/A",
      rocketType: "N/A",
      riskLevel: "N/A"
    };
    
    // Add type-specific details
    if (objectType === 'SATELLITE') {
      baseData.purpose = details.purposes[Math.floor(Math.random() * details.purposes.length)];
    } else if (objectType === 'ROCKET BODY') {
      baseData.rocketType = details.rocketTypes[Math.floor(Math.random() * details.rocketTypes.length)];
    } else if (objectType === 'DEBRIS') {
      baseData.riskLevel = details.riskLevels[Math.floor(Math.random() * details.riskLevels.length)];
    }
    
    return baseData;
  };

  // Additional orbit bands for more realistic visualization
  const orbitBands = createOrbitPaths();

  return (
    <group>
      {/* Main orbit path */}
      <line ref={orbitRef}>
        <bufferGeometry attach="geometry" {...orbitGeometry} />
        <lineBasicMaterial 
          attach="material" 
          color={color} 
          transparent={true} 
          opacity={0.5} 
        />
      </line>
      
      {/* Additional orbit bands for more realistic appearance */}
      {orbitBands.map((band, index) => (
        <primitive key={`orbit-band-${index}`} object={band} />
      ))}
      
      {/* Debris particles */}
      <group ref={particlesRef}>
        {particlePositions.map((position, i) => {
          const isSatelliteModel = isSatellite && i % 5 === 0;
          const debrisData = generateDebrisData(i);
          
          return (
            <mesh 
              key={i} 
              position={position}
              ref={el => {
                if (el) particleRefs.current[i] = el;
              }}
              onPointerOver={() => setHoveredIndex(i)}
              onPointerOut={() => setHoveredIndex(null)}
            >
              {objectType === 'SATELLITE' || isSatelliteModel ? (
                // Enhanced satellite model
                <group>
                  {/* Main satellite body */}
                  <mesh>
                    <boxGeometry args={[0.12, 0.08, 0.18]} />
                    <meshStandardMaterial 
                      color={hoveredIndex === i ? "#ffffff" : color} 
                      emissive={hoveredIndex === i ? "#ffffff" : color}
                      emissiveIntensity={hoveredIndex === i ? 1 : 0.5}
                    />
                  </mesh>
                  
                  {/* Solar panels */}
                  <mesh position={[0.18, 0, 0]}>
                    <boxGeometry args={[0.2, 0.18, 0.01]} />
                    <meshStandardMaterial 
                      color="#1a5fb4" 
                      metalness={0.8}
                      roughness={0.2}
                    />
                  </mesh>
                  <mesh position={[-0.18, 0, 0]}>
                    <boxGeometry args={[0.2, 0.18, 0.01]} />
                    <meshStandardMaterial 
                      color="#1a5fb4" 
                      metalness={0.8}
                      roughness={0.2}
                    />
                  </mesh>
                  
                  {/* Antenna */}
                  <mesh position={[0, 0.08, 0.05]}>
                    <cylinderGeometry args={[0.005, 0.005, 0.12, 8]} />
                    <meshStandardMaterial color="#aaaaaa" />
                  </mesh>
                  <mesh position={[0, 0.14, 0.05]}>
                    <sphereGeometry args={[0.015]} />
                    <meshStandardMaterial color="#aaaaaa" />
                  </mesh>
                </group>
              ) : objectType === 'ROCKET BODY' ? (
                // Enhanced rocket body
                <group>
                  <mesh>
                    <cylinderGeometry args={[0.05, 0.08, 0.25, 8]} />
                    <meshStandardMaterial 
                      color={hoveredIndex === i ? "#ffffff" : color} 
                      emissive={hoveredIndex === i ? "#ffffff" : color}
                      emissiveIntensity={hoveredIndex === i ? 1 : 0.5}
                    />
                  </mesh>
                  
                  {/* Nozzle */}
                  <mesh position={[0, -0.15, 0]}>
                    <cylinderGeometry args={[0.08, 0.1, 0.05, 8]} />
                    <meshStandardMaterial color="#555555" />
                  </mesh>
                  
                  {/* Engine bell */}
                  <mesh position={[0, -0.18, 0]}>
                    <coneGeometry args={[0.1, 0.1, 8, 1, true]} />
                    <meshStandardMaterial 
                      color="#444444"
                      metalness={0.7}
                      roughness={0.3}
                    />
                  </mesh>
                </group>
              ) : objectType === 'DEBRIS' ? (
                // Enhanced debris - irregular shapes
                <group rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}>
                  {/* Create more irregular shapes for debris */}
                  <mesh>
                    <dodecahedronGeometry args={[0.04 + Math.random() * 0.03, 0]} />
                    <meshStandardMaterial 
                      color={hoveredIndex === i ? "#ffffff" : color} 
                      emissive={hoveredIndex === i ? "#ffffff" : color}
                      emissiveIntensity={hoveredIndex === i ? 1 : 0.5}
                      roughness={0.8}
                    />
                  </mesh>
                  
                  {/* Add some smaller fragments around main piece */}
                  {Math.random() > 0.7 && (
                    <mesh position={[0.03, 0.03, 0]}>
                      <tetrahedronGeometry args={[0.015 + Math.random() * 0.01]} />
                      <meshStandardMaterial 
                        color={color} 
                        emissive={color}
                        emissiveIntensity={0.5}
                      />
                    </mesh>
                  )}
                </group>
              ) : (
                // Unknown objects
                <mesh>
                  <sphereGeometry args={[0.04 + Math.random() * 0.03]} />
                  <meshStandardMaterial 
                    color={hoveredIndex === i ? "#ffffff" : color} 
                    emissive={hoveredIndex === i ? "#ffffff" : color}
                    emissiveIntensity={hoveredIndex === i ? 1 : 0.5}
                  />
                </mesh>
              )}
              
              {/* Enhanced tooltip with more information */}
              {hoveredIndex === i && (
                <Html position={[0, 0.2, 0]} center distanceFactor={10}>
                  <div className="bg-black bg-opacity-90 p-2 rounded text-white text-xs whitespace-nowrap max-w-xs">
                    <div className="font-bold border-b border-gray-600 pb-1 mb-1">{debrisData.type}</div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                      <div>Origin:</div>
                      <div>{debrisData.origin}</div>
                      <div>Launch Year:</div>
                      <div>{debrisData.year}</div>
                      <div>Size:</div>
                      <div>{debrisData.size}</div>
                      <div>Velocity:</div>
                      <div>{debrisData.velocity}</div>
                      
                      {objectType === 'SATELLITE' && (
                        <>
                          <div>Purpose:</div>
                          <div>{debrisData.purpose}</div>
                        </>
                      )}
                      
                      {objectType === 'ROCKET BODY' && (
                        <>
                          <div>Rocket Type:</div>
                          <div>{debrisData.rocketType}</div>
                        </>
                      )}
                      
                      {objectType === 'DEBRIS' && (
                        <>
                          <div>Risk Level:</div>
                          <div>{debrisData.riskLevel}</div>
                        </>
                      )}
                    </div>
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