
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Satellite, Info, Database, MapPin } from 'lucide-react';

interface InfoPanelProps {
  debris: any;
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ debris, onClose }) => {
  if (!debris) return null;
  
  const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical': return 'bg-red-500 text-white';
      case 'warning': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-green-500 text-white';
    }
  };
  
  return (
    <Card className="p-4 bg-black bg-opacity-80 backdrop-blur-md border border-blue-900/30 text-white max-w-md">
      <CardHeader className="p-0 mb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Satellite size={18} className="mr-2 text-blue-400" />
            {debris.name}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <Info size={16} />
          </Button>
        </div>
        <div className="flex mt-2 gap-2">
          <Badge className={getStatusColor(debris.status)}>{debris.status}</Badge>
          <Badge variant="outline">{debris.type}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 space-y-4 text-sm">
        <div>
          <h3 className="font-semibold text-blue-400 mb-1">Position</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-gray-400">Latitude</p>
              <p>{debris.latitude?.toFixed(2)}°</p>
            </div>
            <div>
              <p className="text-gray-400">Longitude</p>
              <p>{debris.longitude?.toFixed(2)}°</p>
            </div>
            <div>
              <p className="text-gray-400">Altitude</p>
              <p>{debris.altitude}</p>
            </div>
            <div>
              <p className="text-gray-400">Updated</p>
              <p>{debris.lastUpdated}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-blue-400 mb-1">Orbital Parameters</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-gray-400">Inclination</p>
              <p>{debris.orbitParams?.inclination}</p>
            </div>
            <div>
              <p className="text-gray-400">Eccentricity</p>
              <p>{debris.orbitParams?.eccentricity}</p>
            </div>
            <div>
              <p className="text-gray-400">Period</p>
              <p>{debris.orbitParams?.period}</p>
            </div>
            <div>
              <p className="text-gray-400">Velocity</p>
              <p>{debris.velocity}</p>
            </div>
            <div>
              <p className="text-gray-400">Apogee</p>
              <p>{debris.orbitParams?.apogee}</p>
            </div>
            <div>
              <p className="text-gray-400">Perigee</p>
              <p>{debris.orbitParams?.perigee}</p>
            </div>
          </div>
        </div>
        
        {debris.tleData && (
          <div>
            <h3 className="font-semibold text-blue-400 mb-1">TLE Data</h3>
            <div className="bg-gray-900 p-2 rounded text-xs font-mono overflow-x-auto">
              <p>{debris.tleData.line1}</p>
              <p>{debris.tleData.line2}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-gray-400">NORAD ID</p>
                <p>{debris.tleData.noradCatId}</p>
              </div>
              <div>
                <p className="text-gray-400">Designation</p>
                <p>{debris.tleData.intDesignator}</p>
              </div>
              <div>
                <p className="text-gray-400">Classification</p>
                <p>{debris.tleData.classification}</p>
              </div>
              <div>
                <p className="text-gray-400">Rev Number</p>
                <p>{debris.tleData.revNumber}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="pt-2 flex justify-between">
          <div className="flex items-center text-xs text-gray-400">
            <Database size={12} className="mr-1" />
            Data from MySQL Database
          </div>
          <Button variant="outline" size="sm" className="text-xs" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
