
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface DebrisOrbitProps {
  radius: number;
  color: string;
  particles: number;
  orbitAngle: number;
  speed: number;
  isSatellite?: boolean;
}

export const DebrisOrbit: React.FC<DebrisOrbitProps> = ({ 
  radius, 
  color, 
  particles, 
  orbitAngle,
  speed,
  isSatellite = false
}) => {
  const particlesRef = useRef<THREE.Group>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * speed;
    }
  });

  // Create orbit path
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

  // Generate random data for debris tooltips
  const generateDebrisData = (index: number) => {
    const types = ["Rocket Body", "Satellite Fragment", "Payload Debris", "Mission Related Object"];
    const countries = ["USA", "Russia", "China", "EU", "Japan", "India"];
    const years = Array.from({length: 30}, (_, i) => 1990 + i);
    
    return {
      id: `particle-${index}`,
      type: types[Math.floor(Math.random() * types.length)],
      origin: countries[Math.floor(Math.random() * countries.length)],
      year: years[Math.floor(Math.random() * years.length)],
      size: Math.floor(Math.random() * 50) + 5 + "cm",
      velocity: (7.2 + Math.random() * 0.8).toFixed(2) + " km/s"
    };
  };

  return (
    <group>
      {/* Orbit path */}
      <primitive object={new THREE.LineLoop(orbitGeometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 }))} />
      
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
                    <meshStandardMaterial color={color} />
                  </mesh>
                  <mesh position={[0, 0, 0.15]}>
                    <boxGeometry args={[0.3, 0.02, 0.02]} />
                    <meshStandardMaterial color="#aaaaaa" />
                  </mesh>
                </group>
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
                <Html position={[0, 0.2, 0]} center>
                  <div className="bg-black bg-opacity-80 p-2 rounded text-white text-xs whitespace-nowrap">
                    <div className="font-bold">{isSatelliteModel ? "Satellite" : debrisData.type}</div>
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
