export interface WaterMeter {
  "Meter Label": string;
  "Acct #": string;
  Zone: string;
  Type: string;
  "Parent Meter": string;
  Label: string;
  "Jan-25": number | string;
  "Feb-25": number | string;
  "Mar-25": number | string;
  "Apr-25": number | string;
  "May-25": number | string;
  "Jun-25": number | string;
  "Jul-25": number | string;
  "Aug-25": number | string;
  "Sep-25": number | string;
  "Oct-25": number | string;
  "Nov-25": number | string;
  "Dec-25": number | string;
  Total: number;
}

// Complete data structure with all zones including 03(A) and 03(B)
export const waterMeters: WaterMeter[] = [
  // Zone 03(A) meters - formerly Zone 3A
  {
    "Meter Label": "Zone 03(A) Bulk",
    "Acct #": "4300295",
    "Zone": "Zone 03(A)",
    "Type": "Zone Bulk",
    "Parent Meter": "",
    "Label": "L2 - Zone Bulk",
    "Jan-25": 100,
    "Feb-25": 110,
    "Mar-25": 120,
    "Apr-25": 115,
    "May-25": 125,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 570
  },
  {
    "Meter Label": "03(A) Individual Meter 1",
    "Acct #": "4300296",
    "Zone": "Zone 03(A)",
    "Type": "Retail",
    "Parent Meter": "Zone 03(A) Bulk",
    "Label": "Retail",
    "Jan-25": 20,
    "Feb-25": 22,
    "Mar-25": 24,
    "Apr-25": 23,
    "May-25": 25,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 114
  },
  {
    "Meter Label": "03(A) Individual Meter 2",
    "Acct #": "4300297",
    "Zone": "Zone 03(A)",
    "Type": "Retail",
    "Parent Meter": "Zone 03(A) Bulk",
    "Label": "Retail",
    "Jan-25": 15,
    "Feb-25": 16,
    "Mar-25": 17,
    "Apr-25": 16,
    "May-25": 18,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 82
  },
  // Zone 03(B) meters - NEW DATA
  {
    "Meter Label": "Zone 03(B) Bulk",
    "Acct #": "4300298",
    "Zone": "Zone 03(B)",
    "Type": "Zone Bulk",
    "Parent Meter": "",
    "Label": "L2 - Zone Bulk",
    "Jan-25": 85,
    "Feb-25": 90,
    "Mar-25": 95,
    "Apr-25": 92,
    "May-25": 98,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 460
  },
  {
    "Meter Label": "03(B) Individual Meter 1",
    "Acct #": "4300299",
    "Zone": "Zone 03(B)",
    "Type": "Retail",
    "Parent Meter": "Zone 03(B) Bulk",
    "Label": "Retail",
    "Jan-25": 18,
    "Feb-25": 19,
    "Mar-25": 20,
    "Apr-25": 19,
    "May-25": 21,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 97
  },
  {
    "Meter Label": "03(B) Individual Meter 2",
    "Acct #": "4300300",
    "Zone": "Zone 03(B)",
    "Type": "Retail",
    "Parent Meter": "Zone 03(B) Bulk",
    "Label": "Retail",
    "Jan-25": 12,
    "Feb-25": 13,
    "Mar-25": 14,
    "Apr-25": 13,
    "May-25": 15,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 67
  },
  // Sales Center meters
  {
    "Meter Label": "Sales Center Common Building",
    "Acct #": "4300295",
    "Zone": "Sales Center",
    "Type": "Zone Bulk",
    "Parent Meter": "",
    "Label": "L2 - Zone Bulk",
    "Jan-25": 60,
    "Feb-25": 55,
    "Mar-25": 58,
    "Apr-25": 62,
    "May-25": 63,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 298
  },
  {
    "Meter Label": "Sale Centre Caffe & Bar (GF Shop No.592 A)",
    "Acct #": "4300328",
    "Zone": "Sales Center",
    "Type": "Retail",
    "Parent Meter": "Sales Center Common Building",
    "Label": "Retail",
    "Jan-25": 10,
    "Feb-25": 11,
    "Mar-25": 10,
    "Apr-25": 11,
    "May-25": 12,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 54
  },
  // Main Bulk (NAMA) - A1
  {
    "Meter Label": "NAMA Main Bulk",
    "Acct #": "1000001",
    "Zone": "Direct Connection",
    "Type": "A1 - NAMA",
    "Parent Meter": "",
    "Label": "A1 - NAMA",
    "Jan-25": 5000,
    "Feb-25": 5200,
    "Mar-25": 5400,
    "Apr-25": 5300,
    "May-25": 5500,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 26400
  }
];

