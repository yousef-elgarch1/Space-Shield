
import axios from 'axios';
import apiConfig from '@/config/apiConfig';
import { toast } from '@/components/ui/use-toast';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.requestSettings.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface OrbitResponse {
  objectName: string;
  latitude: number;
  longitude: number;
  altitude: number;
}

export interface TleData {
  id: number;
  objectName: string;
  objectId: string;
  noradCatId: string;
  classification: string;
  intDesignator: string;
  epochYear: number;
  epochDay: number;
  meanMotion: number;
  eccentricity: number;
  inclination: number;
  rightAscension: number;
  argumentOfPerigee: number;
  meanAnomaly: number;
  revNumber: number;
  line1: string;
  line2: string;
  type?: string;
}

// Toast notification helper for API errors
const showErrorToast = (message: string) => {
  toast({
    title: "API Error",
    description: message,
    variant: "destructive"
  });
};

// Fetch real-time orbit data from your Spring Boot backend
export const fetchRealtimeOrbits = async (): Promise<OrbitResponse[]> => {
  try {
    console.log('Fetching real-time orbits from:', apiConfig.baseUrl + apiConfig.endpoints.realTimeOrbits);
    const response = await apiClient.get(apiConfig.endpoints.realTimeOrbits);
    return response.data;
  } catch (error) {
    console.error('Error fetching real-time orbits:', error);
    showErrorToast('Failed to fetch real-time orbit data from MySQL database');
    return [];
  }
};

// Fetch TLE data by type (ROCKET BODY, DEBRIS, SATELLITE) from your database
export const fetchTleByType = async (type: string): Promise<TleData[]> => {
  try {
    console.log('Fetching TLE data for type:', type);
    const response = await apiClient.get(apiConfig.endpoints.tleByType, {
      params: { type }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching TLE data for type ${type}:`, error);
    showErrorToast(`Failed to fetch ${type} data from MySQL database`);
    return [];
  }
};

// Get the latest TLE entry from your database
export const fetchLatestTle = async (): Promise<TleData | null> => {
  try {
    const response = await apiClient.get(apiConfig.endpoints.latestTle);
    return response.data;
  } catch (error) {
    console.error('Error fetching latest TLE:', error);
    showErrorToast('Failed to fetch latest TLE data from MySQL database');
    return null;
  }
};

// Get the latest TLE entry for each unique object
export const fetchLatestTlePerObject = async (): Promise<TleData[]> => {
  try {
    console.log('Fetching latest TLE per object from:', apiConfig.baseUrl + apiConfig.endpoints.latestTlePerObject);
    const response = await apiClient.get(apiConfig.endpoints.latestTlePerObject);
    return response.data;
  } catch (error) {
    console.error('Error fetching latest TLE per object:', error);
    showErrorToast('Failed to fetch latest TLE data per object from MySQL database');
    return [];
  }
};

// Trigger manual TLE data fetch from your backend
export const triggerTleDataFetch = async (): Promise<string> => {
  try {
    const response = await apiClient.get(apiConfig.endpoints.fetch);
    return response.data;
  } catch (error) {
    console.error('Error triggering TLE data fetch:', error);
    showErrorToast('Failed to trigger TLE data update');
    return 'Failed to trigger data update';
  }
};

// Calculate orbital parameters based on TLE data
export const calculateOrbitalParameters = (tleData: TleData) => {
  // Convert TLE data to more user-friendly parameters
  const apogee = calculateApogee(tleData.meanMotion, tleData.eccentricity);
  const perigee = calculatePerigee(tleData.meanMotion, tleData.eccentricity);
  const period = calculatePeriod(tleData.meanMotion);
  
  return {
    apogee: `${apogee.toFixed(2)} km`,
    perigee: `${perigee.toFixed(2)} km`,
    period: `${period.toFixed(2)} min`,
    inclination: `${tleData.inclination.toFixed(2)}°`,
    eccentricity: tleData.eccentricity.toFixed(6),
    revNumber: tleData.revNumber,
    rightAscension: `${tleData.rightAscension.toFixed(2)}°`,
    argumentOfPerigee: `${tleData.argumentOfPerigee.toFixed(2)}°`,
    meanAnomaly: `${tleData.meanAnomaly.toFixed(2)}°`,
  };
};

// These are simplified calculations - replace with actual formula from orbital mechanics
const calculateApogee = (meanMotion: number, eccentricity: number): number => {
  const semiMajorAxis = 42164 / Math.pow(meanMotion * 0.0743, 2/3);
  return semiMajorAxis * (1 + eccentricity) - 6378.137; // Earth radius subtraction
};

const calculatePerigee = (meanMotion: number, eccentricity: number): number => {
  const semiMajorAxis = 42164 / Math.pow(meanMotion * 0.0743, 2/3);
  return semiMajorAxis * (1 - eccentricity) - 6378.137; // Earth radius subtraction
};

const calculatePeriod = (meanMotion: number): number => {
  // Convert to minutes
  return 1440 / meanMotion;
};
