// components/DebugPanel.tsx
import React from 'react';
import { useDebrisData } from '@/hooks/useDebrisData';

const DebugPanel: React.FC = () => {
  const { apiResponses, isLoading, error, debrisObjects } = useDebrisData();

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 p-4 bg-black bg-opacity-90 border border-yellow-500 rounded-lg text-white text-sm max-w-md z-50">
        <h3 className="text-yellow-500 font-bold">API Debug Panel: Loading...</h3>
        <div className="animate-pulse mt-2">Fetching data from MySQL via Spring Boot API</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 p-4 bg-black bg-opacity-90 border border-red-500 rounded-lg text-white text-sm max-w-md z-50">
        <h3 className="text-red-500 font-bold">API Debug Panel: Error</h3>
        <div className="mt-2 text-red-400">{error}</div>
        <p className="mt-2 text-gray-400">Check the console for detailed logs</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black bg-opacity-90 border border-green-500 rounded-lg text-white text-sm max-w-md z-50 overflow-auto max-h-[80vh]">
      <h3 className="text-green-500 font-bold">API Debug Panel: Connected</h3>
      
      <div className="mt-2">
        <div className="flex items-center justify-between">
          <span>Orbit Data:</span>
          <span className="text-green-400">{apiResponses.orbit?.length || 0} objects</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Satellites:</span>
          <span className="text-green-400">{apiResponses.satellite?.length || 0} objects</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Rocket Bodies:</span>
          <span className="text-green-400">{apiResponses.rocket?.length || 0} objects</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Debris:</span>
          <span className="text-green-400">{apiResponses.debris?.length || 0} objects</span>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="text-blue-400">Sample Data:</h4>
        {debrisObjects.length > 0 ? (
          <pre className="text-xs mt-2 bg-gray-900 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(debrisObjects[0], null, 2)}
          </pre>
        ) : (
          <p className="text-red-400">No objects found</p>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        Last update: {new Date().toLocaleString()}
      </div>
      
      <button 
        className="mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs"
        onClick={() => console.log('API Responses:', apiResponses)}
      >
        Log Full Data to Console
      </button>
    </div>
  );
};

export default DebugPanel;