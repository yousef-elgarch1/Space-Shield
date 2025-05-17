// components/DebrisDetailPanel.tsx
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Satellite, AlertTriangle, MapPin, Database, Rocket, Box } from 'lucide-react';
import { DebrisObject } from '@/hooks/useDebrisData';

interface DebrisDetailPanelProps {
  debris: DebrisObject | null;
  onClose: () => void;
  onTrack?: () => void;
}

const DebrisDetailPanel: React.FC<DebrisDetailPanelProps> = ({ 
  debris, 
  onClose,
  onTrack
}) => {
  if (!debris) return null;

  const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical': return 'bg-red-500 text-white';
      case 'warning': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-green-500 text-white';
    }
  };
  
  const getTypeIcon = (type: string) => {
    if (type.includes('SATELLITE')) return <Satellite size={16} className="mr-2 text-blue-400" />;
    if (type.includes('ROCKET')) return <Rocket size={16} className="mr-2 text-red-400" />;
    return <Box size={16} className="mr-2 text-orange-400" />;
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {getTypeIcon(debris.type)}
          <h3 className="text-lg font-semibold">{debris.name}</h3>
        </div>
        <div className="flex space-x-2">
          <Badge className={getStatusColor(debris.status)}>
            {debris.status.toUpperCase()}
          </Badge>
          <Button variant="outline" size="icon" onClick={onClose}>
            <Info size={16} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <div className="text-xs text-gray-400">Type</div>
          <div>{debris.type}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">NORAD ID</div>
          <div>{debris.tleData?.noradCatId || 'N/A'}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Altitude</div>
          <div>{debris.altitude}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Velocity</div>
          <div>{debris.velocity}</div>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="position">
          <AccordionTrigger className="text-white">
            Current Position
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Latitude</p>
                <p>{debris.latitude.toFixed(2)}°</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Longitude</p>
                <p>{debris.longitude.toFixed(2)}°</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Altitude</p>
                <p>{debris.altitude}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Last Updated</p>
                <p>{debris.lastUpdated}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="orbital">
          <AccordionTrigger className="text-white">
            Orbital Parameters
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Inclination</p>
                <p>{debris.inclination}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Velocity</p>
                <p>{debris.velocity}</p>
              </div>
              {debris.orbitParams && (
                <>
                  <div>
                    <p className="text-sm text-gray-400">Apogee</p>
                    <p>{debris.orbitParams.apogee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Perigee</p>
                    <p>{debris.orbitParams.perigee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Period</p>
                    <p>{debris.orbitParams.period}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Eccentricity</p>
                    <p>{debris.orbitParams.eccentricity}</p>
                  </div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="risk">
          <AccordionTrigger className="text-white">
            {debris.status !== 'normal' && (
              <AlertTriangle size={16} className={`mr-2 ${debris.status === 'critical' ? 'text-red-500' : 'text-orange-500'}`} />
            )}
            Risk Assessment
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 bg-blue-900/20 rounded-md">
              {debris.status === 'critical' ? (
                <p className="text-sm text-red-500">
                  High risk object. Potential conjunction event detected with 
                  other orbital objects. Close monitoring recommended.
                </p>
              ) : debris.status === 'warning' ? (
                <p className="text-sm text-orange-500">
                  Medium risk object. Unusual orbital parameters detected.
                  Continued monitoring advised.
                </p>
              ) : (
                <p className="text-sm text-green-500">
                  Low risk object. No unusual orbital parameters detected.
                  Routine monitoring in place.
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="tle">
          <AccordionTrigger className="text-white">
            <Database size={16} className="mr-2" />
            TLE Data
          </AccordionTrigger>
          <AccordionContent>
            {debris.tleData ? (
              <>
                <div className="bg-black p-3 rounded-md font-mono text-xs mb-3">
                  <p>{debris.tleData.line1}</p>
                  <p>{debris.tleData.line2}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">NORAD ID</p>
                    <p>{debris.tleData.noradCatId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">International Designator</p>
                    <p>{debris.tleData.intDesignator}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Epoch Year/Day</p>
                    <p>{debris.tleData.epochYear}/{debris.tleData.epochDay.toFixed(8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Rev Number</p>
                    <p>{debris.tleData.revNumber}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">No TLE data available</p>
            )}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="info">
          <AccordionTrigger className="text-white">
            Additional Information
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm">
              {debris.info}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-xs text-gray-400 flex items-center">
          <Database size={12} className="mr-1.5" /> 
          Data from MySQL Database
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
          {onTrack && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={onTrack}
            >
              <MapPin size={16} className="mr-2" />
              Track in 3D View
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default DebrisDetailPanel;