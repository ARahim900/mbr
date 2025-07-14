export interface FirefightingEquipment {
  id: string;
  zone: string;
  building: string;
  systemType: 'Fire Alarm Panel' | 'Smoke Detector' | 'Fire Suppression' | 'Fire Extinguisher' | 'Emergency Lighting' | 'Fire Pump' | 'Heat Detector' | 'Manual Call Point' | 'Sprinkler Head' | 'Fire Hose Reel';
  equipment: string;
  manufacturer: string;
  model: string;
  serialNumber?: string;
  installDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'Operational' | 'Needs Attention' | 'Maintenance Due' | 'Expired' | 'Out of Service';
  batteryLevel: number; // 0-100, 0 if not applicable
  signalStrength: 'Strong' | 'Moderate' | 'Weak' | 'N/A';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  inspector: string;
  lastInspectionDate: string;
  complianceStatus: 'Compliant' | 'Non-Compliant' | 'Pending Review';
  certificationExpiry?: string;
  notes: string;
  maintenanceHistory: MaintenanceRecord[];
}

export interface MaintenanceRecord {
  date: string;
  type: 'Routine Inspection' | 'Repair' | 'Replacement' | 'Calibration' | 'Emergency Service';
  technician: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  cost?: number;
  nextAction?: string;
}

