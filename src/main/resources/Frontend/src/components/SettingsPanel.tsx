
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Database, Globe, Key, User, Server, Shield, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface SystemSettings {
  dataRefreshRate: number;
  theme: 'dark' | 'light' | 'system';
  aiModelVersion: string;
  language: string;
}

const initialSettings: SystemSettings = {
  dataRefreshRate: 60,
  theme: 'dark',
  aiModelVersion: 'v3.2.1',
  language: 'en-US'
};

interface ApiKey {
  id: string;
  name: string;
  lastUsed: string;
  expires: string;
  scopes: string[];
}

const mockApiKeys: ApiKey[] = [
  {
    id: 'key-1',
    name: 'Development Key',
    lastUsed: '2025-04-09 12:30:45',
    expires: '2025-07-09',
    scopes: ['read:data', 'write:alerts']
  },
  {
    id: 'key-2',
    name: 'Analytics Integration',
    lastUsed: '2025-04-08 09:15:22',
    expires: '2025-10-15',
    scopes: ['read:data', 'read:alerts']
  }
];

interface DataSource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  type: 'satellite' | 'ground' | 'api';
}

const mockDataSources: DataSource[] = [
  {
    id: 'src-1',
    name: 'ESA Space Debris Database',
    status: 'active',
    lastSync: '5 minutes ago',
    type: 'api'
  },
  {
    id: 'src-2',
    name: 'NASA Orbital Debris Program',
    status: 'active',
    lastSync: '10 minutes ago',
    type: 'api'
  },
  {
    id: 'src-3',
    name: 'Internal TLE Database',
    status: 'active',
    lastSync: '2 minutes ago',
    type: 'ground'
  },
  {
    id: 'src-4',
    name: 'Commercial Satellite Feed',
    status: 'error',
    lastSync: '3 hours ago',
    type: 'satellite'
  }
];

