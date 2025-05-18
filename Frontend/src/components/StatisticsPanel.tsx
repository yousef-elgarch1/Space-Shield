// components/StatisticsPanel.tsx
import React, { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Radar, Satellite, Database, Shield, AlertTriangle, BarChart3, Zap, MapPin, Globe } from 'lucide-react';
// Changed 'Map' to 'MapPin' or 'Globe' to avoid conflict with JavaScript's Map object

// Mock data with more realistic values
const MOCK_DEBRIS_DATA = [
  { id: 1, name: 'COSMOS 2251 Fragment', type: 'debris', altitude: 780, status: 'normal', region: 'LEO', size: 'small', velocity: 7.8, country: 'RUS', launchYear: 1993 },
  { id: 2, name: 'SL-16 R/B', type: 'rocket', altitude: 850, status: 'warning', region: 'LEO', size: 'large', velocity: 7.5, country: 'RUS', launchYear: 1995 },
  { id: 3, name: 'Fengyun-1C Debris', type: 'debris', altitude: 865, status: 'normal', region: 'LEO', size: 'small', velocity: 7.4, country: 'CHN', launchYear: 2007 },
  { id: 4, name: 'COSMOS 1408 Debris', type: 'debris', altitude: 480, status: 'critical', region: 'LEO', size: 'medium', velocity: 7.9, country: 'RUS', launchYear: 2021 },
  { id: 5, name: 'Iridium 33 Debris', type: 'debris', altitude: 790, status: 'normal', region: 'LEO', size: 'small', velocity: 7.5, country: 'USA', launchYear: 2009 },
  { id: 6, name: 'Starlink-1234', type: 'satellite', altitude: 550, status: 'normal', region: 'LEO', size: 'medium', velocity: 7.6, country: 'USA', launchYear: 2019 },
  { id: 7, name: 'ISS', type: 'satellite', altitude: 420, status: 'normal', region: 'LEO', size: 'large', velocity: 7.7, country: 'INT', launchYear: 1998 },
  { id: 8, name: 'OneWeb-0047', type: 'satellite', altitude: 1200, status: 'normal', region: 'LEO', size: 'medium', velocity: 7.2, country: 'GBR', launchYear: 2020 },
  { id: 9, name: 'GOES-16', type: 'satellite', altitude: 35786, status: 'normal', region: 'GEO', size: 'large', velocity: 3.1, country: 'USA', launchYear: 2016 },
  { id: 10, name: 'Sentinel-2A', type: 'satellite', altitude: 786, status: 'normal', region: 'LEO', size: 'large', velocity: 7.5, country: 'ESA', launchYear: 2015 },
  { id: 11, name: 'Hubble Space Telescope', type: 'satellite', altitude: 540, status: 'normal', region: 'LEO', size: 'large', velocity: 7.6, country: 'USA', launchYear: 1990 },
  { id: 12, name: 'Kosmos-2551 Debris', type: 'debris', altitude: 350, status: 'warning', region: 'LEO', size: 'small', velocity: 7.9, country: 'RUS', launchYear: 2021 },
  { id: 13, name: 'CZ-5B R/B', type: 'rocket', altitude: 300, status: 'critical', region: 'LEO', size: 'large', velocity: 7.9, country: 'CHN', launchYear: 2021 },
  { id: 14, name: 'GPS IIF-12', type: 'satellite', altitude: 20180, status: 'normal', region: 'MEO', size: 'medium', velocity: 3.9, country: 'USA', launchYear: 2016 },
  { id: 15, name: 'GLONASS-M', type: 'satellite', altitude: 19100, status: 'normal', region: 'MEO', size: 'medium', velocity: 3.9, country: 'RUS', launchYear: 2010 },
  { id: 16, name: 'Galileo FOC FM10', type: 'satellite', altitude: 23222, status: 'normal', region: 'MEO', size: 'medium', velocity: 3.7, country: 'ESA', launchYear: 2018 },
  { id: 17, name: 'Intelsat 901', type: 'satellite', altitude: 35786, status: 'normal', region: 'GEO', size: 'large', velocity: 3.1, country: 'INT', launchYear: 2001 },
  { id: 18, name: 'AEHF-6', type: 'satellite', altitude: 35786, status: 'normal', region: 'GEO', size: 'large', velocity: 3.1, country: 'USA', launchYear: 2020 },
  { id: 19, name: 'Eutelsat 36B', type: 'satellite', altitude: 35786, status: 'normal', region: 'GEO', size: 'large', velocity: 3.1, country: 'FRA', launchYear: 2009 },
  { id: 20, name: 'Tiangong Space Station', type: 'satellite', altitude: 390, status: 'normal', region: 'LEO', size: 'large', velocity: 7.7, country: 'CHN', launchYear: 2021 },
  // Generate additional mock debris items
  ...Array.from({ length: 80 }, (_, i) => ({
    id: 21 + i,
    name: `Debris Object #${i + 1}`,
    type: 'debris',
    altitude: Math.floor(Math.random() * 1500) + 300,
    status: Math.random() > 0.85 ? 'warning' : Math.random() > 0.95 ? 'critical' : 'normal',
    region: 'LEO',
    size: Math.random() > 0.7 ? 'small' : Math.random() > 0.4 ? 'medium' : 'large',
    velocity: (Math.random() * 1) + 7.2,
    country: ['USA', 'RUS', 'CHN', 'ESA', 'INT'][Math.floor(Math.random() * 5)],
    launchYear: Math.floor(Math.random() * 40) + 1980
  })),
  // Generate additional rocket bodies
  ...Array.from({ length: 15 }, (_, i) => ({
    id: 101 + i,
    name: `Rocket Body #${i + 1}`,
    type: 'rocket',
    altitude: Math.floor(Math.random() * 1500) + 300,
    status: Math.random() > 0.8 ? 'warning' : Math.random() > 0.95 ? 'critical' : 'normal',
    region: 'LEO',
    size: 'large',
    velocity: (Math.random() * 1) + 7.2,
    country: ['USA', 'RUS', 'CHN', 'ESA', 'FRA'][Math.floor(Math.random() * 5)],
    launchYear: Math.floor(Math.random() * 40) + 1980
  })),
  // Generate additional satellites
  ...Array.from({ length: 40 }, (_, i) => ({
    id: 116 + i,
    name: `${Math.random() > 0.5 ? 'Defunct ' : ''}Satellite #${i + 1}`,
    type: 'satellite',
    altitude: Math.random() > 0.2 ? 
      (Math.floor(Math.random() * 1500) + 300) : 
      (Math.random() > 0.5 ? 20000 + Math.floor(Math.random() * 5000) : 35786),
    status: Math.random() > 0.9 ? 'warning' : Math.random() > 0.98 ? 'critical' : 'normal',
    region: Math.random() > 0.8 ? 'LEO' : Math.random() > 0.5 ? 'MEO' : 'GEO',
    size: Math.random() > 0.6 ? 'medium' : 'large',
    velocity: Math.random() > 0.8 ? 3.1 + (Math.random() * 0.5) : 7.2 + (Math.random() * 0.8),
    country: ['USA', 'RUS', 'CHN', 'ESA', 'INT', 'JPN', 'IND', 'FRA', 'GBR'][Math.floor(Math.random() * 9)],
    launchYear: Math.floor(Math.random() * 25) + 2000
  }))
];

