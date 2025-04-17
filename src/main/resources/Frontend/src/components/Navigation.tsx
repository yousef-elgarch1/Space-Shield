
import React from 'react';
import { Satellite, Radar, AlertTriangle, BarChart3, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Satellite size={20} /> },
    { id: 'monitoring', label: 'Monitoring', icon: <Radar size={20} /> },
    { id: 'alerts', label: 'Alerts', icon: <AlertTriangle size={20} /> },
    { id: 'statistics', label: 'Statistics', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-space-dark-blue bg-opacity-80 backdrop-blur-md border-t border-blue-900/30 md:relative md:border-t-0 md:border-r md:w-64 md:h-screen z-10">
      <div className="flex justify-center md:justify-start md:px-6 md:py-8">
        <div className="hidden md:flex items-center py-6">
          <div className="h-10 w-10 rounded-full bg-space-satellite-blue animate-pulse-glow flex items-center justify-center">
            <Satellite size={20} className="text-space-dark-blue" />
          </div>
          <h1 className="ml-3 text-xl font-bold text-space-light-gray">
            Space<span className="text-space-satellite-blue">Sentinel</span>
          </h1>
        </div>
      </div>
      
      <nav className="flex overflow-x-auto md:block md:space-y-1 md:px-2 pb-safe">
        <div className="flex md:flex-col md:space-y-1 w-full">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-center md:justify-start px-4 py-3 md:py-2 md:px-3 rounded-md ${
                activeTab === item.id 
                  ? 'bg-space-satellite-blue bg-opacity-20 text-space-satellite-blue' 
                  : 'text-gray-400 hover:text-space-light-gray hover:bg-white/5'
              } transition-colors flex-1 md:flex-none`}
            >
              <span className="mr-0 md:mr-3">{item.icon}</span>
              <span className="hidden md:block">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
      
      <div className="hidden md:block md:absolute md:bottom-0 md:left-0 md:right-0 md:p-4">
        <div className="p-3 rounded-md bg-space-satellite-blue bg-opacity-10 border border-space-satellite-blue border-opacity-20">
          <div className="flex items-center">
            <div className="status-indicator active mr-2"></div>
            <span className="text-xs text-space-light-gray">System operational</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Last updated: 2025-04-09 14:32
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
