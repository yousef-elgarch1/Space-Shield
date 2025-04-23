
import React from 'react';
import { AlertCircle, Radio, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";



const mockAlerts: AlertData[] = [
  {
    id: 'alert-001',
    time: '2025-04-09 14:32:45',
    objectName: 'Cosmos-1408 Debris',
    probability: 78,
    distance: '241 km',
    severity: 'critical'
  },
  {
    id: 'alert-002',
    time: '2025-04-09 13:15:22',
    objectName: 'SL-16 R/B Fragment',
    probability: 42,
    distance: '512 km',
    severity: 'warning'
  },
  {
    id: 'alert-003',
    time: '2025-04-09 11:47:08',
    objectName: 'Fengyun-1C Debris',
    probability: 65,
    distance: '326 km',
    severity: 'warning'
  }
];

const AlertPanel: React.FC = () => {
  return (
    <Card className="alert-panel">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-space-light-gray text-lg font-bold flex items-center">
          <AlertCircle size={18} className="mr-2 text-space-alert-red" />
          Collision Alerts
        </CardTitle>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Radio size={14} className="text-space-satellite-blue animate-pulse" />
            <span className="text-space-satellite-blue">Live Monitoring</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`p-3 rounded-md border ${
                alert.severity === 'critical' 
                  ? 'border-space-alert-red bg-space-alert-red bg-opacity-10' 
                  : 'border-space-warning-orange bg-space-warning-orange bg-opacity-10'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-sm">{alert.objectName}</h4>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  alert.severity === 'critical' 
                    ? 'bg-space-alert-red bg-opacity-20 text-space-alert-red' 
                    : 'bg-space-warning-orange bg-opacity-20 text-space-warning-orange'
                }`}>
                  {alert.severity === 'critical' ? 'Critical' : 'Warning'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Collision Probability</span>
                  <span 
                    className={alert.probability > 70 ? 'text-space-alert-red' : 'text-space-warning-orange'}
                  >
                    {alert.probability}%
                  </span>
                </div>
                <Progress 
                  value={alert.probability} 
                  className={`h-1.5 ${
                    alert.probability > 70 ? 'bg-space-alert-red bg-opacity-20' : 'bg-space-warning-orange bg-opacity-20'
                  }`}
                />
                <div className="flex justify-between items-center text-xs mt-2">
                  <span>Closest Approach: {alert.distance}</span>
                  <Shield size={14} className={
                    alert.severity === 'critical' ? 'text-space-alert-red' : 'text-space-warning-orange'
                  } />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertPanel;
