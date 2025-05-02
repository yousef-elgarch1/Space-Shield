
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { DebrisOrbit } from './DebrisOrbit';
import { useDebrisData } from '@/hooks/useDebrisData';
import { InfoPanel } from './InfoPanel';
import { Satellite, Database } from 'lucide-react';

// Renamed from Earth to EarthGlobe to avoid conflict with Lucide icon
const EarthGlobe = () => {
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
  debris: {
    id: string;
    name: string;
    info: string;
    type: string;
    status: 'normal' | 'warning' | 'critical';
    tleData?: any;
    orbitParams?: any;
  };
  onSelect: (id: string, debris: any) => void;
}

const DebrisInfo: React.FC<DebrisInfoProps> = ({ position, debris, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  
  // Determine color based on status
  const getColor = () => {
    switch (debris.status) {
      case 'critical': return '#ea384c';
      case 'warning': return '#f97316';
      case 'normal': return '#33c3f0';
      default: return '#33c3f0';
    }
  };
  
  const color = getColor();
  
  return (
    <group position={position}>
      <mesh 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(debris.id, debris)}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? "#ff9900" : color} 
          emissive={hovered ? "#ff9900" : color} 
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
            {debris.name}
          </Text>
          <Html position={[0, -0.2, 0]} center>
            <div className="px-3 py-2 bg-black bg-opacity-80 rounded text-white text-xs whitespace-nowrap max-w-xs">
              <div className="font-bold">{debris.type}</div>
              <div className="mt-1">{debris.orbitParams?.period} orbit period</div>
              <div>{debris.orbitParams?.inclination} inclination</div>
              <div className="mt-1 text-yellow-400">Click for complete details</div>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
};

interface EarthVisualizationProps {
  onSelectDebris?: (debrisId: string, debris: any) => void;
  fullscreen?: boolean;
}

const EarthVisualization: React.FC<EarthVisualizationProps> = ({ 
  onSelectDebris,
  fullscreen = false
}) => {
  const { debrisObjects, isLoading } = useDebrisData();
  const [selectedDebrisId, setSelectedDebrisId] = useState<string | null>(null);
  
  // Convert debris data to visualization format
  const visualizationDebris = debrisObjects.map(debris => {
    // Convert latitude and longitude to 3D coordinates
    // This uses a simplified conversion for demo purposes
    const radius = 3 + Math.random() * 2; // Vary the orbital radius
    const phi = (90 - debris.latitude) * (Math.PI / 180);
    const theta = (debris.longitude + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    return {
      id: debris.id,
      position: [x, y, z] as [number, number, number],
      debris: {
        id: debris.id,
        name: debris.name,
        info: debris.info,
        type: debris.type,
        status: debris.status,
        tleData: debris.tleData,
        orbitParams: debris.orbitParams
      }
    };
  });

  const handleDebrisClick = (debrisId: string, debris: any) => {
    setSelectedDebrisId(debrisId);
    if (onSelectDebris) {
      onSelectDebris(debrisId, debris);
    }
  };

  // Group debris by type for different orbital visualizations
  const satelliteDebris = debrisObjects.filter(d => d.type.toLowerCase().includes('satellite'));
  const rocketDebris = debrisObjects.filter(d => d.type.toLowerCase().includes('rocket'));
  const generalDebris = debrisObjects.filter(d => 
    !d.type.toLowerCase().includes('satellite') && 
    !d.type.toLowerCase().includes('rocket')
  );

  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-0' : 'w-full h-full rounded-lg overflow-hidden'}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50">
          <div className="text-white text-center">
            <Database className="animate-pulse mx-auto mb-2" />
            <p>Loading debris data from MySQL...</p>
          </div>
        </div>
      )}
      
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
        
        <EarthGlobe />
        
        {/* Satellite debris orbits with different trajectories */}
        {!isLoading && (
          <>
            <DebrisOrbit 
              radius={3.5} 
              color="#33c3f0" 
              particles={Math.min(15, satelliteDebris.length || 15)} 
              orbitAngle={0.1} 
              speed={0.8}
              isSatellite={true}
            />
            <DebrisOrbit 
              radius={4.2} 
              color="#ea384c" 
              particles={Math.min(30, rocketDebris.length || 30)} 
              orbitAngle={0.5} 
              speed={0.5}
            />
            <DebrisOrbit 
              radius={4.8} 
              color="#f97316" 
              particles={Math.min(25, generalDebris.length || 25)} 
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
          </>
        )}
        
        {/* Interactive debris information points */}
        {visualizationDebris.map((debris) => (
          <DebrisInfo 
            key={debris.id}
            position={debris.position} 
            debris={debris.debris}
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

      {/* Connection status indicator */}
      {fullscreen && (
        <div className="absolute bottom-4 left-4 flex items-center bg-black bg-opacity-60 rounded-full px-3 py-1 text-white text-xs">
          <div className={`h-2 w-2 rounded-full mr-2 ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
          {isLoading ? 'Connecting to MySQL database...' : 'Connected to MySQL database'}
        </div>
      )}
    </div>
  );
};

export default EarthVisualization;
