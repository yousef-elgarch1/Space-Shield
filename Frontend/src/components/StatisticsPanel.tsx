
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, Satellite, Database } from 'lucide-react';
import { useDebrisData } from '@/hooks/useDebrisData';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, isLoading = false }) => (
  <div className="stats-card rounded-lg p-4">
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

const StatisticsPanel: React.FC = () => {
  const { debrisObjects, isLoading, error } = useDebrisData();

  // Calculate statistics
  const totalTrackedObjects = debrisObjects.length;
  const activeSatellites = debrisObjects.filter(d => 
    d.type.toLowerCase().includes('satellite') && 
    !d.name.toLowerCase().includes('defunct')
  ).length;

  // Group debris by category
  const debrisByCategory = [
    { 
      category: 'Rocket Bodies', 
      count: debrisObjects.filter(d => d.type.toLowerCase().includes('rocket')).length || 0,
      color: '#33c3f0' 
    },
    { 
      category: 'Inactive Satellites', 
      count: debrisObjects.filter(d => d.type.toLowerCase().includes('satellite') && d.name.toLowerCase().includes('defunct')).length || 0,
      color: '#8B5CF6' 
    },
    { 
      category: 'Fragmentation Debris', 
      count: debrisObjects.filter(d => d.type.toLowerCase().includes('debris')).length || 0,
      color: '#f97316' 
    },
    { 
      category: 'Mission-related Debris', 
      count: debrisObjects.filter(d => !d.type.toLowerCase().includes('satellite') && !d.type.toLowerCase().includes('rocket') && !d.type.toLowerCase().includes('debris')).length || 0,
      color: '#ea384c' 
    },
  ];

  // Sample close approach events - in a real app, this would come from your API
  const monthlyCollisions = [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 19 },
    { month: 'Mar', count: 8 },
    { month: 'Apr', count: 27 },
    { month: 'May', count: 15 },
    { month: 'Jun', count: 23 },
  ];

  // Calculate debris concentration
  let debrisConcentration = "Low";
  if (totalTrackedObjects > 1000) debrisConcentration = "High";
  else if (totalTrackedObjects > 500) debrisConcentration = "Medium";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Tracked Objects" 
          value={isLoading ? "Loading..." : totalTrackedObjects.toString()} 
          icon={<Radar size={20} className="text-space-satellite-blue" />}
          color="#33c3f0"
          isLoading={isLoading}
        />
        <StatCard 
          title="Active Satellites" 
          value={isLoading ? "Loading..." : activeSatellites.toString()} 
          icon={<Satellite size={20} className="text-space-purple" />}
          color="#8B5CF6"
          isLoading={isLoading}
        />
        <StatCard 
          title="Database Status" 
          value={error ? "Connection Error" : "Connected"} 
          icon={<Database size={20} className={error ? "text-space-alert-red" : "text-space-warning-orange"} />}
          color={error ? "#ea384c" : "#4ade80"}
          isLoading={isLoading}
        />
      </div>

      {error ? (
        <Card className="stats-card p-6 bg-space-alert-red bg-opacity-10 border-space-alert-red/30">
          <div className="flex items-center">
            <Database size={24} className="text-space-alert-red mr-4" />
            <div>
              <h3 className="text-space-alert-red font-bold">MySQL Database Connection Error</h3>
              <p className="text-muted-foreground mt-1">
                Could not connect to the MySQL database via the Spring Boot API. 
                Please check that your database server is running and accessible.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-space-light-gray text-lg flex items-center">
                <Database size={18} className="mr-2 text-space-satellite-blue" />
                Debris by Category (MySQL Data)
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
              <div className="text-xs text-muted-foreground text-right mt-2">
                Data source: MySQL via Spring Boot API
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-space-light-gray text-lg">Close Approach Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyCollisions}>
                    <XAxis 
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#f6f6f7', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#f6f6f7', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(26, 31, 44, 0.9)',
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                        color: '#f6f6f7'
                      }}
                      formatter={(value) => [`${value} events`, 'Count']}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#8B5CF6"
                      radius={[4, 4, 0, 0]}
                      background={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StatisticsPanel;
