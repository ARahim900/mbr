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

// Mock data structure - this should be replaced with actual CSV data
export const waterMeters: WaterMeter[] = [
  // Zone 3A meters
  {
    "Meter Label": "Zone 3A Bulk",
    "Acct #": "4300295",
    "Zone": "Zone 3A",
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
    "Meter Label": "3A Individual Meter 1",
    "Acct #": "4300296",
    "Zone": "Zone 3A",
    "Type": "Retail",
    "Parent Meter": "Zone 3A Bulk",
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
  },
  // More zones to be added...
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