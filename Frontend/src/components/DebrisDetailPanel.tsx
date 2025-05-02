
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Satellite, AlertTriangle, MapPin, Database } from 'lucide-react';
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
      case 'critical': return 'bg-space-alert-red text-white';
      case 'warning': return 'bg-space-warning-orange text-white';
      case 'normal': return 'bg-green-500 text-white';
    }
  };

  return (
    <Card className="border border-space-blue-900/30 bg-space-dark-blue bg-opacity-80 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle className="text-space-light-gray flex items-center">
            <Satellite size={18} className="mr-2 text-space-satellite-blue" />
            {debris.name}
          </CardTitle>
          <div className="flex items-center mt-1 space-x-2">
            <Badge variant="outline" className="text-xs">
              {debris.type}
            </Badge>
            {debris.tleData && (
              <Badge variant="outline" className="text-xs">
                NORAD: {debris.tleData.noradCatId}
              </Badge>
            )}
            <Badge className={`text-xs ${getStatusColor(debris.status)}`}>
              {debris.status.toUpperCase()}
            </Badge>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={onClose}>
          <Info size={16} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="position">
            <AccordionTrigger className="text-space-light-gray">
              Current Position
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Latitude</p>
                  <p className="text-space-light-gray">{debris.latitude.toFixed(2)}°</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Longitude</p>
                  <p className="text-space-light-gray">{debris.longitude.toFixed(2)}°</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Altitude</p>
                  <p className="text-space-light-gray">{debris.altitude}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-space-light-gray">{debris.lastUpdated}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="orbital">
            <AccordionTrigger className="text-space-light-gray">
              Orbital Parameters
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Inclination</p>
                  <p className="text-space-light-gray">{debris.inclination}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Velocity</p>
                  <p className="text-space-light-gray">{debris.velocity}</p>
                </div>
                {debris.orbitParams && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Apogee</p>
                      <p className="text-space-light-gray">{debris.orbitParams.apogee}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Perigee</p>
                      <p className="text-space-light-gray">{debris.orbitParams.perigee}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Period</p>
                      <p className="text-space-light-gray">{debris.orbitParams.period}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Eccentricity</p>
                      <p className="text-space-light-gray">{debris.orbitParams.eccentricity}</p>
                    </div>
                  </>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="risk">
            <AccordionTrigger className="text-space-light-gray">
              {debris.status !== 'normal' && (
                <AlertTriangle size={16} className={`mr-2 ${debris.status === 'critical' ? 'text-space-alert-red' : 'text-space-warning-orange'}`} />
              )}
              Risk Assessment
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 bg-space-blue-900/20 rounded-md">
                {debris.status === 'critical' ? (
                  <p className="text-sm text-space-alert-red">
                    High risk object. Potential conjunction event detected with 
                    other orbital objects. Close monitoring recommended.
                  </p>
                ) : debris.status === 'warning' ? (
                  <p className="text-sm text-space-warning-orange">
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
            <AccordionTrigger className="text-space-light-gray">
              <Database size={16} className="mr-2" />
              TLE Data from MySQL
            </AccordionTrigger>
            <AccordionContent>
              {debris.tleData ? (
                <>
                  <div className="bg-space-dark-blue p-3 rounded-md font-mono text-xs mb-3">
                    <p>{debris.tleData.line1}</p>
                    <p>{debris.tleData.line2}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">NORAD ID</p>
                      <p className="text-space-light-gray">{debris.tleData.noradCatId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">International Designator</p>
                      <p className="text-space-light-gray">{debris.tleData.intDesignator}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Epoch Year/Day</p>
                      <p className="text-space-light-gray">{debris.tleData.epochYear}/{debris.tleData.epochDay.toFixed(8)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rev Number</p>
                      <p className="text-space-light-gray">{debris.tleData.revNumber}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No TLE data available from database</p>
              )}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="info">
            <AccordionTrigger className="text-space-light-gray">
              Additional Information
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-space-light-gray">
                {debris.info}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-muted-foreground flex items-center">
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
                className="bg-space-satellite-blue hover:bg-space-satellite-blue/80"
                onClick={onTrack}
              >
                <MapPin size={16} className="mr-2" />
                Track in 3D View
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebrisDetailPanel;
