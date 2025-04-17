
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Bell, Shield, Settings, Eye, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AlertSettings {
  collisionWarningThreshold: number;
  criticalAlertThreshold: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyDigest: boolean;
}

interface AlertHistoryItem {
  id: string;
  objectName: string;
  time: string;
  type: 'collision' | 'debris' | 'system';
  severity: 'warning' | 'critical';
  message: string;
  resolved: boolean;
}

const mockAlertHistory: AlertHistoryItem[] = [
  {
    id: 'alert-001',
    objectName: 'Cosmos-1408 Debris',
    time: '2025-04-09 14:32:45',
    type: 'collision',
    severity: 'critical',
    message: 'Potential collision with ISS detected. Proximity alert: 241km.',
    resolved: false
  },
  {
    id: 'alert-002',
    objectName: 'SL-16 R/B Fragment',
    time: '2025-04-09 13:15:22',
    type: 'debris',
    severity: 'warning',
    message: 'New debris fragment detected in LEO orbit.',
    resolved: true
  },
  {
    id: 'alert-003',
    objectName: 'Fengyun-1C Debris',
    time: '2025-04-09 11:47:08',
    type: 'collision',
    severity: 'warning',
    message: 'Potential collision with Starlink-1234 satellite. Probability: 65%.',
    resolved: false
  },
  {
    id: 'alert-004',
    objectName: 'System',
    time: '2025-04-09 10:05:33',
    type: 'system',
    severity: 'warning',
    message: 'Data feed interrupted from ESA source. Using cached data.',
    resolved: true
  },
  {
    id: 'alert-005',
    objectName: 'Starlink-1234',
    time: '2025-04-09 08:22:15',
    type: 'collision',
    severity: 'warning',
    message: 'Proximity alert with unidentified object. Distance: 512km.',
    resolved: false
  }
];

const initialAlertSettings: AlertSettings = {
  collisionWarningThreshold: 40,
  criticalAlertThreshold: 70,
  emailNotifications: true,
  pushNotifications: true,
  dailyDigest: false
};

const AlertsPanel: React.FC = () => {
  const [tab, setTab] = useState<'active' | 'history' | 'settings'>('active');
  const [alertSettings, setAlertSettings] = useState<AlertSettings>(initialAlertSettings);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  
  const activeAlerts = mockAlertHistory.filter(alert => !alert.resolved);
  const resolvedAlerts = mockAlertHistory.filter(alert => alert.resolved);
  
  const handleSettingChange = (setting: keyof AlertSettings, value: any) => {
    setAlertSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const toggleBooleanSetting = (setting: keyof AlertSettings) => {
    setAlertSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  return (
    <Card className="alert-panel">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-space-light-gray text-lg font-bold flex items-center">
            <AlertTriangle size={18} className="mr-2 text-space-alert-red" />
            Alert Management
          </CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant={tab === 'active' ? 'default' : 'outline'} 
              onClick={() => setTab('active')}
              size="sm"
              className={tab === 'active' ? 'bg-space-satellite-blue' : ''}
            >
              Active
            </Button>
            <Button 
              variant={tab === 'history' ? 'default' : 'outline'} 
              onClick={() => setTab('history')}
              size="sm"
              className={tab === 'history' ? 'bg-space-satellite-blue' : ''}
            >
              History
            </Button>
            <Button 
              variant={tab === 'settings' ? 'default' : 'outline'} 
              onClick={() => setTab('settings')}
              size="sm"
              className={tab === 'settings' ? 'bg-space-satellite-blue' : ''}
            >
              <Settings size={16} className="mr-1" />
              Config
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {tab === 'active' && (
          <div className="space-y-4">
            {activeAlerts.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No active alerts at this time.</p>
              </div>
            ) : (
              activeAlerts.map((alert) => (
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
                  <div className="mb-2">
                    <p className="text-sm">{alert.message}</p>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Collision Probability</span>
                    <span 
                      className={alert.severity === 'critical' ? 'text-space-alert-red' : 'text-space-warning-orange'}
                    >
                      {alert.severity === 'critical' ? '78%' : '45%'}
                    </span>
                  </div>
                  <Progress 
                    value={alert.severity === 'critical' ? 78 : 45} 
                    className={`h-1.5 ${
                      alert.severity === 'critical' ? 'bg-space-alert-red bg-opacity-20' : 'bg-space-warning-orange bg-opacity-20'
                    }`}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      <Eye size={14} className="mr-1" />
                      Details
                    </Button>
                    <Button size="sm">
                      Resolve
                    </Button>
                  </div>
                </div>
              ))
            )}
            
            <Button className="w-full mt-2" variant="outline">
              Run AI Collision Analysis
            </Button>
          </div>
        )}
        
        {tab === 'history' && (
          <div>
            <div className="rounded-md border border-space-blue-900/30 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Object</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAlertHistory.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="text-xs">{alert.time}</TableCell>
                      <TableCell>{alert.objectName}</TableCell>
                      <TableCell>{alert.type}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alert.severity === 'critical' 
                            ? 'bg-space-alert-red bg-opacity-20 text-space-alert-red' 
                            : 'bg-space-warning-orange bg-opacity-20 text-space-warning-orange'
                        }`}>
                          {alert.severity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alert.resolved
                            ? 'bg-green-500 bg-opacity-20 text-green-500' 
                            : 'bg-space-satellite-blue bg-opacity-20 text-space-satellite-blue'
                        }`}>
                          {alert.resolved ? 'Resolved' : 'Active'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ArrowRight size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        
        {tab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-sm font-medium">Alert Thresholds</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm">Warning Threshold: {alertSettings.collisionWarningThreshold}%</label>
                    <span className="text-xs text-muted-foreground">Recommended: 40%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="90" 
                    value={alertSettings.collisionWarningThreshold}
                    onChange={(e) => handleSettingChange('collisionWarningThreshold', parseInt(e.target.value))}
                    className="w-full h-2 bg-space-blue-900/30 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm">Critical Threshold: {alertSettings.criticalAlertThreshold}%</label>
                    <span className="text-xs text-muted-foreground">Recommended: 70%</span>
                  </div>
                  <input 
                    type="range" 
                    min="30" 
                    max="95" 
                    value={alertSettings.criticalAlertThreshold}
                    onChange={(e) => handleSettingChange('criticalAlertThreshold', parseInt(e.target.value))}
                    className="w-full h-2 bg-space-blue-900/30 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 text-sm font-medium">Notification Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-space-blue-900/30 pb-2">
                  <span className="text-sm">Email Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={alertSettings.emailNotifications}
                      onChange={() => toggleBooleanSetting('emailNotifications')}
                    />
                    <div className="w-9 h-5 bg-space-blue-900/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-space-satellite-blue"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between border-b border-space-blue-900/30 pb-2">
                  <span className="text-sm">Push Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={alertSettings.pushNotifications}
                      onChange={() => toggleBooleanSetting('pushNotifications')}
                    />
                    <div className="w-9 h-5 bg-space-blue-900/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-space-satellite-blue"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-sm">Daily Alert Digest</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={alertSettings.dailyDigest}
                      onChange={() => toggleBooleanSetting('dailyDigest')}
                    />
                    <div className="w-9 h-5 bg-space-blue-900/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-space-satellite-blue"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" className="mr-2">Reset to Default</Button>
              <Button>Save Settings</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
