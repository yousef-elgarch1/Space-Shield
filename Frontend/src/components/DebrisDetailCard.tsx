// Create a new file called DebrisDetailCard.tsx
import React from 'react';
import { Satellite, Rocket, Box, AlertTriangle, X } from 'lucide-react';

interface DebrisDetailCardProps {
  debris: any; // Replace with your specific debris type
  onClose: () => void;
}

const DebrisDetailCard: React.FC<DebrisDetailCardProps> = ({ debris, onClose }) => {
  // Get the appropriate icon based on debris type
  const getIcon = () => {
    const type = debris?.type?.toUpperCase() || '';
    
    if (type.includes('SATELLITE') || type.includes('PAYLOAD')) {
      return <Satellite className="w-12 h-12 text-green-500" />;
    } else if (type.includes('ROCKET') || type.includes('R/B')) {
      return <Rocket className="w-12 h-12 text-yellow-500" />;
    } else if (type.includes('DEBRIS') || type.includes('DEB')) {
      return <Box className="w-12 h-12 text-red-500" />;
    } else {
      return <Box className="w-12 h-12 text-blue-500" />;
    }
  };
  
  // Get the image path based on debris type
  const getImageSrc = () => {
    const type = debris?.type?.toUpperCase() || '';
    
    if (type.includes('SATELLITE') || type.includes('PAYLOAD')) {
      return '../../public/satellite.jpg'; // Make sure to add these images to your public folder
    } else if (type.includes('ROCKET') || type.includes('R/B')) {
      return '../../public/rocket.jpg';
    } else if (type.includes('DEBRIS') || type.includes('DEB')) {
      return '../../public/debris.jpg';
    } else {
      return '../../public/unknown.jfif';
    }
  };
  
  return (
    <div className="absolute top-4 right-4 w-80 bg-black bg-opacity-90 text-white rounded-lg shadow-lg overflow-hidden z-20">
      {/* Card Header */}
      <div className="relative p-4 bg-gray-800">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center">
          {getIcon()}
          <div className="ml-3">
            <h3 className="text-lg font-bold truncate">{debris.name}</h3>
            <p className="text-sm text-gray-300">{debris.type}</p>
          </div>
        </div>
      </div>
      
      {/* Object Image */}
      <div className="w-full h-40 bg-gray-700 overflow-hidden">
        <img 
          src={getImageSrc()} 
          alt={debris.type} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '../../public/placeholder.jpg'; // Fallback image
          }}
        />
      </div>
      
      {/* Object Details */}
      <div className="p-4">
        {/* Status Indicator */}
        <div className="mb-4">
          <div className="flex items-center">
            <div 
              className={`w-3 h-3 rounded-full mr-2 ${
                debris.status === 'critical' ? 'bg-red-500' : 
                debris.status === 'warning' ? 'bg-orange-500' : 'bg-green-500'
              }`}
            ></div>
            <span className="text-sm">
              {debris.status === 'critical' ? 'Critical Status' : 
               debris.status === 'warning' ? 'Warning Status' : 'Normal Status'}
            </span>
          </div>
        </div>
        
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="text-gray-400">Altitude:</div>
          <div>{debris.altitude || 'N/A'}</div>
          
          <div className="text-gray-400">Velocity:</div>
          <div>{debris.velocity || 'N/A'}</div>
          
          <div className="text-gray-400">Position:</div>
          <div>{debris.latitude?.toFixed(2)}°, {debris.longitude?.toFixed(2)}°</div>
        </div>
        
        {/* Orbital Parameters */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 text-blue-400">Orbital Parameters</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {debris.orbitParams?.inclination && (
              <>
                <div className="text-gray-400">Inclination:</div>
                <div>{debris.orbitParams.inclination}</div>
              </>
            )}
            
            {debris.orbitParams?.period && (
              <>
                <div className="text-gray-400">Period:</div>
                <div>{debris.orbitParams.period}</div>
              </>
            )}
            
            {debris.orbitParams?.apogee && (
              <>
                <div className="text-gray-400">Apogee:</div>
                <div>{debris.orbitParams.apogee}</div>
              </>
            )}
            
            {debris.orbitParams?.perigee && (
              <>
                <div className="text-gray-400">Perigee:</div>
                <div>{debris.orbitParams.perigee}</div>
              </>
            )}
          </div>
        </div>
        
        {/* Additional Info */}
        {debris.info && (
          <div className="text-sm text-gray-300 border-t border-gray-700 pt-3 mt-3">
            {debris.info}
          </div>
        )}
      </div>
    </div>
  );
};

export default DebrisDetailCard;