// Comprehensive firefighting equipment database
export const firefightingData: FirefightingEquipment[] = [
  {
    id: 'FF-001',
    zone: 'Zone FM',
    building: 'FM Building',
    systemType: 'Fire Alarm Panel',
    equipment: 'Main Fire Alarm Control Panel',
    manufacturer: 'Notifier',
    model: 'NFS2-3030',
    serialNumber: 'NOT-001-2022',
    installDate: '2022-01-15',
    lastMaintenance: '2024-12-01',
    nextMaintenance: '2025-03-01',
    status: 'Operational',
    batteryLevel: 95,
    signalStrength: 'Strong',
    priority: 'Critical',
    inspector: 'Bahwan Engineering',
    lastInspectionDate: '2024-12-01',
    complianceStatus: 'Compliant',
    certificationExpiry: '2025-01-15',
    notes: 'All zones functioning properly. Recent firmware update completed.',
    maintenanceHistory: [
      {
        date: '2024-12-01',
        type: 'Routine Inspection',
        technician: 'Ahmed Al-Rashid',
        description: 'Monthly inspection and battery test',
        status: 'Completed',
        cost: 75
      },
      {
        date: '2024-11-01',
        type: 'Calibration',
        technician: 'Mohammed Al-Balushi',
        description: 'Sensor sensitivity calibration',
        status: 'Completed',
        cost: 120
      }
    ]
  },
  {
    id: 'FF-002',
    zone: 'Zone 01',
    building: 'B1 Building',
    systemType: 'Smoke Detector',
    equipment: 'Optical Smoke Detector',
    manufacturer: 'Edwards',
    model: 'SIGA-PS',
    serialNumber: 'EDW-SD-001',
    installDate: '2022-02-10',
    lastMaintenance: '2024-11-15',
    nextMaintenance: '2025-02-15',
    status: 'Needs Attention',
    batteryLevel: 78,
    signalStrength: 'Weak',
    priority: 'High',
    inspector: 'Bahwan Engineering',
    lastInspectionDate: '2024-11-15',
    complianceStatus: 'Pending Review',
    certificationExpiry: '2025-02-10',
    notes: 'Signal interference detected - requires investigation. Possible wiring issue.',
    maintenanceHistory: [
      {
        date: '2024-11-15',
        type: 'Repair',
        technician: 'Khalid Al-Zadjali',
        description: 'Signal strength troubleshooting',
        status: 'In Progress',
        nextAction: 'Replace wiring harness'
      }
    ]
  },
  {
    id: 'FF-003',
    zone: 'Zone 02',
    building: 'B2 Building',
    systemType: 'Fire Suppression',
    equipment: 'Sprinkler System Zone 1',
    manufacturer: 'Tyco',
    model: 'TY-FRB',
    serialNumber: 'TYC-SPR-002',
    installDate: '2022-01-20',
    lastMaintenance: '2024-12-10',
    nextMaintenance: '2025-06-10',
    status: 'Operational',
    batteryLevel: 100,
    signalStrength: 'Strong',
    priority: 'Critical',
    inspector: 'Bahwan Engineering',
    lastInspectionDate: '2024-12-10',
    complianceStatus: 'Compliant',
    certificationExpiry: '2025-01-20',
    notes: 'Pressure test completed - all valves operational. System pressure: 45 PSI',
    maintenanceHistory: [
      {
        date: '2024-12-10',
        type: 'Routine Inspection',
        technician: 'Saif Al-Hinai',
        description: 'Quarterly pressure test and valve inspection',
        status: 'Completed',
        cost: 150
      }
    ]
  },
  {
    id: 'FF-004',
    zone: 'Zone 03A',
    building: 'D44 Building',
    systemType: 'Fire Extinguisher',
    equipment: 'CO2 Fire Extinguisher',
    manufacturer: 'Kidde',
    model: 'ProLine 5BC',
    serialNumber: 'KID-CO2-044',
    installDate: '2023-03-01',
    lastMaintenance: '2024-09-01',
    nextMaintenance: '2025-03-01',
    status: 'Expired',
    batteryLevel: 0,
    signalStrength: 'N/A',
    priority: 'Medium',
    inspector: 'Bahwan Engineering',
    lastInspectionDate: '2024-09-01',
    complianceStatus: 'Non-Compliant',
    certificationExpiry: '2024-12-01',
    notes: 'Requires immediate recharging and recertification. Weight below minimum.',
    maintenanceHistory: [
      {
        date: '2024-09-01',
        type: 'Routine Inspection',
        technician: 'Omar Al-Siyabi',
        description: 'Annual weight check and visual inspection',
        status: 'Completed',
        nextAction: 'Schedule recharging service'
      }
    ]
  },
  {
    id: 'FF-005',
    zone: 'Zone 03B',
    building: 'D45 Building',
    systemType: 'Emergency Lighting',
    equipment: 'LED Emergency Exit Sign',
    manufacturer: 'Cooper',
    model: 'APEL',
    serialNumber: 'COP-LED-045',
    installDate: '2022-04-15',
    lastMaintenance: '2024-10-20',
    nextMaintenance: '2025-01-20',
    status: 'Operational',
    batteryLevel: 88,
    signalStrength: 'Strong',
    priority: 'Medium',
    inspector: 'Bahwan Engineering',
    lastInspectionDate: '2024-10-20',
    complianceStatus: 'Compliant',
    certificationExpiry: '2025-04-15',
    notes: 'Battery backup tested - 3 hour duration confirmed. LED functioning properly.',
    maintenanceHistory: [
      {
        date: '2024-10-20',
        type: 'Routine Inspection',
        technician: 'Ali Al-Maskari',
        description: 'Monthly battery test and LED functionality check',
        status: 'Completed',
        cost: 45
      }
    ]
  },
  {
    id: 'FF-006',
    zone: 'Sales Center',
    building: 'Sales Center',
    systemType: 'Fire Alarm Panel',
    equipment: 'Addressable Fire Panel',
    manufacturer: 'Honeywell',
    model: 'FACP-HC',
    serialNumber: 'HON-FACP-SC01',
    installDate: '2021-12-01',
    lastMaintenance: '2024-11-30',
    nextMaintenance: '2025-02-28',
    status: 'Operational',
    batteryLevel: 92,
    signalStrength: 'Strong',
    priority: 'Critical',
    inspector: 'Bahwan Engineering',
    lastInspectionDate: '2024-11-30',
    complianceStatus: 'Compliant',
    certificationExpiry: '2024-12-01',
    notes: 'Recent software update completed. All zones reporting normal.',
    maintenanceHistory: [
      {
        date: '2024-11-30',
        type: 'Routine Inspection',
        technician: 'Hassan Al-Kindi',
        description: 'Monthly system check and software update',
        status: 'Completed',
        cost: 85
      }
    ]
  },
  {
    id: 'FF-007',
    zone: 'Zone FM',
    building: 'Pump Room',
    systemType: 'Fire Pump',
    equipment: 'Diesel Fire Pump',
    manufacturer: 'Grundfos',
    model: 'NK 200-400',
    serialNumber: 'GRU-FP-001',
    installDate: '2022-01-10',
    lastMaintenance: '2024-12-05',
    nextMaintenance: '2025-03-05',
    status: 'Operational',
    batteryLevel: 100,
    signalStrength: 'Strong',
    priority: 'Critical',
    inspector: 'Bahwan Engineering',
    lastInspectionDate: '2024-12-05',
    complianceStatus: 'Compliant',
    certificationExpiry: '2025-01-10',
    notes: 'Weekly run test completed - 45 PSI maintained. Diesel level: 85%',
    maintenanceHistory: [
      {
        date: '2024-12-05',
        type: 'Routine Inspection',
        technician: 'Yousuf Al-Riyami',
        description: 'Weekly operational test and pressure check',
        status: 'Completed',
        cost: 200
      }
    ]
  },
  {
    id: 'FF-008',
    zone: 'Zone 05',
    building: 'B5 Building',
    systemType: 'Heat Detector',
    equipment: 'Rate of Rise Heat Detector',
    manufacturer: 'Hochiki',
    model: 'DCD-1E',
    serialNumber: 'HOC-HD-005',
    installDate: '2022-05-20',
    lastMaintenance: '2024-08-15',
    nextMaintenance: '2025-02-15',
    status: 'Maintenance Due',
    batteryLevel: 65,
    signalStrength: 'Moderate',
    priority: 'High',
    inspector: 'Bahwan Engineering',
    lastInspectionDate: '2024-08-15',
    complianceStatus: 'Pending Review',
    certificationExpiry: '2025-05-20',
    notes: 'Sensitivity calibration required. Response time slightly delayed.',
    maintenanceHistory: [
      {
        date: '2024-08-15',
        type: 'Calibration',
        technician: 'Rashid Al-Busaidi',
        description: 'Sensitivity adjustment and response test',
        status: 'Completed',
        cost: 95,
        nextAction: 'Schedule recalibration service'
      }
    ]
  },
  {
    id: 'FF-009',
    zone: 'Zone 08',
    building: 'B8 Building',
    systemType: 'Manual Call Point',
    equipment: 'Break Glass Call Point',
    manufacturer: 'Apollo',
    model: 'SA5000-901APO',
    serialNumber: 'APO-MCP-008',
    installDate: '2022-03-15',
    lastMaintenance: '2024-11-10',
    nextMaintenance: '2025-05-10',
    status: 'Operational',
    batteryLevel: 0,
    signalStrength: 'Strong',
    priority: 'High',
    inspector: 'Bahwan Engineering',
    lastInspectionDate: '2024-11-10',
    complianceStatus: 'Compliant',
    certificationExpiry: '2025-03-15',
    notes: 'Glass element intact. Wiring and connections secure.',
    maintenanceHistory: [
      {
        date: '2024-11-10',
        type: 'Routine Inspection',
        technician: 'Khalil Al-Mamari',
        description: 'Visual inspection and connectivity test',
        status: 'Completed',
        cost: 35
      }
    ]
  },
  {
    id: 'FF-010',
    zone: 'Zone 03A',
    building: 'D44 Building',
    systemType: 'Fire Hose Reel',
    equipment: '19mm Fire Hose Reel',
    manufacturer: 'Angus Fire',
    model: 'Typhoon 19',
    serialNumber: 'ANG-HR-044',
    installDate: '2022-02-01',
    lastMaintenance: '2024-10-15',
    nextMaintenance: '2025-04-15',
    status: 'Operational',
    batteryLevel: 0,
    signalStrength: 'N/A',
    priority: 'Medium',
    inspector: 'Bahwan Engineering',
    lastInspectionDate: '2024-10-15',
    complianceStatus: 'Compliant',
    certificationExpiry: '2025-02-01',
    notes: 'Hose condition good. Water pressure test completed - 5 bar maintained.',
    maintenanceHistory: [
      {
        date: '2024-10-15',
        type: 'Routine Inspection',
        technician: 'Tariq Al-Wahaibi',
        description: 'Hose condition check and pressure test',
        status: 'Completed',
        cost: 65
      }
    ]
  }
];

