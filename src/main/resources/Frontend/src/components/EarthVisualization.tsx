import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { DebrisOrbit } from './DebrisOrbit';

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  
  // Load textures with more reliable fallbacks
  const textures = useTexture({
    map: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb',
    bumpMap: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    specularMap: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb'
  });

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhongMaterial 
        map={textures.map}
        bumpMap={textures.bumpMap}
        bumpScale={0.15}
        specularMap={textures.specularMap}
        specular={new THREE.Color('grey')}
        shininess={10}
      />
    </mesh>
  );
};

interface DebrisInfoProps {
  position: [number, number, number];
  info: string;
  name: string;
  id: string;
  onSelect: (id: string, name: string, info: string) => void;
}

const DebrisInfo: React.FC<DebrisInfoProps> = ({ position, info, name, id, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      <mesh 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(id, name, info)}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? "#ff9900" : "#33c3f0"} 
          emissive={hovered ? "#ff9900" : "#33c3f0"} 
          emissiveIntensity={0.5} 
        />
      </mesh>
      {hovered && (
        <group>
          <Text
            position={[0, 0.2, 0]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {name}
          </Text>
          <Html position={[0, -0.2, 0]} center>
            <div className="px-2 py-1 bg-black bg-opacity-70 rounded text-white text-xs whitespace-nowrap">
              Click for details
            </div>
          </Html>
        </group>
      )}
    </group>
  );
};

interface EarthVisualizationProps {
  onSelectDebris?: (debrisId: string, name: string, info: string) => void;
  fullscreen?: boolean;
}

const EarthVisualization: React.FC<EarthVisualizationProps> = ({ 
  onSelectDebris,
  fullscreen = false
}) => {
  const debrisInfo = [
    { id: 'debris-1', name: 'Cosmos-1408 Debris', position: [3, 1, 2], info: 'Russian ASAT test debris from 2021. Highly hazardous with high collision probability.' },
    { id: 'debris-2', name: 'SL-16 R/B Fragment', position: [-3, 0.5, 2], info: 'Rocket body fragment from 1995. Medium risk, being monitored by multiple space agencies.' },
    { id: 'debris-3', name: 'Fengyun-1C Debris', position: [2, -1, -3], info: 'Chinese ASAT test debris from 2007. Created over 3,000 trackable fragments.' },
    { id: 'debris-4', name: 'ISS Orbit', position: [4, 0, 1], info: 'International Space Station orbital path at approximately 420km altitude.' },
    { id: 'debris-5', name: 'Starlink Constellation', position: [-2, -2, -2], info: 'SpaceX satellite constellation operating at 550km altitude.' },
    { id: 'debris-6', name: 'Iridium-33 Debris', position: [1, 3, -2], info: 'Debris from 2009 collision between Iridium 33 and Cosmos 2251 satellites.' }
  ];

  const handleDebrisClick = (debrisId: string, name: string, info: string) => {
    if (onSelectDebris) {
      onSelectDebris(debrisId, name, info);
    }
  };

  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-0' : 'w-full h-full rounded-lg overflow-hidden'}`}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
        
        <Earth />
        
        {/* Satellite debris orbits with different trajectories */}
        <DebrisOrbit 
          radius={3.5} 
          color="#33c3f0" 
          particles={15} 
          orbitAngle={0.1} 
          speed={0.8}
          isSatellite={true}
        />
        <DebrisOrbit 
          radius={4.2} 
          color="#ea384c" 
          particles={30} 
          orbitAngle={0.5} 
          speed={0.5}
        />
        <DebrisOrbit 
          radius={4.8} 
          color="#f97316" 
          particles={25} 
          orbitAngle={-0.3} 
          speed={0.3}
        />
        <DebrisOrbit 
          radius={5.5} 
          color="#8B5CF6" 
          particles={20} 
          orbitAngle={0.7} 
          speed={0.4}
          isSatellite={true}
        />
        
        {/* Interactive debris information points */}
        {debrisInfo.map((debris) => (
          <DebrisInfo 
            key={debris.id}
            id={debris.id}
            name={debris.name}
            position={debris.position as [number, number, number]} 
            info={debris.info}
            onSelect={handleDebrisClick}
          />
        ))}
        
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={15}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default EarthVisualization;
