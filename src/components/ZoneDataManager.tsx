import React, { useState, useEffect, useMemo } from 'react';

interface ZoneData {
  id: string;
  name: string;
  alarms: AlarmData[];
  status: 'active' | 'inactive' | 'maintenance';
  lastUpdated: Date;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface AlarmData {
  id: string;
  type: 'fire' | 'smoke' | 'co' | 'heat' | 'manual';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  location: string;
  resolved: boolean;
  description?: string;
}

// Fix for Zone 03 data structure and validation
const ZONE_03_DATA: ZoneData = {
  id: 'zone-03',
  name: 'Zone 03 - Industrial Complex',
  status: 'active',
  lastUpdated: new Date('2025-08-04T10:00:00Z'),
  coordinates: {
    lat: 23.6143, // Muscat coordinates
    lng: 58.5922
  },
  alarms: [
    {
      id: 'alarm-03-001',
      type: 'fire',
      severity: 'high',
      timestamp: new Date('2025-08-04T09:45:00Z'),
      location: 'Building A - Floor 2',
      resolved: false,
      description: 'Fire alarm triggered in manufacturing area'
    },
    {
      id: 'alarm-03-002',
      type: 'smoke',
      severity: 'medium',
      timestamp: new Date('2025-08-04T08:30:00Z'),
      location: 'Building B - Warehouse',
      resolved: true,
      description: 'Smoke detected in storage area - resolved by ventilation'
    },
    {
      id: 'alarm-03-003',
      type: 'co',
      severity: 'critical',
      timestamp: new Date('2025-08-04T07:15:00Z'),
      location: 'Building C - Generator Room',
      resolved: false,
      description: 'Carbon monoxide detected above safe levels'
    }
  ]
};

interface ZoneDataManagerProps {
  onDataUpdate?: (zoneData: ZoneData) => void;
}

const ZoneDataManager: React.FC<ZoneDataManagerProps> = ({ onDataUpdate }) => {
  const [zoneData, setZoneData] = useState<ZoneData>(ZONE_03_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Validate zone data structure
  const validateZoneData = (data: ZoneData): boolean => {
    try {
      // Check required fields
      if (!data.id || !data.name || !data.status) {
        throw new Error('Missing required zone fields');
      }

      // Validate status
      if (!['active', 'inactive', 'maintenance'].includes(data.status)) {
        throw new Error('Invalid zone status');
      }

      // Validate alarms array
      if (!Array.isArray(data.alarms)) {
        throw new Error('Alarms must be an array');
      }

      // Validate each alarm
      data.alarms.forEach((alarm, index) => {
        if (!alarm.id || !alarm.type || !alarm.severity || !alarm.timestamp) {
          throw new Error(`Invalid alarm data at index ${index}`);
        }

        if (!['fire', 'smoke', 'co', 'heat', 'manual'].includes(alarm.type)) {
          throw new Error(`Invalid alarm type at index ${index}: ${alarm.type}`);
        }

        if (!['low', 'medium', 'high', 'critical'].includes(alarm.severity)) {
          throw new Error(`Invalid alarm severity at index ${index}: ${alarm.severity}`);
        }

        if (!(alarm.timestamp instanceof Date) || isNaN(alarm.timestamp.getTime())) {
          throw new Error(`Invalid alarm timestamp at index ${index}`);
        }
      });

      return true;
    } catch (err: any) {
      setError(`Data validation failed: ${err.message}`);
      return false;
    }
  };

  // Fix and normalize zone data
  const fixZoneData = (rawData: any): ZoneData => {
    try {
      const fixedData: ZoneData = {
        id: rawData.id || 'zone-03',
        name: rawData.name || 'Zone 03',
        status: ['active', 'inactive', 'maintenance'].includes(rawData.status) 
          ? rawData.status 
          : 'active',
        lastUpdated: rawData.lastUpdated instanceof Date 
          ? rawData.lastUpdated 
          : new Date(),
        coordinates: rawData.coordinates || { lat: 23.6143, lng: 58.5922 },
        alarms: []
      };

      // Fix alarms data
      if (Array.isArray(rawData.alarms)) {
        fixedData.alarms = rawData.alarms
          .map((alarm: any) => {
            try {
              return {
                id: alarm.id || `alarm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: ['fire', 'smoke', 'co', 'heat', 'manual'].includes(alarm.type) 
                  ? alarm.type 
                  : 'fire',
                severity: ['low', 'medium', 'high', 'critical'].includes(alarm.severity) 
                  ? alarm.severity 
                  : 'medium',
                timestamp: alarm.timestamp instanceof Date 
                  ? alarm.timestamp 
                  : new Date(alarm.timestamp) || new Date(),
                location: alarm.location || 'Unknown Location',
                resolved: Boolean(alarm.resolved),
                description: alarm.description || ''
              };
            } catch {
              return null;
            }
          })
          .filter(Boolean) as AlarmData[];
      }

      return fixedData;
    } catch (err) {
      console.error('Error fixing zone data:', err);
      return ZONE_03_DATA; // Fallback to default data
    }
  };

  // Sync data with server (simulated)
  const syncData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real application, this would fetch from an API
      // For now, we'll validate and fix the current data
      const validatedData = fixZoneData(zoneData);
      
      if (validateZoneData(validatedData)) {
        setZoneData(validatedData);
        setLastSyncTime(new Date());
        onDataUpdate?.(validatedData);
      }
    } catch (err: any) {
      setError(`Sync failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-sync data every 30 seconds
  useEffect(() => {
    const interval = setInterval(syncData, 30000);
    
    // Initial sync
    syncData();
    
    return () => clearInterval(interval);
  }, []);

  // Memoized computed values
  const alarmStats = useMemo(() => {
    const activeAlarms = zoneData.alarms.filter(alarm => !alarm.resolved);
    const criticalAlarms = activeAlarms.filter(alarm => alarm.severity === 'critical');
    const highAlarms = activeAlarms.filter(alarm => alarm.severity === 'high');
    
    return {
      total: zoneData.alarms.length,
      active: activeAlarms.length,
      critical: criticalAlarms.length,
      high: highAlarms.length,
      resolved: zoneData.alarms.filter(alarm => alarm.resolved).length
    };
  }, [zoneData.alarms]);

  const handleManualSync = () => {
    if (!isLoading) {
      syncData();
    }
  };

  const handleResolveAlarm = (alarmId: string) => {
    setZoneData(prevData => ({
      ...prevData,
      alarms: prevData.alarms.map(alarm =>
        alarm.id === alarmId ? { ...alarm, resolved: true } : alarm
      ),
      lastUpdated: new Date()
    }));
  };

  return (
    <div className="zone-data-manager">
      <div className="zone-header">
        <h2>{zoneData.name}</h2>
        <div className="zone-status">
          <span className={`status-badge ${zoneData.status}`}>
            {zoneData.status.toUpperCase()}
          </span>
          <button 
            onClick={handleManualSync} 
            disabled={isLoading}
            className="sync-btn"
          >
            {isLoading ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{alarmStats.total}</div>
          <div className="stat-label">Total Alarms</div>
        </div>
        <div className="stat-card active">
          <div className="stat-number">{alarmStats.active}</div>
          <div className="stat-label">Active Alarms</div>
        </div>
        <div className="stat-card critical">
          <div className="stat-number">{alarmStats.critical}</div>
          <div className="stat-label">Critical</div>
        </div>
        <div className="stat-card resolved">
          <div className="stat-number">{alarmStats.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      <div className="alarms-list">
        <h3>Recent Alarms</h3>
        {zoneData.alarms.length === 0 ? (
          <div className="no-alarms">No alarms recorded</div>
        ) : (
          zoneData.alarms
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .map(alarm => (
              <div key={alarm.id} className={`alarm-card ${alarm.severity} ${alarm.resolved ? 'resolved' : ''}`}>
                <div className="alarm-header">
                  <div className="alarm-type">{alarm.type.toUpperCase()}</div>
                  <div className="alarm-severity">{alarm.severity}</div>
                  <div className="alarm-time">
                    {new Intl.DateTimeFormat('en-US', {
                      timeZone: 'Asia/Muscat',
                      dateStyle: 'short',
                      timeStyle: 'short'
                    }).format(alarm.timestamp)}
                  </div>
                </div>
                <div className="alarm-location">{alarm.location}</div>
                {alarm.description && (
                  <div className="alarm-description">{alarm.description}</div>
                )}
                {!alarm.resolved && (
                  <button 
                    onClick={() => handleResolveAlarm(alarm.id)}
                    className="resolve-btn"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            ))
        )}
      </div>

      {lastSyncTime && (
        <div className="sync-info">
          Last updated: {new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Muscat',
            dateStyle: 'short',
            timeStyle: 'medium'
          }).format(lastSyncTime)}
        </div>
      )}

      <style jsx>{`
        .zone-data-manager {
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .zone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .zone-header h2 {
          margin: 0;
          color: #333;
          font-size: 1.5rem;
        }

        .zone-status {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.8rem;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .status-badge.maintenance {
          background: #fff3cd;
          color: #856404;
        }

        .sync-btn {
          padding: 0.5rem 1rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .sync-btn:hover:not(:disabled) {
          background: #0056b3;
        }

        .sync-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          border-left: 4px solid #dc3545;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          background: #f8f9fa;
          border: 2px solid #e9ecef;
        }

        .stat-card.active {
          background: #fff3cd;
          border-color: #ffeaa7;
        }

        .stat-card.critical {
          background: #f8d7da;
          border-color: #f5c6cb;
        }

        .stat-card.resolved {
          background: #d4edda;
          border-color: #c3e6cb;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
          margin-top: 0.25rem;
        }

        .alarms-list h3 {
          color: #333;
          margin-bottom: 1rem;
        }

        .no-alarms {
          text-align: center;
          color: #666;
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .alarm-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          border-left-width: 4px;
        }

        .alarm-card.critical {
          border-left-color: #dc3545;
          background: #fff5f5;
        }

        .alarm-card.high {
          border-left-color: #fd7e14;
          background: #fff8f0;
        }

        .alarm-card.medium {
          border-left-color: #ffc107;
          background: #fffbf0;
        }

        .alarm-card.low {
          border-left-color: #28a745;
          background: #f8fff8;
        }

        .alarm-card.resolved {
          opacity: 0.7;
          background: #f8f9fa !important;
        }

        .alarm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .alarm-type {
          font-weight: bold;
          font-size: 0.9rem;
        }

        .alarm-severity {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .alarm-time {
          font-size: 0.8rem;
          color: #666;
        }

        .alarm-location {
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .alarm-description {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .resolve-btn {
          padding: 0.5rem 1rem;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .resolve-btn:hover {
          background: #218838;
        }

        .sync-info {
          text-align: center;
          color: #666;
          font-size: 0.8rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }

        @media (max-width: 768px) {
          .zone-header {
            flex-direction: column;
            align-items: stretch;
          }

          .zone-status {
            justify-content: space-between;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .alarm-header {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default ZoneDataManager;