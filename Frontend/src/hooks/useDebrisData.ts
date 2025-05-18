// Updated hooks/useDebrisData.ts
import { useState, useEffect, useRef } from 'react';

export interface DebrisObject {
  id: string;
  name: string;
  type: string;
  status: 'normal' | 'warning' | 'critical';
  latitude: number;
  longitude: number;
  altitude: number | string;
  velocity?: string;
  inclination?: string;
  lastUpdated?: string;
  info?: string;
  tleData?: any;
  orbitParams?: any;
  dataSource?: string;
  // Add timestamp for ordering and keeping track of when object was added
  timestamp?: number;
}

export const useDebrisData = () => {
  const [debrisObjects, setDebrisObjects] = useState<DebrisObject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('mysql');
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  
  // Store API responses for debug purposes
  const [apiResponses, setApiResponses] = useState<any>({
    orbit: [],
    satellite: [],
    rocket: [],
    debris: []
  });
  
  // Keep an object map for detecting duplicates and updates
  const objectMapRef = useRef(new Map<string, DebrisObject>());

  // Function to refresh data
  const refreshData = async () => {
    setIsFetching(true);
    await fetchData();
    setIsFetching(false);
  };

  // Function to force refresh from MySQL
  const forceRefreshFromMySQL = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the TLE fetch endpoint to reload data from source
      const fetchResponse = await fetch('http://localhost:8080/api/tle/fetch');
      if (!fetchResponse.ok) {
        throw new Error('Failed to refresh TLE data');
      }
      
      // After reloading, get the updated data
      await fetchData();
    } catch (err: any) {
      console.error('Error forcing MySQL refresh:', err);
      setError(`Failed to force refresh: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Main data fetching function
  const fetchData = async () => {
    try {
      setError(null);
      
      console.log('Fetching real-time orbit data...');
      const orbitResponse = await fetch('http://localhost:8080/api/orbit/realtime', {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!orbitResponse.ok) {
        throw new Error(`API error: ${orbitResponse.status}`);
      }
      
      const orbitData = await orbitResponse.json();
      console.log(`Received ${orbitData.length} orbit objects`);
      
      // Fetch TLE data for additional details
      const tleResponse = await fetch('http://localhost:8080/api/tle/latest-per-object');
      const satelliteResponse = await fetch('http://localhost:8080/api/tle/by-type?type=SATELLITE');
      const rocketResponse = await fetch('http://localhost:8080/api/tle/by-type?type=ROCKET%20BODY');
      const debrisResponse = await fetch('http://localhost:8080/api/tle/by-type?type=DEBRIS');
      
      if (!tleResponse.ok || !satelliteResponse.ok || !rocketResponse.ok) {
        throw new Error('Failed to fetch TLE data');
      }
      
      const tleData = await tleResponse.json();
      const satelliteData = await satelliteResponse.json();
      const rocketData = await rocketResponse.json();
      const debrisData = await debrisResponse.json();
      
      // Store API responses for debugging
      setApiResponses({
        orbit: orbitData,
        satellite: satelliteData,
        rocket: rocketData,
        debris: debrisData
      });
      
      // Create a map for fast TLE lookup
      const tleMap = new Map();
      tleData.forEach(tle => {
        tleMap.set(tle.objectName, tle);
      });
      
      // Transform the data for visualization
      const transformedData = orbitData.map((item: any) => {
        const objectName = item.objectName;
        const tleInfo = tleMap.get(objectName);
        
        // Determine object type
        let type = 'UNKNOWN';
        if (tleInfo?.objectType) {
          type = tleInfo.objectType;
        } else if (objectName.includes('R/B')) {
          type = 'ROCKET BODY';
        } else if (objectName.includes('DEB')) {
          type = 'DEBRIS';
        } else {
          type = 'SATELLITE';
        }
        
        // Determine status based on altitude and velocity
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        const altitude = typeof item.altitude === 'string' ? 
          parseFloat(item.altitude.replace(/[^0-9.]/g, '')) : 
          item.altitude;
          
        if (altitude < 200000) {
          status = 'critical';
        } else if (altitude < 500000) {
          status = 'warning';
        }
        
        // Create formatted orbit parameters
        const orbitParams = {
          inclination: tleInfo?.inclination ? `${tleInfo.inclination.toFixed(2)}°` : 'N/A',
          eccentricity: tleInfo?.eccentricity?.toFixed(6) || 'N/A',
          period: tleInfo?.period ? `${tleInfo.period.toFixed(2)} min` : 'N/A',
          apogee: tleInfo?.apogee ? `${tleInfo.apogee.toFixed(2)} km` : 'N/A',
          perigee: tleInfo?.perigee ? `${tleInfo.perigee.toFixed(2)} km` : 'N/A'
        };
        
        return {
          id: objectName,
          name: objectName,
          type: type,
          status: status,
          latitude: item.latitude,
          longitude: item.longitude,
          altitude: typeof item.altitude === 'number' ? 
            `${(item.altitude / 1000).toFixed(2)} km` : 
            item.altitude,
          lastUpdated: new Date().toLocaleString(),
          info: `Tracked space object at ${Math.round(
            typeof item.altitude === 'number' ? item.altitude / 1000 : 0
          )} km altitude`,
          tleData: {
            line1: tleInfo?.tleLine1 || 'N/A',
            line2: tleInfo?.tleLine2 || 'N/A',
            noradCatId: tleInfo?.noradCatId || 'N/A',
            intDesignator: tleInfo?.intldes || 'N/A',
            classification: tleInfo?.classificationType || 'U',
            revNumber: tleInfo?.revAtEpoch || 'N/A',
            epochYear: tleInfo?.epochYear || 'N/A',
            epochDay: tleInfo?.epochDay || 'N/A'
          },
          orbitParams: orbitParams,
          velocity: '7.8 km/s', // Approximate orbital velocity
          dataSource: 'mysql',
          timestamp: Date.now() // Add timestamp for sorting
        };
      });
      
      // Combine existing and new objects, keeping track of duplicates
      const objectMap = objectMapRef.current;
      
      // Add all new objects to the map
      transformedData.forEach((newObj) => {
        // If object already exists, update its position but keep the original timestamp
        if (objectMap.has(newObj.id)) {
          const existingObj = objectMap.get(newObj.id);
          // Preserve the original timestamp so we know when we first saw this object
          newObj.timestamp = existingObj?.timestamp || newObj.timestamp;
          
          // If position/data has changed significantly, update it
          objectMap.set(newObj.id, newObj);
        } else {
          // New object, add it to the map
          objectMap.set(newObj.id, newObj);
        }
      });
      
      // Convert map back to array, sorted by timestamp (newest first)
      const combinedData = Array.from(objectMap.values());
      
      // Update state with combined data
      // Inside fetchData function, replace:
setDebrisObjects(transformedData);

// With:
setDebrisObjects(prevObjects => {
  // Create a map of existing objects for quick lookup
  const existingMap = new Map(prevObjects.map(obj => [obj.id, obj]));
  
  // Merge new data with existing data
  transformedData.forEach(newObj => {
    existingMap.set(newObj.id, {
      ...newObj,
      // Keep timestamp if it exists, otherwise set a new one
      timestamp: existingMap.has(newObj.id) 
        ? existingMap.get(newObj.id).timestamp 
        : Date.now()
    });
  });
  
  // Convert back to array
  return Array.from(existingMap.values());
});



      setDataSource('mysql');
      setLastUpdated(new Date().toISOString());
    } catch (err: any) {
      console.error('Error fetching debris data:', err);
      setError(err.message);
      
      // If API fails, provide fallback data only if we have no data
      if (debrisObjects.length === 0) {
        // Load fallback data
        setDebrisObjects(getFallbackData());
        setDataSource('fallback');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    setIsLoading(true);
    fetchData();
    
    // Set up periodic refresh (every 20 seconds for testing, adjust as needed)
    const intervalId = setInterval(refreshData, 20000);
    
    return () => clearInterval(intervalId);
  }, []);

  return { 
    debrisObjects, 
    isLoading, 
    isFetching,
    error,
    refreshData,
    forceRefreshFromMySQL,
    dataSource,
    lastUpdated,
    apiResponses // Include API responses for debugging
  };
};

// Fallback data in case the API fails
const getFallbackData = (): DebrisObject[] => {
  // Return some sample data for testing
  return [
    {
      id: "EXPLORER 7",
      name: "EXPLORER 7",
      type: "SATELLITE",
      status: 'normal',
      latitude: -49.8042911966643,
      longitude: 131.06343502302,
      altitude: "2138.45 km",
      info: "Historic NASA satellite launched in 1959",
      orbitParams: {
        inclination: "50.28°",
        eccentricity: "0.009338",
        period: "94.84 min",
        apogee: "575.32 km",
        perigee: "446.65 km"
      },
      tleData: {
        line1: "1 00022U 59009A   25118.89478947 .00010074 00000-0 44662-3 0  9997",
        line2: "2 00022 50.2752 331.0479 0093385 267.9308 91.0952 15.18298277737190",
        noradCatId: "22",
        intDesignator: "59009A",
        classification: "U",
        revNumber: "73719"
      },
      dataSource: "fallback",
      timestamp: Date.now()
    },
    // Add more fallback items here...
  ];
};