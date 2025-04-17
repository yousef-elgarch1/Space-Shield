
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, Satellite, Database } from 'lucide-react';

const debrisData = [
  { category: 'Rocket Bodies', count: 2300, color: '#33c3f0' },
  { category: 'Inactive Satellites', count: 3700, color: '#8B5CF6' },
  { category: 'Fragmentation Debris', count: 8200, color: '#f97316' },
  { category: 'Mission-related Debris', count: 6100, color: '#ea384c' },
];

const monthlyCollisions = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 19 },
  { month: 'Mar', count: 8 },
  { month: 'Apr', count: 27 },
  { month: 'May', count: 15 },
  { month: 'Jun', count: 23 },
];

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="stats-card rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h4 className="text-2xl font-bold" style={{ color }}>{value}</h4>
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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Tracked Objects" 
          value="24,582" 
          icon={<Radar size={20} className="text-space-satellite-blue" />}
          color="#33c3f0"
        />
        <StatCard 
          title="Active Satellites" 
          value="4,256" 
          icon={<Satellite size={20} className="text-space-purple" />}
          color="#8B5CF6"
        />
        <StatCard 
          title="Debris Concentration" 
          value="High" 
          icon={<Database size={20} className="text-space-warning-orange" />}
          color="#f97316"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-space-light-gray text-lg">Debris by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={debrisData} layout="vertical">
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
    </div>
  );
};

export default StatisticsPanel;