const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'data' | 'api' | 'account' | 'advanced'>('general');
  
  const handleSettingChange = (setting: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex space-x-2 mb-6">
        <Button 
          variant={activeTab === 'general' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('general')}
          className={activeTab === 'general' ? 'bg-space-satellite-blue' : ''}
        >
          <Settings size={16} className="mr-2" />
          General
        </Button>
        <Button 
          variant={activeTab === 'data' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('data')}
          className={activeTab === 'data' ? 'bg-space-satellite-blue' : ''}
        >
          <Database size={16} className="mr-2" />
          Data Sources
        </Button>
        <Button 
          variant={activeTab === 'api' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('api')}
          className={activeTab === 'api' ? 'bg-space-satellite-blue' : ''}
        >
          <Key size={16} className="mr-2" />
          API Keys
        </Button>
        <Button 
          variant={activeTab === 'account' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('account')}
          className={activeTab === 'account' ? 'bg-space-satellite-blue' : ''}
        >
          <User size={16} className="mr-2" />
          Account
        </Button>
        <Button 
          variant={activeTab === 'advanced' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('advanced')}
          className={activeTab === 'advanced' ? 'bg-space-satellite-blue' : ''}
        >
          <Server size={16} className="mr-2" />
          Advanced
        </Button>
      </div>
      
      {activeTab === 'general' && (
        <Card className="stats-card">
          <CardHeader>
            <CardTitle className="text-space-light-gray text-lg font-bold flex items-center">
              <Settings size={18} className="mr-2 text-space-satellite-blue" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Interface Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Theme</label>
                  <select 
                    className="w-full p-2 rounded-md bg-space-dark-blue bg-opacity-50 border border-space-blue-900/30 text-space-light-gray"
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Language</label>
                  <select 
                    className="w-full p-2 rounded-md bg-space-dark-blue bg-opacity-50 border border-space-blue-900/30 text-space-light-gray"
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    <option value="en-US">English (US)</option>
                    <option value="fr-FR">Français</option>
                    <option value="de-DE">Deutsch</option>
                    <option value="es-ES">Español</option>
                    <option value="ja-JP">日本語</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Data Refresh Settings</h3>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm">Refresh Interval: {settings.dataRefreshRate}s</label>
                </div>
                <input 
                  type="range" 
                  min="15" 
                  max="300" 
                  step="15"
                  value={settings.dataRefreshRate}
                  onChange={(e) => handleSettingChange('dataRefreshRate', parseInt(e.target.value))}
                  className="w-full h-2 bg-space-blue-900/30 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>15s (Real-time)</span>
                  <span>300s (Low bandwidth)</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">AI Model Configuration</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1">AI Model Version</label>
                  <select 
                    className="w-full p-2 rounded-md bg-space-dark-blue bg-opacity-50 border border-space-blue-900/30 text-space-light-gray"
                    value={settings.aiModelVersion}
                    onChange={(e) => handleSettingChange('aiModelVersion', e.target.value)}
                  >
                    <option value="v3.2.1">SpaceSentinel v3.2.1 (Recommended)</option>
                    <option value="v3.1.0">SpaceSentinel v3.1.0 (Stable)</option>
                    <option value="v3.3.0-beta">SpaceSentinel v3.3.0 (Beta)</option>
                  </select>
                </div>
                <div className="bg-space-blue-900/20 p-3 rounded-md text-sm">
                  <p>Current model trained on data up to 2025-03-15. Accuracy rating: 96.7% for collision prediction within LEO orbits.</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" className="mr-2">Reset to Default</Button>
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'data' && (
        <Card className="stats-card">
          <CardHeader>
            <CardTitle className="text-space-light-gray text-lg font-bold flex items-center">
              <Database size={18} className="mr-2 text-space-satellite-blue" />
              Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDataSources.map((source) => (
                <div key={source.id} className="border border-space-blue-900/30 rounded-md p-4 space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{source.name}</h3>
                      <div className="flex items-center text-xs mt-1">
                        <span className="text-muted-foreground">Type: {source.type}</span>
                        <div className="mx-2 h-1 w-1 rounded-full bg-muted-foreground/30"></div>
                        <span className="text-muted-foreground">Last sync: {source.lastSync}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        source.status === 'active' 
                          ? 'bg-green-500 bg-opacity-20 text-green-500' 
                          : source.status === 'inactive'
                            ? 'bg-gray-500 bg-opacity-20 text-gray-500'
                            : 'bg-space-alert-red bg-opacity-20 text-space-alert-red'
                      }`}>
                        {source.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex">
                    <Button variant="outline" size="sm" className="mr-2">
                      <RefreshCw size={14} className="mr-1" />
                      Sync Now
                    </Button>
                    <Button variant="ghost" size="sm">Configure</Button>
                  </div>
                </div>
              ))}
              
              <Button className="w-full">Add New Data Source</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'api' && (
        <Card className="stats-card">
          <CardHeader>
            <CardTitle className="text-space-light-gray text-lg font-bold flex items-center">
              <Key size={18} className="mr-2 text-space-satellite-blue" />
              API Keys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockApiKeys.map((key) => (
                <div key={key.id} className="border border-space-blue-900/30 rounded-md p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{key.name}</h3>
                    <span className="text-xs text-muted-foreground">Expires: {key.expires}</span>
                  </div>
                  <div className="mb-3">
                    <code className="bg-space-blue-900/30 px-3 py-1.5 rounded-md text-sm">••••••••••••••••{key.id.slice(-4)}</code>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {key.scopes.map((scope) => (
                      <span key={scope} className="bg-space-blue-900/20 text-xs px-2 py-1 rounded-md">{scope}</span>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    Last used: {key.lastUsed}
                  </div>
                  <div className="flex">
                    <Button variant="outline" size="sm" className="mr-2">Revoke</Button>
                    <Button variant="ghost" size="sm">Edit Permissions</Button>
                  </div>
                </div>
              ))}
              
              <Button className="w-full">Generate New API Key</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'account' && (
        <Card className="stats-card">
          <CardHeader>
            <CardTitle className="text-space-light-gray text-lg font-bold flex items-center">
              <User size={18} className="mr-2 text-space-satellite-blue" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Profile Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md bg-space-dark-blue bg-opacity-50 border border-space-blue-900/30 text-space-light-gray"
                      value="Mission Controller"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full p-2 rounded-md bg-space-dark-blue bg-opacity-50 border border-space-blue-900/30 text-space-light-gray"
                      value="mission@spacesentinel.example"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Security</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield size={16} className="mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield size={16} className="mr-2" />
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Subscription</h3>
                <div className="p-3 rounded-md bg-space-blue-900/20">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium">SpaceSentinel Pro</h4>
                    <span className="bg-space-satellite-blue px-2 py-0.5 rounded-md text-xs">Active</span>
                  </div>
                  <p className="text-sm mb-2">Next billing date: July 9, 2025</p>
                  <div className="flex">
                    <Button variant="outline" size="sm" className="mr-2">Manage Subscription</Button>
                    <Button variant="ghost" size="sm">Billing History</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" className="mr-2">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'advanced' && (
        <Card className="stats-card">
          <CardHeader>
            <CardTitle className="text-space-light-gray text-lg font-bold flex items-center">
              <Server size={18} className="mr-2 text-space-satellite-blue" />
              Advanced Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-space-alert-red bg-opacity-10 border border-space-alert-red rounded-md p-3 mb-4">
                <p className="text-sm text-space-alert-red">Warning: These settings are for advanced users. Incorrect changes may affect system performance or data integrity.</p>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="predictive-analytics">
                  <AccordionTrigger className="text-space-light-gray">AI Predictive Analytics Settings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Prediction Horizon (days)</label>
                        <input 
                          type="number" 
                          className="w-full p-2 rounded-md bg-space-dark-blue bg-opacity-50 border border-space-blue-900/30 text-space-light-gray"
                          value="30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Model Confidence Threshold (%)</label>
                        <input 
                          type="number" 
                          className="w-full p-2 rounded-md bg-space-dark-blue bg-opacity-50 border border-space-blue-900/30 text-space-light-gray"
                          value="85"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="data-retention">
                  <AccordionTrigger className="text-space-light-gray">Data Retention Policy</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Historical Data Retention (days)</label>
                        <input 
                          type="number" 
                          className="w-full p-2 rounded-md bg-space-dark-blue bg-opacity-50 border border-space-blue-900/30 text-space-light-gray"
                          value="365"
                        />
                      </div>
                      <div className="flex items-center mt-2">
                        <input type="checkbox" className="mr-2" />
                        <label className="text-sm">Enable automatic data archiving</label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="system-logs">
                  <AccordionTrigger className="text-space-light-gray">System Logs</AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <label className="block text-sm mb-1">Log Level</label>
                      <select 
                        className="w-full p-2 rounded-md bg-space-dark-blue bg-opacity-50 border border-space-blue-900/30 text-space-light-gray"
                      >
                        <option value="error">Error Only</option>
                        <option value="warning">Warning & Error</option>
                        <option value="info">Info, Warning & Error</option>
                        <option value="debug">Debug (Verbose)</option>
                      </select>
                      <Button variant="outline" size="sm" className="mt-3">
                        Download System Logs
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-4 pt-4 border-t border-space-blue-900/30">
                <Button variant="outline" className="text-space-alert-red border-space-alert-red">
                  Reset All Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SettingsPanel;