// Statistics calculation functions
export const getFirefightingStats = () => {
  const total = firefightingData.length;
  const operational = firefightingData.filter(item => item.status === 'Operational').length;
  const needsAttention = firefightingData.filter(item => item.status === 'Needs Attention').length;
  const maintenanceDue = firefightingData.filter(item => item.status === 'Maintenance Due').length;
  const expired = firefightingData.filter(item => item.status === 'Expired').length;
  const outOfService = firefightingData.filter(item => item.status === 'Out of Service').length;
  const critical = firefightingData.filter(item => item.priority === 'Critical').length;
  const compliant = firefightingData.filter(item => item.complianceStatus === 'Compliant').length;
  const nonCompliant = firefightingData.filter(item => item.complianceStatus === 'Non-Compliant').length;

  return {
    total,
    operational,
    needsAttention,
    maintenanceDue,
    expired,
    outOfService,
    critical,
    compliant,
    nonCompliant,
    operationalPercentage: ((operational / total) * 100).toFixed(1),
    compliancePercentage: ((compliant / total) * 100).toFixed(1)
  };
};

// Get equipment by zone
export const getEquipmentByZone = (zone: string) => {
  return firefightingData.filter(item => item.zone === zone);
};

// Get equipment by system type
export const getEquipmentByType = (systemType: string) => {
  return firefightingData.filter(item => item.systemType === systemType);
};

