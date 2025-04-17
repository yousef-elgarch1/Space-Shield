
import React, { useState } from 'react';
import EarthVisualization from '@/components/EarthVisualization';
import AlertPanel from '@/components/AlertPanel';
import AlertsPanel from '@/components/AlertsPanel';
import StatisticsPanel from '@/components/StatisticsPanel';
import MonitoringPanel from '@/components/MonitoringPanel';
import SettingsPanel from '@/components/SettingsPanel';
import Navigation from '@/components/Navigation';
import { Satellite, Radar, AlertTriangle, BarChart3, Rocket, Maximize2, Minimize2, Info } from 'lucide-react';
import { Toast } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [fullscreenEarth, setFullscreenEarth] = useState(false);
  const [selectedDebris, setSelectedDebris] = useState<{id: string, name: string, info: string} | null>(null);
  const { toast: uiToast } = useToast();

  const handleSelectDebris = (debrisId: string, name: string, info: string) => {
    setSelectedDebris({ id: debrisId, name, info });
    
    // Show toast notification
    toast.info(
      <div>
        <h3 className="font-bold text-space-satellite-blue">{name}</h3>
        <p className="text-sm mt-1">{info.substring(0, 80)}...</p>
        <p className="text-xs mt-2 text-muted-foreground">Click for more details</p>
      </div>,
      {
        duration: 5000,
        onDismiss: () => setSelectedDebris(null),
        onAutoClose: () => setSelectedDebris(null),
        action: {
          label: "View",
          onClick: () => {
            setActiveTab('monitoring');
            // This would ideally select the debris in the monitoring panel
          }
        }
      }
    );
  };

  const toggleFullscreenEarth = () => {
    setFullscreenEarth(!fullscreenEarth);
    if (!fullscreenEarth) {
      uiToast({
        title: "Fullscreen Mode",
        description: "You can interact with the 3D visualization. Click and drag to rotate, scroll to zoom.",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-space-deep-black">
      {/* Full-screen Earth Visualization as background */}
      <div className="fixed inset-0 z-0">
        <EarthVisualization fullscreen={true} onSelectDebris={handleSelectDebris} />
      </div>
      
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 p-4 md:p-6 md:ml-64 relative z-10">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-space-light-gray glow-text">
              Space Debris Sentinel
            </h1>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1.5 bg-space-purple bg-opacity-20 text-space-purple rounded-md text-sm flex items-center">
                <Rocket size={16} className="mr-1.5" />
                <span>Orbits: 24,582</span>
              </div>
              <div className="px-3 py-1.5 bg-space-alert-red bg-opacity-20 text-space-alert-red rounded-md text-sm flex items-center">
                <AlertTriangle size={16} className="mr-1.5" />
                <span>Alerts: 3</span>
              </div>
              <button 
                onClick={toggleFullscreenEarth}
                className="p-2 bg-space-satellite-blue bg-opacity-20 text-space-satellite-blue rounded-md"
              >
                {fullscreenEarth ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>
          <p className="text-muted-foreground mt-1">
            Real-time space debris monitoring and collision prediction system
          </p>
        </div>
        
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-lg overflow-hidden h-[500px] relative">
              <div className={`absolute inset-0 ${fullscreenEarth ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
                <EarthVisualization onSelectDebris={handleSelectDebris} />
              </div>
              {fullscreenEarth && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <p className="text-white text-center">
                    <Maximize2 className="mx-auto mb-2" />
                    Earth view is in fullscreen mode
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <AlertPanel />
            </div>
            <div className="lg:col-span-3">
              <StatisticsPanel />
            </div>
          </div>
        )}
        
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 rounded-lg overflow-hidden h-[500px] relative">
                <div className={`absolute inset-0 ${fullscreenEarth ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
                  <EarthVisualization onSelectDebris={handleSelectDebris} />
                </div>
                {fullscreenEarth && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <p className="text-white text-center">
                      <Maximize2 className="mx-auto mb-2" />
                      Earth view is in fullscreen mode
                    </p>
                  </div>
                )}
              </div>
              <div>
                <AlertPanel />
              </div>
            </div>
            <MonitoringPanel />
          </div>
        )}
        
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <AlertsPanel />
              </div>
              <div>
                <AlertPanel />
              </div>
            </div>
            <div className="h-[400px] rounded-lg overflow-hidden relative">
              <div className={`absolute inset-0 ${fullscreenEarth ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
                <EarthVisualization onSelectDebris={handleSelectDebris} />
              </div>
              {fullscreenEarth && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <p className="text-white text-center">
                    <Maximize2 className="mx-auto mb-2" />
                    Earth view is in fullscreen mode
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'statistics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <StatisticsPanel />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-lg overflow-hidden h-[500px] relative">
                <div className={`absolute inset-0 ${fullscreenEarth ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
                  <EarthVisualization onSelectDebris={handleSelectDebris} />
                </div>
                {fullscreenEarth && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <p className="text-white text-center">
                      <Maximize2 className="mx-auto mb-2" />
                      Earth view is in fullscreen mode
                    </p>
                  </div>
                )}
              </div>
              <div>
                <AlertPanel />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div>
            <SettingsPanel />
          </div>
        )}
        
        {selectedDebris && (
          <div className="fixed bottom-6 right-6 p-4 bg-space-dark-blue bg-opacity-90 backdrop-blur-md rounded-lg border border-space-satellite-blue border-opacity-30 w-72 z-50 shadow-lg animate-fade-in">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-space-light-gray font-bold">{selectedDebris.name}</h3>
              <button 
                onClick={() => setSelectedDebris(null)}
                className="text-muted-foreground hover:text-white"
              >
                <Info size={16} />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{selectedDebris.info}</p>
            <div className="flex justify-between">
              <button 
                className="px-3 py-1 bg-space-satellite-blue bg-opacity-20 text-space-satellite-blue rounded text-xs"
                onClick={() => {
                  setActiveTab('monitoring');
                  // Ideally this would select the specific debris in the monitoring panel
                }}
              >
                View in Monitoring
              </button>
              <button 
                className="px-3 py-1 bg-space-alert-red bg-opacity-20 text-space-alert-red rounded text-xs"
                onClick={() => {
                  uiToast({
                    title: "AI Analysis Started",
                    description: "Analyzing collision probability and trajectory for " + selectedDebris.name,
                  });
                  setTimeout(() => {
                    uiToast({
                      title: "AI Analysis Complete",
                      description: "Collision probability: 28%. Trajectory analyzed and logged.",
                    });
                  }, 2000);
                }}
              >
                Run AI Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
