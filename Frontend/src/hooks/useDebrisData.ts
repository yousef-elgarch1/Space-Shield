
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  fetchRealtimeOrbits, 
  fetchTleByType, 
  fetchLatestTlePerObject,
  OrbitResponse,
  TleData,
  calculateOrbitalParameters
} from '@/services/debrisApi';
import apiConfig from '@/config/apiConfig';

export interface DebrisObject {
  id: string;
  name: string;
  type: string;
  altitude: string;
  latitude: number;
  longitude: number;
  inclination: string;
  velocity: string;
  lastUpdated: string;
  status: 'normal' | 'warning' | 'critical';
  info: string;
  tleData?: TleData; // Include the original TLE data for detailed info
  orbitParams?: {
    apogee: string;
    perigee: string;
    period: string;
    inclination: string;
    eccentricity: string;
    revNumber: number;
    rightAscension: string;
    argumentOfPerigee: string;
    meanAnomaly: string;
  };
}

export function useDebrisData() {
  const [debrisObjects, setDebrisObjects] = useState<DebrisObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Helper function to determine object status based on parameters
  const determineStatus = (tleData: TleData): 'normal' | 'warning' | 'critical' => {
    // This is a simplified logic - in a real system, use more sophisticated assessment
    const perigee = (42164 / Math.pow(tleData.meanMotion * 0.0743, 2/3)) * (1 - tleData.eccentricity) - 6378.137;
    
    // Arbitrary thresholds for demonstration
    if (perigee < 250) return 'critical'; // Very low altitude
    if (tleData.eccentricity > 0.1) return 'warning'; // High eccentricity
    return 'normal';
  };

  // Generate a concise info description based on TLE data
  const generateInfo = (tleData: TleData): string => {
    const objectType = tleData.type || 'Unknown';
    const period = (1440 / tleData.meanMotion).toFixed(1);
    const inclination = tleData.inclination.toFixed(1);
    
    return `${objectType} with NORAD ID ${tleData.noradCatId}. Orbital period of ${period} minutes at ${inclination}° inclination. International designator: ${tleData.intDesignator}.`;
  };

  // Format the current date/time for lastUpdated field
  const getCurrentTimeString = (): string => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Convert TLE and orbit data to our application's debris object format
  const mapToDebrisObject = (tleData: TleData, orbitData?: OrbitResponse): DebrisObject => {
    const status = determineStatus(tleData);
    const info = generateInfo(tleData);
    const orbitParams = calculateOrbitalParameters(tleData);
    
    // Calculate velocity based on orbital parameters (simplified)
    const semiMajorAxis = 42164 / Math.pow(tleData.meanMotion * 0.0743, 2/3);
    const velocity = Math.sqrt(398600.4418 / semiMajorAxis).toFixed(2); // km/s
    
    return {
      id: tleData.noradCatId || `obj-${tleData.id}`,
      name: tleData.objectName || `Unknown Object ${tleData.id}`,
      type: tleData.type || 'Unknown',
      altitude: orbitData ? `${orbitData.altitude.toFixed(1)} km` : 'Unknown',
      latitude: orbitData?.latitude || 0,
      longitude: orbitData?.longitude || 0,
      inclination: `${tleData.inclination.toFixed(1)}°`,
      velocity: `${velocity} km/s`,
      lastUpdated: getCurrentTimeString(),
      status,
      info,
      tleData: tleData, // Store the original TLE data for reference
      orbitParams: orbitParams
    };
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching debris data from MySQL database via Spring Boot API...');
      
      // Fetch the latest TLE data for each object from MySQL
      const tleData = await fetchLatestTlePerObject();
      console.log('Received TLE data:', tleData.length, 'records');
      
      // Fetch real-time orbital positions
      const orbitData = await fetchRealtimeOrbits();
      console.log('Received orbit data:', orbitData.length, 'records');
      
      // Map orbit data by object name for easier lookup
      const orbitMap = new Map<string, OrbitResponse>();
      orbitData.forEach(orbit => {
        orbitMap.set(orbit.objectName, orbit);
      });
      
      // Combine TLE and orbit data
      const objects = tleData.map(tle => {
        const orbit = orbitMap.get(tle.objectName);
        return mapToDebrisObject(tle, orbit);
      });
      
      setDebrisObjects(objects);
      console.log('Processed debris objects:', objects.length);
      
      if (objects.length === 0) {
        setError('No debris data found in MySQL database');
        toast({
          title: "No Data",
          description: "No debris data found. The database might be empty.",
          variant: "destructive"
        });
      }
    } catch (err) {
      setError('Failed to fetch debris data from MySQL database');
      console.error('Error fetching debris data:', err);
      toast({
        title: "Database Connection Error",
        description: "Could not connect to MySQL database via the API",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, apiConfig.requestSettings.pollingInterval);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    debrisObjects,
    isLoading,
    error,
    refreshData: fetchData
  };
}
