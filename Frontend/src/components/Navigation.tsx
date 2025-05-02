// components/Navigation.tsx
import React, { useState } from 'react';
import { Satellite, Radar, AlertTriangle, BarChart3, Settings, Menu, X } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Satellite size={20} /> },
    { id: 'monitoring', label: 'Monitoring', icon: <Radar size={20} /> },
    { id: 'alerts', label: 'Alerts', icon: <AlertTriangle size={20} /> },
    { id: 'statistics', label: 'Statistics', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 bg-space-dark-blue bg-opacity-70 hover:bg-opacity-100 text-space-satellite-blue rounded-md transition-all duration-200 shadow-lg md:hidden"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Navigation Sidebar - Mobile: slides up from bottom, Desktop: fixed left side */}
      <div className={`
        fixed left-0 bg-space-dark-blue bg-opacity-80 backdrop-blur-md border-blue-900/30 z-30
        transition-all duration-300 ease-in-out
        ${isMenuOpen ? 'bottom-0' : '-bottom-full'} 
        w-full border-t h-64
        md:h-screen md:bottom-0 md:w-64 md:border-t-0 md:border-r md:left-0
      `}>
        <div className="flex justify-center md:justify-start md:px-6 md:py-8">
          <div className="hidden md:flex items-center py-6">
            <div className="h-10 w-10 rounded-full bg-space-satellite-blue animate-pulse-glow flex items-center justify-center">
              <Satellite size={20} className="text-space-dark-blue" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-space-light-gray">
              Space<span className="text-space-satellite-blue">Shield</span>
            </h1>
          </div>
        </div>
        
        <nav className="flex overflow-x-auto md:block md:space-y-1 md:px-2 pb-safe">
          <div className="flex md:flex-col md:space-y-1 w-full">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMenuOpen(false); // Close menu on mobile when item is selected
                }}
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
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs text-space-light-gray">System operational</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Last updated: 2025-04-09 14:32
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay to close menu when clicking outside on mobile */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;