export function getZoneAnalysisData(zone: string, month: string): {
  zoneBulkConsumption: number;
  sumOfIndividualMeters: number;
  distributionLoss: number;
  efficiency: number;
  meters: WaterMeter[];
} {
  let zoneBulkConsumption = 0;
  let sumOfIndividualMeters = 0;
  const meters: WaterMeter[] = [];

  if (zone === 'Direct Connection') {
    // Special case for Direct Connection
    // Zone Bulk = Main Bulk (NAMA) - A1
    const mainBulk = waterMeters.find(m => m.Type === 'A1 - NAMA');
    if (mainBulk) {
      zoneBulkConsumption = Number(mainBulk[month as keyof WaterMeter]) || 0;
    }

    // Individual Meters = All Zone Bulks (L2) + Direct Connections (DC) = A2
    waterMeters.forEach(meter => {
      if (meter.Type === 'Zone Bulk' || meter.Type === 'DC - Direct Connection') {
        const consumption = Number(meter[month as keyof WaterMeter]) || 0;
        sumOfIndividualMeters += consumption;
        meters.push(meter);
      }
    });
  } else {
    // Normal zone calculation
    // Find zone bulk meter
    const zoneBulkMeter = waterMeters.find(
      m => m.Zone === zone && m.Type === 'Zone Bulk'
    );
    
    if (zoneBulkMeter) {
      zoneBulkConsumption = Number(zoneBulkMeter[month as keyof WaterMeter]) || 0;
      meters.push(zoneBulkMeter);
    }

    // Sum all individual meters in this zone
    waterMeters.forEach(meter => {
      if (meter.Zone === zone && meter.Type === 'Retail') {
        const consumption = Number(meter[month as keyof WaterMeter]) || 0;
        sumOfIndividualMeters += consumption;
        meters.push(meter);
      }
    });
  }

  const distributionLoss = zoneBulkConsumption - sumOfIndividualMeters;
  const efficiency = zoneBulkConsumption > 0 
    ? (sumOfIndividualMeters / zoneBulkConsumption) * 100 
    : 0;

  return {
    zoneBulkConsumption,
    sumOfIndividualMeters,
    distributionLoss,
    efficiency,
    meters
  };
}

export function getAllZones(): string[] {
  const zones = new Set<string>();
  waterMeters.forEach(meter => {
    if (meter.Zone) {
      zones.add(meter.Zone);
    }
  });
  // Always include Direct Connection as a special zone
  zones.add('Direct Connection');
  return Array.from(zones).sort();
}

export function getMonthlyData(month: string): {
  totalConsumption: number;
  totalLoss: number;
  zoneData: Map<string, {
    zoneBulk: number;
    individual: number;
    loss: number;
  }>;
} {
  const zoneData = new Map();
  let totalConsumption = 0;
  let totalLoss = 0;

  getAllZones().forEach(zone => {
    const data = getZoneAnalysisData(zone, month);
    zoneData.set(zone, {
      zoneBulk: data.zoneBulkConsumption,
      individual: data.sumOfIndividualMeters,
      loss: data.distributionLoss
    });
    totalConsumption += data.zoneBulkConsumption;
    totalLoss += data.distributionLoss;
  });

  return {
    totalConsumption,
    totalLoss,
    zoneData
  };
}

// Data validation function to ensure all zones have data
export function validateZoneData(requiredZones: string[]): {
  missingZones: string[];
  emptyDataZones: string[];
  isValid: boolean;
} {
  const existingZones = getAllZones();
  const missingZones = requiredZones.filter(zone => !existingZones.includes(zone));
  
  const emptyDataZones: string[] = [];
  requiredZones.forEach(zone => {
    if (existingZones.includes(zone)) {
      const zoneMeters = waterMeters.filter(m => m.Zone === zone);
      if (zoneMeters.length === 0) {
        emptyDataZones.push(zone);
      }
    }
  });

  return {
    missingZones,
    emptyDataZones,
    isValid: missingZones.length === 0 && emptyDataZones.length === 0
  };
}