// Mock data for collision risk over time (more detailed)
const COLLISION_RISK_DATA = [
  { name: 'Jan', risk: 2.4, leo: 3.1, meo: 1.2, geo: 0.8 },
  { name: 'Feb', risk: 2.6, leo: 3.3, meo: 1.3, geo: 0.7 },
  { name: 'Mar', risk: 3.1, leo: 3.8, meo: 1.4, geo: 0.9 },
  { name: 'Apr', risk: 3.5, leo: 4.2, meo: 1.5, geo: 0.8 },
  { name: 'May', risk: 3.8, leo: 4.5, meo: 1.6, geo: 0.9 },
  { name: 'Jun', risk: 4.2, leo: 5.0, meo: 1.7, geo: 0.9 },
  { name: 'Jul', risk: 4.6, leo: 5.4, meo: 1.8, geo: 1.0 },
  { name: 'Aug', risk: 4.4, leo: 5.2, meo: 1.7, geo: 0.9 },
  { name: 'Sep', risk: 4.1, leo: 4.9, meo: 1.6, geo: 0.8 },
  { name: 'Oct', risk: 3.9, leo: 4.7, meo: 1.5, geo: 0.7 },
  { name: 'Nov', risk: 4.2, leo: 5.1, meo: 1.6, geo: 0.8 },
  { name: 'Dec', risk: 4.5, leo: 5.3, meo: 1.7, geo: 0.9 },
];

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
  trend?: number; // Percentage change
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, isLoading = false, trend }) => (
  <div className="stats-card relative rounded-lg p-4 bg-black bg-opacity-80 backdrop-blur-md border border-blue-900/30 overflow-hidden group hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
    {/* Glow effect */}
    <div 
      className="absolute inset-0 bg-gradient-to-r opacity-10 group-hover:opacity-20 transition-opacity duration-300" 
      style={{ background: `radial-gradient(circle at 30% 107%, ${color}20 0%, ${color}05 25%, transparent 70%)` }}
    ></div>
    
    <div className="flex items-center justify-between relative z-10">
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <h4 className={`text-2xl font-bold ${isLoading ? 'animate-pulse' : ''}`} style={{ color }}>
          {value}
        </h4>
        {trend !== undefined && (
          <div className={`text-xs mt-1 flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from previous period
          </div>
        )}
      </div>
      <div 
        className="p-3 rounded-full" 
        style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
      >
        {icon}
      </div>
    </div>
  </div>
);

const COLORS = ['#33c3f0', '#8B5CF6', '#f97316', '#ea384c', '#10b981'];

const StatisticsPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [debrisObjects, setDebrisObjects] = useState(MOCK_DEBRIS_DATA);
  const [selectedChart, setSelectedChart] = useState('all');
  
  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);
  
  // Calculate statistics
  const totalTrackedObjects = debrisObjects.length;
  
  // Derive additional statistics
  const rocketBodies = debrisObjects.filter(d => 
    d.type === 'rocket'
  );
  
  const satellites = debrisObjects.filter(d => 
    d.type === 'satellite'
  );
  
  const activeSatellites = satellites.filter(d => 
    !d.name.toLowerCase().includes('defunct')
  );
  
  const inactiveSatellites = satellites.filter(d => 
    d.name.toLowerCase().includes('defunct')
  );
  
  const debrisItems = debrisObjects.filter(d => 
    d.type === 'debris'
  );
  
  const otherObjects = debrisObjects.filter(d => 
    !['satellite', 'rocket', 'debris'].includes(d.type)
  );

  // Group debris by category for chart
  const debrisByCategory = [
    { 
      category: 'Rocket Bodies', 
      count: rocketBodies.length,
      color: '#33c3f0' 
    },
    { 
      category: 'Active Satellites', 
      count: activeSatellites.length,
      color: '#10b981' 
    },
    { 
      category: 'Inactive Satellites', 
      count: inactiveSatellites.length,
      color: '#8B5CF6' 
    },
    { 
      category: 'Fragmentation Debris', 
      count: debrisItems.length,
      color: '#f97316' 
    },
    { 
      category: 'Mission-related Debris', 
      count: otherObjects.length,
      color: '#ea384c' 
    },
  ];

  // Group by orbital altitude ranges
  const altitudeRanges = useMemo(() => {
    const ranges = [
      { name: 'LEO (< 2,000 km)', count: 0 },
      { name: 'MEO (2,000-35,786 km)', count: 0 },
      { name: 'GEO (35,786 km)', count: 0 },
      { name: 'HEO (> 35,786 km)', count: 0 },
    ];
    
    debrisObjects.forEach(d => {
      const alt = typeof d.altitude === 'string' ? 
        parseFloat(d.altitude.replace(/[^0-9.]/g, '')) : 
        d.altitude;
      
      if (alt < 2000) ranges[0].count++;
      else if (alt < 35786) ranges[1].count++;
      else if (alt >= 35786 && alt <= 35787) ranges[2].count++;
      else ranges[3].count++;
    });
    
    return ranges;
  }, [debrisObjects]);

  // Calculate risk metrics
  const criticalObjects = debrisObjects.filter(d => d.status === 'critical').length;
  const warningObjects = debrisObjects.filter(d => d.status === 'warning').length;
  
  // Group by country of origin
  const countryDistribution = useMemo(() => {
    const countryMap = new Map();
    
    debrisObjects.forEach(item => {
      const country = item.country || 'Unknown';
      countryMap.set(country, (countryMap.get(country) || 0) + 1);
    });
    
    return Array.from(countryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 countries
  }, [debrisObjects]);

  // Calculate debris concentration
  let debrisConcentration = "Low";
  if (totalTrackedObjects > 200) debrisConcentration = "High";
  else if (totalTrackedObjects > 100) debrisConcentration = "Medium";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Database size={20} className="text-blue-400 mr-2" />
          Space Debris Statistics
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setSelectedChart('all')}
            className={`px-3 py-1 text-sm rounded ${
              selectedChart === 'all' ? 'bg-blue-600' : 'bg-black bg-opacity-60 border border-gray-700'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setSelectedChart('leo')}
            className={`px-3 py-1 text-sm rounded ${
              selectedChart === 'leo' ? 'bg-blue-600' : 'bg-black bg-opacity-60 border border-gray-700'
            }`}
          >
            LEO
          </button>
          <button 
            onClick={() => setSelectedChart('trends')}
            className={`px-3 py-1 text-sm rounded ${
              selectedChart === 'trends' ? 'bg-blue-600' : 'bg-black bg-opacity-60 border border-gray-700'
            }`}
          >
            Trends
          </button>
        </div>
      </div>
      
      {/* Glowing border effect */}
      <div className="relative mb-4 p-px rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-30"></div>
        <div className="relative py-4 px-6 bg-black bg-opacity-90 backdrop-blur-lg rounded-lg">
          <p className="text-cyan-300 text-sm flex items-center">
            <AlertTriangle size={16} className="mr-2 text-orange-400" />
            Current debris concentration in monitored space regions is <span className="font-bold ml-1">
              {debrisConcentration}
            </span>
            <span className="ml-auto text-xs bg-blue-900 bg-opacity-50 px-2 py-1 rounded flex items-center">
              <Zap size={12} className="mr-1 text-yellow-400" />
              LIVE DATA
            </span>
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Tracked Objects" 
          value={isLoading ? "Loading..." : totalTrackedObjects.toString()} 
          icon={<Radar size={24} className="text-blue-400" />}
          color="#33c3f0"
          isLoading={isLoading}
          trend={5.2}
        />
        <StatCard 
          title="Active Satellites" 
          value={isLoading ? "Loading..." : activeSatellites.length.toString()} 
          icon={<Satellite size={24} className="text-purple-400" />}
          color="#8B5CF6"
          isLoading={isLoading}
          trend={8.7}
        />
        <StatCard 
          title="Critical Objects" 
          value={isLoading ? "Loading..." : criticalObjects.toString()} 
          icon={<AlertTriangle size={24} className="text-red-400" />}
          color="#ea384c"
          isLoading={isLoading}
          trend={-2.3}
        />
        <StatCard 
          title="Rocket Bodies" 
          value={isLoading ? "Loading..." : rocketBodies.length.toString()} 
          icon={<Zap size={24} className="text-orange-400" />}
          color="#f97316"
          isLoading={isLoading}
          trend={0.0}
        />
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Debris by Category */}
        <div className="space-card relative rounded-lg overflow-hidden group hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/5"></div>
          
          <div className="relative rounded-lg border border-blue-900/30 bg-black bg-opacity-80 backdrop-blur-md text-white">
            <div className="flex justify-between items-center p-4 border-b border-blue-900/30">
              <h3 className="text-lg font-medium flex items-center">
                <Database size={18} className="mr-2 text-blue-400" />
                Debris by Category
              </h3>
              <span className="text-xs text-gray-400">
                Updated: {new Date().toLocaleString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
            </div>
            <div className="p-4">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={debrisByCategory} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="category" 
                      type="category" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#f6f6f7', fontSize: 12 }}
                      width={130}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        borderColor: 'rgba(51, 195, 240, 0.3)',
                        color: '#f6f6f7',
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                      }}
                      formatter={(value) => [`${value} objects`, 'Count']}
                    />
                    <Bar 
                      dataKey="count" 
                      radius={[0, 4, 4, 0]}
                      fill="#33c3f0"
                      background={{ fill: 'rgba(51, 195, 240, 0.05)' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-gray-400 text-right mt-2 flex justify-between items-center">
                <div className="text-cyan-400 flex items-center">
                  <Shield size={12} className="mr-1" />
                  <span>Classification accuracy: 98.5%</span>
                </div>
                <span>Data source: MySQL via Spring Boot API</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orbital Distribution */}
        <div className="space-card relative rounded-lg overflow-hidden group hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-300">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 to-blue-600/5"></div>
          
          <div className="relative rounded-lg border border-blue-900/30 bg-black bg-opacity-80 backdrop-blur-md text-white">
            <div className="flex justify-between items-center p-4 border-b border-blue-900/30">
              <h3 className="text-lg font-medium flex items-center">
                <BarChart3 size={18} className="mr-2 text-purple-400" />
                Orbital Distribution
              </h3>
              <div className="flex space-x-1">
                <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                <span className="h-2 w-2 rounded-full bg-orange-400"></span>
                <span className="h-2 w-2 rounded-full bg-green-400"></span>
              </div>
            </div>
            <div className="p-4">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={altitudeRanges}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {altitudeRanges.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                        color: '#f6f6f7',
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                      }}
                      formatter={(value) => [`${value} objects`, 'Count']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-blue-900 bg-opacity-30 rounded p-2 text-center">
                  <div className="text-blue-400 text-sm font-bold">{altitudeRanges[0].count}</div>
                  <div className="text-gray-400 text-xs">LEO Objects</div>
                </div>
                <div className="bg-purple-900 bg-opacity-30 rounded p-2 text-center">
                  <div className="text-purple-400 text-sm font-bold">{altitudeRanges[1].count}</div>
                  <div className="text-gray-400 text-xs">MEO Objects</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collision Risk Trend */}
        <div className="space-card relative rounded-lg overflow-hidden group hover:shadow-lg hover:shadow-orange-900/20 transition-all duration-300">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-red-600/5"></div>
          
          <div className="relative rounded-lg border border-blue-900/30 bg-black bg-opacity-80 backdrop-blur-md text-white">
            <div className="flex justify-between items-center p-4 border-b border-blue-900/30">
              <h3 className="text-lg font-medium flex items-center">
                <Shield size={18} className="mr-2 text-orange-400" />
                Collision Risk Trend
              </h3>
              <div className="flex items-center text-xs text-gray-400">
                <span className="inline-block w-3 h-1 bg-orange-500 rounded-full mr-1"></span>
                Overall Risk Index
              </div>
            </div>
            <div className="p-4">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={COLLISION_RISK_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#f6f6f7', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#f6f6f7', fontSize: 12 }}
                      domain={[0, 6]}
                    />
 // Continuing from where you left off:

                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.85)', 
                        borderColor: 'rgba(249, 115, 22, 0.3)', 
                        color: '#f6f6f7', 
                        borderRadius: '4px', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                      }}
                      formatter={(value) => [`${value}`, 'Risk Index']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="risk" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={{ fill: '#f97316', r: 4 }}
                      activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="leo" 
                      stroke="#3b82f6" 
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      dot={{ fill: '#3b82f6', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="meo" 
                      stroke="#8b5cf6" 
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      dot={{ fill: '#8b5cf6', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-1 bg-blue-500 mr-1"></span>
                    <span className="text-gray-400">LEO</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-1 bg-purple-500 mr-1"></span>
                    <span className="text-gray-400">MEO</span>
                  </div>
                </div>
                <div className="text-gray-400">
                  AI Risk Prediction Model v2.5
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="space-card relative rounded-lg overflow-hidden group hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-tl from-red-500/10 to-orange-600/5"></div>
          
          <div className="relative rounded-lg border border-blue-900/30 bg-black bg-opacity-80 backdrop-blur-md text-white">
            <div className="flex justify-between items-center p-4 border-b border-blue-900/30">
              <h3 className="text-lg font-medium flex items-center">
                <AlertTriangle size={18} className="mr-2 text-red-400" />
                Status Distribution
              </h3>
              <button className="text-xs bg-blue-900 bg-opacity-40 px-2 py-1 rounded hover:bg-blue-900 transition-colors">
                View All
              </button>
            </div>
            <div className="p-4">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Normal', value: totalTrackedObjects - criticalObjects - warningObjects },
                        { name: 'Warning', value: warningObjects },
                        { name: 'Critical', value: criticalObjects }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#f97316" />
                      <Cell fill="#ea384c" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        borderColor: 'rgba(234, 56, 76, 0.3)',
                        color: '#f6f6f7',
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                      }}
                      formatter={(value) => [`${value} objects`, 'Count']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="bg-green-900 bg-opacity-30 rounded p-2 text-center">
                  <div className="text-green-400 text-sm font-bold">{totalTrackedObjects - criticalObjects - warningObjects}</div>
                  <div className="text-gray-400 text-xs">Normal</div>
                </div>
                <div className="bg-orange-900 bg-opacity-30 rounded p-2 text-center">
                  <div className="text-orange-400 text-sm font-bold">{warningObjects}</div>
                  <div className="text-gray-400 text-xs">Warning</div>
                </div>
                <div className="bg-red-900 bg-opacity-30 rounded p-2 text-center">
                  <div className="text-red-400 text-sm font-bold">{criticalObjects}</div>
                  <div className="text-gray-400 text-xs">Critical</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Chart Row */}
      <div className="space-card relative rounded-lg overflow-hidden group hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-600/5 to-blue-500/10"></div>
        
        <div className="relative rounded-lg border border-blue-900/30 bg-black bg-opacity-80 backdrop-blur-md text-white">
          <div className="flex justify-between items-center p-4 border-b border-blue-900/30">
            <h3 className="text-lg font-medium flex items-center">
              <Globe size={18} className="mr-2 text-cyan-400" />
              Object Distribution by Country
            </h3>
            <div className="flex items-center text-xs bg-blue-900 bg-opacity-30 px-2 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mr-1"></span>
              Correlation Analysis
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={countryDistribution}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis type="number" stroke="#6B7280" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke="#6B7280"
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.85)',
                          borderColor: 'rgba(56, 189, 248, 0.3)',
                          color: '#f6f6f7',
                          borderRadius: '4px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                        }}
                        formatter={(value) => [`${value} objects`, 'Count']}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#38bdf8" 
                        background={{ fill: 'rgba(56, 189, 248, 0.05)' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <div className="bg-blue-900 bg-opacity-10 rounded-lg p-3 mb-3 border border-blue-900/20">
                  <h4 className="text-sm font-medium text-cyan-400 mb-2">Distribution Analysis</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    The majority of space debris originates from three major spacefaring nations. Recent trends show a 15% increase in LEO congestion over the past 6 months, primarily due to increased satellite deployments and fragmentation events.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-900 bg-opacity-20 p-2 rounded text-center">
                    <span className="text-xs text-gray-400">Primary Source</span>
                    <div className="text-cyan-400 font-medium">Satellite Collisions</div>
                  </div>
                  <div className="bg-purple-900 bg-opacity-20 p-2 rounded text-center">
                    <span className="text-xs text-gray-400">Growth Rate</span>
                    <div className="text-purple-400 font-medium">+5.2% annually</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 text-center pt-2 flex items-center justify-center">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
        Last data refresh: {new Date().toLocaleString()} • System Status: Online
      </div>
    </div>
  );
};

export default StatisticsPanel;