import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Shield, Eye, ArrowRight, Bell, AlertTriangle, RotateCw, 
         Layers, Zap, X, Maximize2, ChevronUp, ChevronDown, Activity, Calendar, CheckCircle,
         MessageSquare, Send, Radio, Settings } from 'lucide-react';

const AdvancedDebrisAlertSystem = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [currentTab, setCurrentTab] = useState('active');
  const [autoClassify, setAutoClassify] = useState(true);
  const [notificationSounds, setNotificationSounds] = useState(true);
  const [visualizationMode, setVisualizationMode] = useState('2d');
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [predictionHorizon, setPredictionHorizon] = useState(48); // hours
  const [alertThreshold, setAlertThreshold] = useState(60);
  const [riskMatrix, setRiskMatrix] = useState([]);
  const [orbitVisualization, setOrbitVisualization] = useState(null);
  const [noteText, setNoteText] = useState('');
  const alarmSound = useRef(null);
  
  // Mock data for demonstration
  const generateMockAlerts = () => {
    const severityLevels = ['low', 'medium', 'high', 'critical'];
    const debrisTypes = ['Cosmos-1408 Debris', 'SL-16 R/B Fragment', 'Fengyun-1C Debris', 'COSMOS 2251 Debris', 'Iridium 33 Debris'];
    const satelliteTargets = ['ISS', 'Starlink-1234', 'OneWeb-0047', 'GOES-16', 'Sentinel-2A'];
    
    return Array.from({ length: 8 }, (_, i) => {
      const now = new Date();
      const timeToImpact = Math.floor(Math.random() * 72) + 1; // 1-72 hours
      const impactTime = new Date(now.getTime() + timeToImpact * 60 * 60 * 1000);
      const probability = Math.floor(Math.random() * 100);
      const severity = probability > 80 ? 'critical' : probability > 60 ? 'high' : probability > 40 ? 'medium' : 'low';
      
      return {
        id: `alert-${i + 1}`,
        objectName: debrisTypes[Math.floor(Math.random() * debrisTypes.length)],
        targetName: satelliteTargets[Math.floor(Math.random() * satelliteTargets.length)],
        timestamp: now.toISOString(),
        impactTime: impactTime.toISOString(),
        timeToImpact: timeToImpact,
        probability: probability,
        severity: severity,
        missDistance: Math.floor(Math.random() * 1000) + 100, // 100-1100 km
        relativeVelocity: Math.floor(Math.random() * 10) + 5, // 5-15 km/s
        orbitRegion: Math.random() > 0.5 ? 'LEO' : 'GEO',
        size: Math.random() > 0.7 ? 'large' : Math.random() > 0.4 ? 'medium' : 'small',
        source: Math.random() > 0.6 ? 'ESA' : 'NASA',
        mitigationStatus: Math.random() > 0.8 ? 'in-progress' : 'pending',
        resolved: Math.random() > 0.7,
        notes: [],
        trajectory: Array.from({ length: 10 }, (_, j) => ({
          time: new Date(now.getTime() + j * 6 * 60 * 60 * 1000).toISOString(),
          position: {
            x: Math.sin(j * 0.1) * 6378 + Math.random() * 200 - 100,
            y: Math.cos(j * 0.1) * 6378 + Math.random() * 200 - 100,
            z: Math.sin(j * 0.05) * 1000 + Math.random() * 100 - 50
          }
        }))
      };
    });
  };
  
  // Initialize alerts with mock data
  useEffect(() => {
    fetchAlerts();
    
    // Set up an interval for real-time updates
    const interval = setInterval(() => {
      // Only auto-update if not in expanded detail view
      if (!selectedAlert) {
        fetchAlerts();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [selectedAlert]);
  
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      // In a real application, we would fetch from the backend
      // const response = await fetch('/api/orbit/alerts');
      // const data = await response.json();
      
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulated API delay
      const mockAlerts = generateMockAlerts();
      setAlerts(mockAlerts);
      
      // Generate risk matrix
      generateRiskMatrix(mockAlerts);
      
      // Play alert sound for critical alerts if enabled
      if (notificationSounds && mockAlerts.some(a => a.severity === 'critical' && !a.resolved)) {
        playAlertSound();
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const generateRiskMatrix = (alertsData) => {
    // Generate a risk matrix for data visualization
    // This would map probability vs. impact
    const matrix = [];
    
    // Create 5x5 risk matrix
    for (let p = 0; p < 5; p++) {
      const row = [];
      for (let i = 0; i < 5; i++) {
        // Count alerts that fall in this probability/impact cell
        const count = alertsData.filter(a => {
          const probBucket = Math.floor(a.probability / 20); // 0-4
          const impactBucket = 4 - Math.floor((a.missDistance - 100) / 200); // 0-4 (reversed)
          return probBucket === p && impactBucket === i && !a.resolved;
        }).length;
        
        row.push({
          count,
          risk: (p + 1) * (i + 1), // Risk score from 1-25
          color: getRiskColor(p, i)
        });
      }
      matrix.push(row);
    }
    
    setRiskMatrix(matrix);
  };
  
  const getRiskColor = (probability, impact) => {
    const riskScore = (probability + 1) * (impact + 1);
    if (riskScore > 15) return 'bg-red-500';
    if (riskScore > 9) return 'bg-orange-500';
    if (riskScore > 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const playAlertSound = () => {
    // In a real app, play an alert sound
    // if (alarmSound.current) {
    //   alarmSound.current.play();
    // }
    console.log("🔊 Alert sound played");
  };
  
  const resolveAlert = (alertId) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
    
    // If the selected alert is being resolved, close the detail view
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert(null);
    }
    
    // In a real app, call the API to update alert status
    // fetch(`/api/alerts/${alertId}/resolve`, { method: 'PUT' });
  };
  
  const addNote = (alertId, note) => {
    if (!note.trim()) return;
    
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { 
              ...alert, 
              notes: [...alert.notes, { 
                id: `note-${Date.now()}`, 
                text: note, 
                timestamp: new Date().toISOString(),
                user: 'Current User'
              }] 
            } 
          : alert
      )
    );
    
    // Update selected alert if it's the one being modified
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert(prev => ({
        ...prev,
        notes: [...prev.notes, { 
          id: `note-${Date.now()}`, 
          text: note, 
          timestamp: new Date().toISOString(),
          user: 'Current User'
        }]
      }));
    }
  };
  
  const runPredictionModel = () => {
    setLoading(true);
    
    // Simulate running an advanced prediction model
    setTimeout(() => {
      const newAlert = {
        id: `alert-${Date.now()}`,
        objectName: 'AI Prediction: Debris Cluster',
        targetName: 'ISS',
        timestamp: new Date().toISOString(),
        impactTime: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
        timeToImpact: 36,
        probability: 72,
        severity: 'high',
        missDistance: 320,
        relativeVelocity: 11.2,
        orbitRegion: 'LEO',
        size: 'medium',
        source: 'AI Model',
        mitigationStatus: 'pending',
        resolved: false,
        notes: [{
          id: `note-auto-${Date.now()}`,
          text: 'Automatically generated by AI prediction model analyzing debris cascade patterns.',
          timestamp: new Date().toISOString(),
          user: 'AI System'
        }],
        trajectory: Array.from({ length: 10 }, (_, j) => ({
          time: new Date(Date.now() + j * 6 * 60 * 60 * 1000).toISOString(),
          position: {
            x: Math.sin(j * 0.1) * 6378 + Math.random() * 200 - 100,
            y: Math.cos(j * 0.1) * 6378 + Math.random() * 200 - 100,
            z: Math.sin(j * 0.05) * 1000 + Math.random() * 100 - 50
          }
        }))
      };
      
      setAlerts(prev => [newAlert, ...prev]);
      generateRiskMatrix([newAlert, ...alerts]);
      setLoading(false);
      
      // Play notification sound for the new prediction
      if (notificationSounds) {
        playAlertSound();
      }
    }, 2500);
  };
  
  // Return only alerts matching the current tab
  const filteredAlerts = alerts.filter(alert => {
    if (currentTab === 'active') return !alert.resolved;
    if (currentTab === 'resolved') return alert.resolved;
    if (currentTab === 'critical') return alert.severity === 'critical' && !alert.resolved;
    if (currentTab === 'upcoming') return alert.timeToImpact < 24 && !alert.resolved;
    return true;
  });
  
  // Get all active alerts (unresolved) for header count
  const activeAlerts = alerts.filter(alert => !alert.resolved);
  
  // Sort alerts by priority
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    // Critical severity first
    if (a.severity === 'critical' && b.severity !== 'critical') return -1;
    if (b.severity === 'critical' && a.severity !== 'critical') return 1;
    
    // Then by time to impact (for unresolved)
    if (!a.resolved && !b.resolved) return a.timeToImpact - b.timeToImpact;
    
    // Then by timestamp (newest first)
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  
  // Format date/time
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format time to impact
  const formatTimeToImpact = (hours) => {
    if (hours < 1) return 'Less than 1 hour';
    if (hours < 24) return `${hours} hours`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };
  
  // Get class name based on severity
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };
  
  // Render a condensed alert card with the new design
  const renderAlertCard = (alert) => {
    return (
      <div 
        key={alert.id}
        className={`relative p-4 rounded-lg border-2 mb-3 cursor-pointer hover:shadow-lg transition-shadow ${
          alert.severity === 'critical' 
            ? 'border-red-500 bg-red-900 bg-opacity-20' 
            : alert.severity === 'high'
              ? 'border-orange-500 bg-orange-900 bg-opacity-20'
              : alert.severity === 'medium'
                ? 'border-yellow-500 bg-yellow-900 bg-opacity-20'
                : 'border-green-500 bg-green-900 bg-opacity-20'
        }`}
        onClick={() => setSelectedAlert(alert)}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{alert.objectName}</h3>
            <p className="text-gray-400 text-sm">{formatTime(alert.timestamp)}</p>
          </div>
          <span className={`py-1 px-3 rounded-full text-sm ${
            alert.severity === 'critical' 
              ? 'bg-red-500 text-white' 
              : alert.severity === 'high'
                ? 'bg-orange-500 text-white'
                : alert.severity === 'medium'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-green-500 text-black'
          }`}>
            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
          </span>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span>Collision Probability</span>
            <span className={
              alert.severity === 'critical' ? 'text-red-500' : 
              alert.severity === 'high' ? 'text-orange-500' : 
              alert.severity === 'medium' ? 'text-yellow-500' : 
              'text-green-500'
            }>
              {alert.probability}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                alert.severity === 'critical' ? 'bg-red-500' : 
                alert.severity === 'high' ? 'bg-orange-500' : 
                alert.severity === 'medium' ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${alert.probability}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center">
          <span>Closest Approach: {alert.missDistance} km</span>
          <div className={`ml-auto w-6 h-6 rounded-full flex items-center justify-center border ${
            alert.severity === 'critical' ? 'border-red-500 text-red-500' : 
            alert.severity === 'high' ? 'border-orange-500 text-orange-500' : 
            alert.severity === 'medium' ? 'border-yellow-500 text-yellow-500' : 
            'border-green-500 text-green-500'
          }`}>
            <CheckCircle size={16} />
          </div>
        </div>
        
        {alert.mitigationStatus === 'in-progress' && (
          <div className="mt-2 px-2 py-1 bg-blue-900 bg-opacity-30 text-blue-400 text-xs rounded flex items-center">
            <RotateCw size={12} className="mr-1 animate-spin" />
            Mitigation in progress
          </div>
        )}
      </div>
    );
  };

  // Component rendering starts here
  return (
    <div className={`debris-alert-system bg-black bg-opacity-80 backdrop-blur-md text-white rounded-lg border border-blue-900/30 transition-all duration-300 ${
      minimized ? 'h-12 overflow-hidden' : expanded ? 'fixed inset-4 z-40' : ''
    }`}>
      {/* Header bar */}
      <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-black">
        <div className="flex items-center">
          <AlertCircle size={20} className="text-red-500 mr-2" />
          <h2 className="font-bold">Space Debris Alert System</h2>
          
          <span className="ml-auto text-cyan-400 flex items-center">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            Live Monitoring
          </span>
          
          {activeAlerts.filter(a => a.severity === 'critical').length > 0 && (
            <span className="ml-3 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
              {activeAlerts.filter(a => a.severity === 'critical').length} Critical
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button 
            className="p-1 hover:bg-gray-800 rounded"
            onClick={fetchAlerts}
            disabled={loading}
            title="Refresh Alerts"
          >
            <RotateCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <button 
            className="p-1 hover:bg-gray-800 rounded"
            onClick={() => setMinimized(!minimized)}
            title={minimized ? 'Expand' : 'Minimize'}
          >
            {minimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <button 
            className="p-1 hover:bg-gray-800 rounded"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? 'Contract' : 'Expand'}
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      
      {!minimized && (
        <div className="flex h-[calc(100%-48px)]">
          {/* Main content */}
          <div className="flex-1 p-4 overflow-auto">
            {/* Alert filters & tabs */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-1">
                <button 
                  className={`px-3 py-1 text-sm rounded-md ${currentTab === 'active' ? 'bg-blue-900 text-blue-300' : 'hover:bg-gray-800'}`}
                  onClick={() => setCurrentTab('active')}
                >
                  Active ({alerts.filter(a => !a.resolved).length})
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-md ${currentTab === 'critical' ? 'bg-red-900 text-red-300' : 'hover:bg-gray-800'}`}
                  onClick={() => setCurrentTab('critical')}
                >
                  Critical ({alerts.filter(a => a.severity === 'critical' && !a.resolved).length})
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-md ${currentTab === 'upcoming' ? 'bg-yellow-900 text-yellow-300' : 'hover:bg-gray-800'}`}
                  onClick={() => setCurrentTab('upcoming')}
                >
                  &lt;24h
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-md ${currentTab === 'resolved' ? 'bg-green-900 text-green-300' : 'hover:bg-gray-800'}`}
                  onClick={() => setCurrentTab('resolved')}
                >
                  Resolved
                </button>
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center text-sm mr-4 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-1.5 h-4 w-4"
                    checked={autoClassify}
                    onChange={() => setAutoClassify(!autoClassify)}
                  />
                  Auto-classify
                </label>
                <label className="flex items-center text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-1.5 h-4 w-4"
                    checked={notificationSounds}
                    onChange={() => setNotificationSounds(!notificationSounds)}
                  />
                  Alert sounds
                </label>
              </div>
            </div>
            
            {/* Alert list */}
            <div>
              {sortedAlerts.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">No alerts to display</p>
                  <p className="text-gray-400 text-sm">Adjust filters or refresh to check for new alerts</p>
                </div>
              ) : (
                sortedAlerts.map(alert => renderAlertCard(alert))
              )}
            </div>
            
            {/* AI prediction button */}
            <button 
              className="w-full mt-4 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
              onClick={runPredictionModel}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RotateCw size={16} className="mr-2 animate-spin" />
                  Running Analysis...
                </>
              ) : (
                <>
                  <Zap size={16} className="mr-2" />
                  Run Advanced AI Prediction Model
                </>
              )}
            </button>
            
            <div className="flex mt-4 space-x-2 text-sm">
              <div>
                <label className="block text-gray-400 mb-1">Prediction Horizon</label>
                <div className="flex items-center">
                  <input 
                    type="range" 
                    min="24" 
                    max="168" 
                    step="12"
                    value={predictionHorizon}
                    onChange={(e) => setPredictionHorizon(parseInt(e.target.value))}
                    className="w-32 h-1.5 bg-gray-700 rounded-full appearance-none"
                  />
                  <span className="ml-2">{predictionHorizon}h</span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1">Alert Threshold</label>
                <div className="flex items-center">
                  <input 
                    type="range" 
                    min="10" 
                    max="90" 
                    step="5"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
                    className="w-32 h-1.5 bg-gray-700 rounded-full appearance-none"
                  />
                  <span className="ml-2">{alertThreshold}%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar with visualizations (only shown in expanded mode) */}
          {expanded && (
            <div className="w-80 border-l border-gray-800 p-4 overflow-auto">
              <h3 className="text-sm font-medium mb-4">Alert Statistics</h3>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-blue-900 bg-opacity-30 border border-blue-900 p-3 rounded-md">
                  <div className="text-2xl font-bold text-blue-400">{alerts.filter(a => !a.resolved).length}</div>
                  <div className="text-sm text-gray-400">Active Alerts</div>
                </div>
                <div className="bg-red-900 bg-opacity-30 border border-red-900 p-3 rounded-md">
                  <div className="text-2xl font-bold text-red-400">{alerts.filter(a => a.severity === 'critical' && !a.resolved).length}</div>
                  <div className="text-sm text-gray-400">Critical</div>
                </div>
                <div className="bg-green-900 bg-opacity-30 border border-green-900 p-3 rounded-md">
                  <div className="text-2xl font-bold text-green-400">{alerts.filter(a => a.resolved).length}</div>
                  <div className="text-sm text-gray-400">Resolved Today</div>
                </div>
                <div className="bg-yellow-900 bg-opacity-30 border border-yellow-900 p-3 rounded-md">
                  <div className="text-2xl font-bold text-yellow-400">{alerts.filter(a => a.timeToImpact < 24 && !a.resolved).length}</div>
                  <div className="text-sm text-gray-400">Within 24h</div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Risk Assessment Matrix</h3>
                <div className="flex flex-col">
                  <div className="text-xs mb-1 ml-6 text-gray-400">Probability →</div>
                  <div className="flex">
                    <div className="w-6 flex flex-col justify-between">
                      <span className="text-xs transform -rotate-90 origin-left translate-y-6 text-gray-400">Impact →</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 flex-1">
                      {riskMatrix.map((row, rowIndex) => (
                        row.map((cell, colIndex) => (
                          <div 
                            key={`${rowIndex}-${colIndex}`} 
                            className={`h-6 ${cell.color} rounded flex items-center justify-center text-xs ${cell.count > 0 ? 'text-white font-bold' : 'text-transparent'}`}
                          >
                            {cell.count || '.'}
                          </div>
                        ))
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Alert Sources</h3>
                <div className="space-y-2">
                  {['NASA', 'ESA', 'AI Model'].map(source => {
                    const count = alerts.filter(a => a.source === source && !a.resolved).length;
                    return (
                      <div key={source} className="flex items-center">
                        <div className="w-24 text-sm">{source}</div>
                        <div className="flex-1 bg-gray-800 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              source === 'AI Model' ? 'bg-purple-500' : 
                              source === 'NASA' ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(count / Math.max(1, alerts.filter(a => !a.resolved).length)) * 100}%` }}
                          ></div>
                        </div>
                        <div className="w-8 text-right text-sm">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">System Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-green-900 bg-opacity-20 border border-green-900 rounded">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm">Collision Detection</span>
                      // Continuing from where you left off

                    </div>
                    <span className="text-xs text-green-400">Online</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-900 bg-opacity-20 border border-green-900 rounded">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm">Prediction API</span>
                    </div>
                    <span className="text-xs text-green-400">Online</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-yellow-900 bg-opacity-20 border border-yellow-900 rounded">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm">ESA Data Feed</span>
                    </div>
                    <span className="text-xs text-yellow-400">Degraded</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Detail view popup */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-black bg-opacity-90 backdrop-blur-md border border-blue-900/30 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col text-white">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center">
                <AlertTriangle 
                  size={20} 
                  className={`mr-2 ${
                    selectedAlert.severity === 'critical' ? 'text-red-500' : 
                    selectedAlert.severity === 'high' ? 'text-orange-500' : 
                    selectedAlert.severity === 'medium' ? 'text-yellow-500' : 
                    'text-green-500'
                  }`} 
                />
                Conjunction Alert Details
              </h2>
              <button 
                className="text-gray-400 hover:text-gray-200"
                onClick={() => setSelectedAlert(null)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Shield className="mr-2 text-blue-400" size={18} />
                      Event Information
                    </h3>
                    
                    <div className="bg-gray-900 bg-opacity-50 p-4 rounded-md border border-gray-800">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Primary Object</p>
                          <p className="font-medium">{selectedAlert.objectName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Secondary Object</p>
                          <p className="font-medium">{selectedAlert.targetName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Severity</p>
                          <p className={`font-medium inline-flex items-center px-2 py-1 rounded-full text-sm ${
                            selectedAlert.severity === 'critical' ? 'bg-red-500 text-white' : 
                            selectedAlert.severity === 'high' ? 'bg-orange-500 text-white' : 
                            selectedAlert.severity === 'medium' ? 'bg-yellow-500 text-black' : 
                            'bg-green-500 text-black'
                          }`}>
                            {selectedAlert.severity.charAt(0).toUpperCase() + selectedAlert.severity.slice(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Orbit Region</p>
                          <p className="font-medium">{selectedAlert.orbitRegion}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Size</p>
                          <p className="font-medium">{selectedAlert.size.charAt(0).toUpperCase() + selectedAlert.size.slice(1)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Data Source</p>
                          <p className="font-medium">{selectedAlert.source}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Activity className="mr-2 text-purple-400" size={18} />
                      Conjunction Details
                    </h3>
                    
                    <div className="bg-gray-900 bg-opacity-50 p-4 rounded-md border border-gray-800">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">TCA</p>
                          <p className="font-medium">{formatTime(selectedAlert.impactTime)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Time to Closest Approach</p>
                          <p className="font-medium">{formatTimeToImpact(selectedAlert.timeToImpact)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Miss Distance</p>
                          <p className="font-medium">{selectedAlert.missDistance} km</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Relative Velocity</p>
                          <p className="font-medium">{selectedAlert.relativeVelocity} km/s</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Probability</p>
                          <p className="font-medium">{selectedAlert.probability}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Status</p>
                          <p className={`font-medium inline-flex items-center px-2 py-1 rounded text-sm ${
                            selectedAlert.resolved 
                              ? 'bg-green-900 bg-opacity-30 text-green-400' 
                              : 'bg-blue-900 bg-opacity-30 text-blue-400'
                          }`}>
                            {selectedAlert.resolved ? 'Resolved' : 'Active'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Calendar className="mr-2 text-cyan-400" size={18} />
                      Timeline
                    </h3>
                    
                    <div className="relative pl-6 border-l-2 border-gray-800 space-y-4">
                      <div className="relative">
                        <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-8 border-2 border-gray-900"></div>
                        <div>
                          <p className="text-sm text-gray-400">{formatTime(selectedAlert.timestamp)}</p>
                          <p className="font-medium">Alert Generated</p>
                          <p className="text-sm">Initial detection by {selectedAlert.source}</p>
                        </div>
                      </div>
                      
                      {selectedAlert.mitigationStatus === 'in-progress' && (
                        <div className="relative">
                          <div className="absolute w-4 h-4 bg-yellow-500 rounded-full -left-8 border-2 border-gray-900"></div>
                          <div>
                            <p className="text-sm text-gray-400">{formatTime(new Date(new Date(selectedAlert.timestamp).getTime() + 2 * 60 * 60 * 1000))}</p>
                            <p className="font-medium">Mitigation Started</p>
                            <p className="text-sm">Collision avoidance procedure initiated</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedAlert.resolved && (
                        <div className="relative">
                          <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-8 border-2 border-gray-900"></div>
                          <div>
                            <p className="text-sm text-gray-400">{formatTime(new Date())}</p>
                            <p className="font-medium">Alert Resolved</p>
                            <p className="text-sm">Conjunction no longer poses a threat</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="relative">
                        <div className={`absolute w-4 h-4 ${selectedAlert.resolved ? 'bg-gray-600' : 'bg-red-500 animate-pulse'} rounded-full -left-8 border-2 border-gray-900`}></div>
                        <div>
                          <p className="text-sm text-gray-400">{formatTime(selectedAlert.impactTime)}</p>
                          <p className="font-medium">Predicted Closest Approach</p>
                          <p className="text-sm">
                            {selectedAlert.resolved 
                              ? 'Event passed without incident' 
                              : `${formatTimeToImpact(selectedAlert.timeToImpact)} remaining`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Layers className="mr-2 text-cyan-400" size={18} />
                      Orbit Visualization
                    </h3>
                    
                    <div className="h-40 w-full bg-gray-900 bg-opacity-50 rounded-md border border-gray-800 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Layers size={32} className="mx-auto mb-2 text-blue-400" />
                        <p>Orbit visualization would render here</p>
                        <p className="text-xs">Using trajectory data for {selectedAlert.objectName}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button className={`px-3 py-1 text-sm rounded border ${visualizationMode === '2d' ? 'bg-blue-600 text-white' : 'border-gray-700 text-gray-300'}`} onClick={() => setVisualizationMode('2d')}>
                        2D View
                      </button>
                      <button className={`px-3 py-1 text-sm rounded border ${visualizationMode === '3d' ? 'bg-blue-600 text-white' : 'border-gray-700 text-gray-300'}`} onClick={() => setVisualizationMode('3d')}>
                        3D View
                      </button>
                      
                      <div className="flex items-center ml-4">
                        <span className="text-xs text-gray-400 mr-2">Speed:</span>
                        <input 
                          type="range" 
                          min="0.1" 
                          max="10" 
                          step="0.1"
                          value={simulationSpeed}
                          onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                          className="w-24 h-1.5 bg-gray-700 rounded-full appearance-none"
                        />
                        <span className="text-xs ml-2">{simulationSpeed}x</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Zap className="mr-2 text-yellow-400" size={18} />
                      Actions & Recommendations
                    </h3>
                    
                    <div className="space-y-2">
                      {!selectedAlert.resolved && (
                        <>
                          <button 
                            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                            onClick={() => alert("Would initiate mitigation procedure")}
                            disabled={selectedAlert.mitigationStatus === 'in-progress'}
                          >
                            {selectedAlert.mitigationStatus === 'in-progress' ? (
                              <>
                                <RotateCw size={16} className="mr-2 animate-spin" />
                                Mitigation In Progress
                              </>
                            ) : (
                              <>
                                <Zap size={16} className="mr-2" />
                                Initiate Collision Avoidance
                              </>
                            )}
                          </button>
                          
                          <button 
                            className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                            onClick={() => resolveAlert(selectedAlert.id)}
                          >
                            <CheckCircle size={16} className="mr-2" />
                            Mark As Resolved
                          </button>
                        </>
                      )}
                      
                      <button 
                        className="w-full p-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
                        onClick={() => alert("Would generate PDF report")}
                      >
                        <Eye size={16} className="mr-2" />
                        Generate Detailed Report
                      </button>
                    </div>
                    
                    <div className="mt-4 bg-gray-900 bg-opacity-50 p-3 rounded-md border border-gray-800">
                      <h4 className="text-sm font-medium mb-2">AI Recommendation</h4>
                      {selectedAlert.severity === 'critical' ? (
                        <p className="text-sm text-red-400">
                          <strong>URGENT:</strong> Immediate collision avoidance maneuver recommended. Estimated delta-v requirement of 0.4 m/s. Optimal time window for maneuver: next 4-6 hours.
                        </p>
                      ) : selectedAlert.severity === 'high' ? (
                        <p className="text-sm text-orange-400">
                          Recommend preparation for potential collision avoidance maneuver. Continue monitoring. If probability exceeds 80%, execute pre-planned maneuver within 12 hours.
                        </p>
                      ) : (
                        <p className="text-sm text-blue-400">
                          Continued monitoring recommended. No immediate action required. Reassess in 6 hours as tracking data improves.
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <MessageSquare className="mr-2 text-indigo-400" size={18} />
                      Notes & Communication
                    </h3>
                    
                    <div className="border border-gray-800 rounded-md overflow-hidden">
                      <div className="max-h-48 overflow-y-auto p-3 bg-gray-900 bg-opacity-50">
                        {selectedAlert.notes && selectedAlert.notes.length > 0 ? (
                          <div className="space-y-3">
                            {selectedAlert.notes.map(note => (
                              <div key={note.id} className="bg-gray-800 p-2 rounded border border-gray-700">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="font-medium">{note.user}</span>
                                  <span className="text-gray-400">{formatTime(note.timestamp)}</span>
                                </div>
                                <p className="text-sm">{note.text}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-gray-500 text-sm py-6">No notes yet</p>
                        )}
                      </div>
                      
                      <div className="p-3 border-t border-gray-800">
                        <div className="flex">
                          <input 
                            type="text" 
                            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 border-gray-700 text-white"
                            placeholder="Add a note..."
                            value={noteText}
                            onChange={e => setNoteText(e.target.value)}
                            onKeyPress={e => {
                              if (e.key === 'Enter') {
                                addNote(selectedAlert.id, noteText);
                                setNoteText('');
                              }
                            }}
                          />
                          <button 
                            className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                            onClick={() => {
                              addNote(selectedAlert.id, noteText);
                              setNoteText('');
                            }}
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-800 flex justify-end">
              <button 
                className="px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 mr-2"
                onClick={() => setSelectedAlert(null)}
              >
                Close
              </button>
              
              {!selectedAlert.resolved && (
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  onClick={() => resolveAlert(selectedAlert.id)}
                >
                  Mark As Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Audio element for alert sounds */}
      <audio ref={alarmSound} src="/alert-sound.mp3" />
    </div>
  );
};

export default AdvancedDebrisAlertSystem;