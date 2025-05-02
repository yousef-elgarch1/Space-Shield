
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Satellite, Search, Filter, RefreshCw, ZoomIn, Database } from 'lucide-react';
import { useDebrisData, DebrisObject } from '@/hooks/useDebrisData';
import DebrisDetailPanel from './DebrisDetailPanel';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";

const MonitoringPanel: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedObject, setSelectedObject] = useState<DebrisObject | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const { debrisObjects, isLoading, error, refreshData } = useDebrisData();
  
  // Extract unique debris types for the filter
  const [debrisTypes, setDebrisTypes] = useState<string[]>([]);
  
  useEffect(() => {
    if (debrisObjects.length > 0) {
      const types = Array.from(new Set(debrisObjects.map(obj => obj.type)));
      setDebrisTypes(types);
    }
  }, [debrisObjects]);
  
  const filteredObjects = debrisObjects.filter(obj => {
    // Apply search filter
    const matchesSearch = 
      obj.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      obj.type.toLowerCase().includes(searchInput.toLowerCase()) ||
      (obj.tleData?.noradCatId && obj.tleData.noradCatId.includes(searchInput));
    
    // Apply type filter if any types are selected
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(obj.type);
    
    return matchesSearch && matchesType;
  });
  
  const handleRefresh = () => {
    refreshData();
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  
  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSearchInput('');
  };
  
  return (
    <div className="space-y-6">
      <Card className="stats-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-space-light-gray text-lg font-bold flex items-center">
            <Satellite size={18} className="mr-2 text-space-satellite-blue" />
            Orbital Objects Monitoring
            {isLoading && <span className="ml-2 text-sm text-muted-foreground">(Loading from MySQL...)</span>}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search objects by name, type or NORAD ID..." 
                className="pl-8 pr-4 py-2 rounded-md bg-space-dark-blue bg-opacity-50 border border-space-blue-900/30 text-space-light-gray text-sm w-80"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedTypes([])}>
              <Filter size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw size={18} />
            </Button>
          </div>
        </CardHeader>
        
        {/* Type filters */}
        <div className="px-6 py-2 overflow-x-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Filter by type:</span>
            {selectedTypes.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearFilters}
                className="text-xs h-7"
              >
                Clear filters
              </Button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {debrisTypes.map(type => (
              <Badge 
                key={type}
                variant={selectedTypes.includes(type) ? "default" : "outline"} 
                className={`cursor-pointer ${selectedTypes.includes(type) ? 'bg-space-satellite-blue' : 'hover:bg-space-blue-900/20'}`}
                onClick={() => handleTypeToggle(type)}
              >
                {type}
                {selectedTypes.includes(type) && (
                  <span className="ml-1 text-xs">✓</span>
                )}
              </Badge>
            ))}
          </div>
        </div>
        
        <CardContent>
          {error ? (
            <div className="p-4 text-center text-space-alert-red bg-space-alert-red/10 rounded-md">
              {error}
              <Button variant="outline" size="sm" className="ml-2" onClick={refreshData}>
                <RefreshCw size={14} className="mr-1" /> Try Again
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                <Database size={14} className="inline mr-1" />
                Make sure your MySQL database is running and accessible via the Spring Boot API
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-space-blue-900/30 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>NORAD ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Altitude</TableHead>
                    <TableHead>Inclination</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredObjects.length === 0 && !isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {searchInput || selectedTypes.length > 0 ? 
                          "No objects match your filters" : 
                          "No orbital objects data available in the MySQL database"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredObjects.map((object) => (
                      <TableRow key={object.id} className="cursor-pointer hover:bg-space-blue-900/10" onClick={() => setSelectedObject(object)}>
                        <TableCell className="font-medium">{object.name}</TableCell>
                        <TableCell>{object.tleData?.noradCatId || 'N/A'}</TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {selectedObject && (
            <div className="mt-6">
              <DebrisDetailPanel 
                debris={selectedObject} 
                onClose={() => setSelectedObject(null)}
                onTrack={() => {
                  // Implementation for tracking in 3D view would go here
                  setSelectedObject(null);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
        <div className="flex items-center">
          <Database size={14} className="mr-1.5" />
          Data source: MySQL Database via Spring Boot API
        </div>
        <div>Last refresh: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

export default MonitoringPanel;
