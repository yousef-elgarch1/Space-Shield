// Create a new file called ColorLegend.tsx or add this to your EarthVisualization.tsx
import React from 'react';
import { Satellite, Rocket, Box, AlertTriangle, HelpCircle } from 'lucide-react';

interface ColorLegendProps {
  visible: boolean;
}

const ColorLegend: React.FC<ColorLegendProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <div className="absolute left-4 bottom-4 bg-black bg-opacity-80 p-3 rounded-lg text-white text-sm z-10 max-w-xs">
      <h3 className="font-semibold mb-2 border-b border-gray-700 pb-1">Object Types</h3>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <Satellite size={14} className="mr-1 text-green-400" />
          <span>Payload/Satellite</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
          <Rocket size={14} className="mr-1 text-yellow-400" />
          <span>Rocket Body</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
          <Box size={14} className="mr-1 text-red-400" />
          <span>Debris</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
          <HelpCircle size={14} className="mr-1 text-blue-400" />
          <span>Unknown Object</span>
        </div>
      </div>
      
      <h3 className="font-semibold mt-3 mb-2 border-b border-gray-700 pb-1">Status Indicators</h3>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span>Normal</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
          <AlertTriangle size={14} className="mr-1 text-orange-400" />
          <span>Warning</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
          <AlertTriangle size={14} className="mr-1 text-red-400" />
          <span>Critical</span>
        </div>
      </div>
    </div>
  );
};

export default ColorLegend;