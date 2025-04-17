
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Satellite, Search, Filter, RefreshCw, ZoomIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface OrbitObject {
  id: string;
  name: string;
  type: string;
  altitude: string;
  inclination: string;
  velocity: string;
  lastUpdated: string;
  status: 'normal' | 'warning' | 'critical';
}

const mockOrbitObjects: OrbitObject[] = [
  {
    id: 'sat-001',
    name: 'International Space Station',
    type: 'Space Station',
    altitude: '408 km',
    inclination: '51.6°',
    velocity: '7.66 km/s',
    lastUpdated: '1 min ago',
    status: 'normal'
  },
  {
    id: 'deb-001',
    name: 'Cosmos-1408 Debris',
    type: 'Debris',
    altitude: '461 km',
    inclination: '65.1°',
    velocity: '7.56 km/s',
    lastUpdated: '3 min ago',
    status: 'critical'
  },
  {
    id: 'sat-002',
    name: 'Starlink-1234',
    type: 'Satellite',
    altitude: '550 km',
    inclination: '53.0°',
    velocity: '7.42 km/s',
    lastUpdated: '2 min ago',
    status: 'normal'
  },
  {
    id: 'deb-002',
    name: 'SL-16 R/B Fragment',
    type: 'Debris',
    altitude: '512 km',
    inclination: '71.0°',
    velocity: '7.46 km/s',
    lastUpdated: '5 min ago',
    status: 'warning'
  },
  {
    id: 'deb-003',
    name: 'Fengyun-1C Debris',
    type: 'Debris',
    altitude: '326 km',
    inclination: '98.8°',
    velocity: '7.70 km/s',
    lastUpdated: '4 min ago',
    status: 'warning'
  }
];

const MonitoringPanel: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedObject, setSelectedObject] = useState<OrbitObject | null>(null);
  
  const filteredObjects = mockOrbitObjects.filter(obj => 
    obj.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    obj.type.toLowerCase().includes(searchInput.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <Card className="stats-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-space-light-gray text-lg font-bold flex items-center">
            <Satellite size={18} className="mr-2 text-space-satellite-blue" />
            Orbital Objects Monitoring
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search objects..." 
                className="pl-8 pr-4 py-2 rounded-md bg-space-dark-blue bg-opacity-50 border border-space-blue-900/30 text-space-light-gray text-sm w-64"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon">
              <Filter size={18} />
            </Button>
            <Button variant="ghost" size="icon">
              <RefreshCw size={18} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-space-blue-900/30 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Altitude</TableHead>
                  <TableHead>Inclination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredObjects.map((object) => (
                  <TableRow key={object.id} className="cursor-pointer hover:bg-space-blue-900/10" onClick={() => setSelectedObject(object)}>
                    <TableCell className="font-medium">{object.name}</TableCell>
                    <TableCell>{object.type}</TableCell>
                    <TableCell>{object.altitude}</TableCell>
                    <TableCell>{object.inclination}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div 
                          className={`h-2 w-2 rounded-full mr-2 ${
                            object.status === 'normal' 
                              ? 'bg-green-500' 
                              : object.status === 'warning' 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`}
                        />
                        <span>{object.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedObject(object);
                      }}>
                        <ZoomIn size={16} className="mr-1" /> Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {selectedObject && (
            <Card className="mt-6 border border-space-blue-900/30 bg-space-dark-blue bg-opacity-50">
              <CardHeader>
                <CardTitle className="text-space-light-gray">
                  {selectedObject.name} Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="overview">
                    <AccordionTrigger className="text-space-light-gray">Overview</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="text-space-light-gray">{selectedObject.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="text-space-light-gray">{selectedObject.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p className="text-space-light-gray">{selectedObject.lastUpdated}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="orbital">
                    <AccordionTrigger className="text-space-light-gray">Orbital Parameters</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Altitude</p>
                          <p className="text-space-light-gray">{selectedObject.altitude}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Inclination</p>
                          <p className="text-space-light-gray">{selectedObject.inclination}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Velocity</p>
                          <p className="text-space-light-gray">{selectedObject.velocity}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="ai-analysis">
                    <AccordionTrigger className="text-space-light-gray">AI Analysis</AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 bg-space-blue-900/20 rounded-md">
                        <p className="text-sm text-space-light-gray">
                          The AI prediction model indicates a 82% probability that this object will maintain its current orbit for the next 30 days. No significant risks identified at this time.
                        </p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Analysis generated by SpaceSentinel AI - Updated 25 minutes ago
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => setSelectedObject(null)}
                  >
                    Close
                  </Button>
                  <Button>Track in 3D View</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringPanel;
