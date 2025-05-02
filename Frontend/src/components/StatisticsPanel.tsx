// components/EnhancedStatisticsPanel.tsx
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, Satellite, Database, Shield, AlertTriangle, BarChart3 } from 'lucide-react';
import { useDebrisData } from '@/hooks/useDebrisData';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, isLoading = false }) => (
  <div className="stats-card rounded-lg p-4 bg-black bg-opacity-80 backdrop-blur-md border border-blue-900/30">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h4 className={`text-2xl font-bold ${isLoading ? 'animate-pulse' : ''}`} style={{ color }}>
          {value}
        </h4>
      </div>
      <div 
        className="p-2 rounded-full" 
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
    </div>
  </div>
);

const COLORS = ['#33c3f0', '#8B5CF6', '#f97316', '#ea384c', '#10b981'];

const EnhancedStatisticsPanel: React.FC = () => {
  const { debrisObjects, isLoading } = useDebrisData();

  // Calculate statistics
  const totalTrackedObjects = debrisObjects.length;
  
  // Derive additional statistics
  const rocketBodies = debrisObjects.filter(d => 
    d.type.toLowerCase().includes('rocket')
  );
  
  const satellites = debrisObjects.filter(d => 
    d.type.toLowerCase().includes('satellite')
  );
  
  const activeSatellites = satellites.filter(d => 
    !d.name.toLowerCase().includes('defunct')
  );
  
  const inactiveSatellites = satellites.filter(d => 
    d.name.toLowerCase().includes('defunct')
  );
  
  const debrisItems = debrisObjects.filter(d => 
    d.type.toLowerCase().includes('debris')
  );
  
  const otherObjects = debrisObjects.filter(d => 
    !d.type.toLowerCase().includes('satellite') && 
    !d.type.toLowerCase().includes('rocket') && 
    !d.type.toLowerCase().includes('debris')
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
        d.altitude / 1000; // Convert to km if needed
      
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
  
  // Sample collision risk data (generated)
  const collisionRiskData = [
    { name: 'Jan', risk: 3.2 },
    { name: 'Feb', risk: 2.8 },
    { name: 'Mar', risk: 3.4 },
    { name: 'Apr', risk: 4.2 },
    { name: 'May', risk: 3.9 },
    { name: 'Jun', risk: 4.7 },
  ];

  // Calculate debris concentration
  let debrisConcentration = "Low";
  if (totalTrackedObjects > 1000) debrisConcentration = "High";
  else if (totalTrackedObjects > 500) debrisConcentration = "Medium";

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Tracked Objects" 
          value={isLoading ? "Loading..." : totalTrackedObjects.toString()} 
          icon={<Radar size={20} className="text-blue-400" />}
          color="#33c3f0"
          isLoading={isLoading}
        />
        <StatCard 
          title="Active Satellites" 
          value={isLoading ? "Loading..." : activeSatellites.length.toString()} 
          icon={<Satellite size={20} className="text-purple-400" />}
          color="#8B5CF6"
          isLoading={isLoading}
        />
        <StatCard 
          title="Critical Objects" 
          value={isLoading ? "Loading..." : criticalObjects.toString()} 
          icon={<AlertTriangle size={20} className="text-red-400" />}
          color="#ea384c"
          isLoading={isLoading}
        />
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Debris by Category */}
        <Card className="bg-black bg-opacity-80 backdrop-blur-md border border-blue-900/30 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Database size={18} className="mr-2 text-blue-400" />
              Debris by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                      backgroundColor: 'rgba(26, 31, 44, 0.9)',
                      borderColor: 'rgba(51, 195, 240, 0.3)',
                      color: '#f6f6f7'
                    }}
                    formatter={(value) => [`${value} objects`, 'Count']}
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[0, 4, 4, 0]}
                    fill="#33c3f0"
                    background={{ fill: 'rgba(51, 195, 240, 0.1)' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-gray-400 text-right mt-2">
              Data source: MySQL via Spring Boot API
            </div>
          </CardContent>
        </Card>

        {/* Orbital Distribution */}
        <Card className="bg-black bg-opacity-80 backdrop-blur-md border border-blue-900/30 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 size={18} className="mr-2 text-purple-400" />
              Orbital Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                      backgroundColor: 'rgba(26, 31, 44, 0.9)',
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                      color: '#f6f6f7'
                    }}
                    formatter={(value) => [`${value} objects`, 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Collision Risk Trend */}
        <Card className="bg-black bg-opacity-80 backdrop-blur-md border border-blue-900/30 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Shield size={18} className="mr-2 text-orange-400" />
              Collision Risk Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={collisionRiskData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
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
                    domain={[0, 'dataMax + 1']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(26, 31, 44, 0.9)',
                      borderColor: 'rgba(249, 115, 22, 0.3)',
                      color: '#f6f6f7'
                    }}
                    formatter={(value) => [`${value}`, 'Risk Index']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={{ fill: '#f97316', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="bg-black bg-opacity-80 backdrop-blur-md border border-blue-900/30 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle size={18} className="mr-2 text-red-400" />
              Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                      backgroundColor: 'rgba(26, 31, 44, 0.9)',
                      borderColor: 'rgba(234, 56, 76, 0.3)',
                      color: '#f6f6f7'
                    }}
                    formatter={(value) => [`${value} objects`, 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-xs text-gray-400 text-center pt-2">
        Last data refresh: {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default EnhancedStatisticsPanel;