// Get upcoming maintenance (next 30 days)
export const getUpcomingMaintenance = () => {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  return firefightingData.filter(item => {
    const nextMaintenanceDate = new Date(item.nextMaintenance);
    return nextMaintenanceDate <= thirtyDaysFromNow && nextMaintenanceDate >= new Date();
  });
};

// Get overdue maintenance
export const getOverdueMaintenance = () => {
  const today = new Date();
  return firefightingData.filter(item => {
    const nextMaintenanceDate = new Date(item.nextMaintenance);
    return nextMaintenanceDate < today;
  });
};

// Get all unique zones
export const getFirefightingZones = () => {
  const zones = [...new Set(firefightingData.map(item => item.zone))];
  return zones.sort();
};

// Get all unique system types
export const getFirefightingSystemTypes = () => {
  const types = [...new Set(firefightingData.map(item => item.systemType))];
  return types.sort();
};

// Maintenance cost analysis
export const getMaintenanceCosts = () => {
  const costs: { [key: string]: number } = {};
  
  firefightingData.forEach(item => {
    item.maintenanceHistory.forEach(record => {
      if (record.cost) {
        const month = record.date.substring(0, 7); // YYYY-MM format
        costs[month] = (costs[month] || 0) + record.cost;
      }
    });
  });
  
  return costs;
};

// System reliability analysis
export const getSystemReliability = () => {
  const reliability: { [key: string]: { total: number; operational: number } } = {};
  
  firefightingData.forEach(item => {
    if (!reliability[item.systemType]) {
      reliability[item.systemType] = { total: 0, operational: 0 };
    }
    reliability[item.systemType].total++;
    if (item.status === 'Operational') {
      reliability[item.systemType].operational++;
    }
  });
  
  const reliabilityData = Object.entries(reliability).map(([type, data]) => ({
    systemType: type,
    reliability: ((data.operational / data.total) * 100).toFixed(1),
    total: data.total,
    operational: data.operational
  }));
  
  return reliabilityData.sort((a, b) => parseFloat(b.reliability) - parseFloat(a.reliability));
}; 