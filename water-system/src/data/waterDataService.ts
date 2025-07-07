import { WaterMeter } from './waterDatabase';
import { parseWaterConsumptionCSV, processWaterMeters } from '../utils/csvParser';

// Sample data based on the CSV structure - replace with actual CSV parsing
const sampleData: WaterMeter[] = [
  // Main Bulk (NAMA) - A1
  {
    "Meter Label": "NAMA Main Bulk",
    "Acct #": "1000001",
    "Zone": "Direct Connection",
    "Type": "A1 - NAMA",
    "Parent Meter": "",
    "Label": "A1 - NAMA",
    "Jan-25": 25000,
    "Feb-25": 26000,
    "Mar-25": 27000,
    "Apr-25": 26500,
    "May-25": 27500,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 132000
  },
  
  // Zone 3A
  {
    "Meter Label": "Zone 3A Bulk",
    "Acct #": "4300295",
    "Zone": "Zone 3A",
    "Type": "Zone Bulk",
    "Parent Meter": "NAMA Main Bulk",
    "Label": "L2 - Zone Bulk",
    "Jan-25": 2500,
    "Feb-25": 2600,
    "Mar-25": 2700,
    "Apr-25": 2650,
    "May-25": 2750,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 13200
  },
  // Zone 3A Individual meters
  {
    "Meter Label": "3A Shop 1",
    "Acct #": "4300296",
    "Zone": "Zone 3A",
    "Type": "Retail",
    "Parent Meter": "Zone 3A Bulk",
    "Label": "Retail",
    "Jan-25": 450,
    "Feb-25": 470,
    "Mar-25": 490,
    "Apr-25": 480,
    "May-25": 500,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 2390
  },
  {
    "Meter Label": "3A Shop 2",
    "Acct #": "4300297",
    "Zone": "Zone 3A",
    "Type": "Retail",
    "Parent Meter": "Zone 3A Bulk",
    "Label": "Retail",
    "Jan-25": 380,
    "Feb-25": 390,
    "Mar-25": 400,
    "Apr-25": 395,
    "May-25": 410,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 1975
  },
  
  // Sales Center
  {
    "Meter Label": "Sales Center Common Building",
    "Acct #": "4300295",
    "Zone": "Sales Center",
    "Type": "Zone Bulk",
    "Parent Meter": "NAMA Main Bulk",
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
  
  // Zone 5A
  {
    "Meter Label": "Zone 5A Bulk",
    "Acct #": "4300500",
    "Zone": "Zone 5A",
    "Type": "Zone Bulk",
    "Parent Meter": "NAMA Main Bulk",
    "Label": "L2 - Zone Bulk",
    "Jan-25": 3200,
    "Feb-25": 3300,
    "Mar-25": 3400,
    "Apr-25": 3350,
    "May-25": 3450,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 16700
  },
  {
    "Meter Label": "5A Office Building",
    "Acct #": "4300501",
    "Zone": "Zone 5A",
    "Type": "Retail",
    "Parent Meter": "Zone 5A Bulk",
    "Label": "Retail",
    "Jan-25": 1200,
    "Feb-25": 1250,
    "Mar-25": 1300,
    "Apr-25": 1275,
    "May-25": 1320,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 6345
  },
  
  // Direct Connections (DC)
  {
    "Meter Label": "Direct Connection 1",
    "Acct #": "4300600",
    "Zone": "Direct Connection",
    "Type": "DC - Direct Connection",
    "Parent Meter": "NAMA Main Bulk",
    "Label": "DC - Direct Connection",
    "Jan-25": 800,
    "Feb-25": 820,
    "Mar-25": 840,
    "Apr-25": 830,
    "May-25": 850,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 4140
  },
  {
    "Meter Label": "Direct Connection 2",
    "Acct #": "4300601",
    "Zone": "Direct Connection",
    "Type": "DC - Direct Connection",
    "Parent Meter": "NAMA Main Bulk",
    "Label": "DC - Direct Connection",
    "Jan-25": 600,
    "Feb-25": 620,
    "Mar-25": 640,
    "Apr-25": 630,
    "May-25": 650,
    "Jun-25": "",
    "Jul-25": "",
    "Aug-25": "",
    "Sep-25": "",
    "Oct-25": "",
    "Nov-25": "",
    "Dec-25": "",
    "Total": 3140
  }
];

export class WaterDataService {
  private waterMeters: WaterMeter[] = sampleData;

  // Load data from CSV file
  async loadFromCSV(csvContent: string) {
    try {
      const meters = parseWaterConsumptionCSV(csvContent);
      this.waterMeters = processWaterMeters(meters);
      return this.waterMeters;
    } catch (error) {
      console.error('Error loading CSV:', error);
      throw error;
    }
  }

  // Get all water meters
  getAllMeters(): WaterMeter[] {
    return this.waterMeters;
  }

  // Get all unique zones
  getAllZones(): string[] {
    const zones = new Set<string>();
    this.waterMeters.forEach(meter => {
      if (meter.Zone && meter.Zone.trim() !== '') {
        zones.add(meter.Zone);
      }
    });
    return Array.from(zones).sort();
  }

  // Get zone analysis data
  getZoneAnalysisData(zone: string, month: string): {
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
      const mainBulk = this.waterMeters.find(m => m.Type === 'A1 - NAMA');
      if (mainBulk) {
        zoneBulkConsumption = Number(mainBulk[month as keyof WaterMeter]) || 0;
        meters.push(mainBulk);
      }

      // Individual Meters = All Zone Bulks (L2) + Direct Connections (DC) = A2
      this.waterMeters.forEach(meter => {
        if (meter.Type === 'Zone Bulk' || meter.Type === 'DC - Direct Connection') {
          const consumption = Number(meter[month as keyof WaterMeter]) || 0;
          sumOfIndividualMeters += consumption;
          if (meter.Type !== 'A1 - NAMA') {
            meters.push(meter);
          }
        }
      });
    } else {
      // Normal zone calculation
      // Find zone bulk meter
      const zoneBulkMeter = this.waterMeters.find(
        m => m.Zone === zone && m.Type === 'Zone Bulk'
      );
      
      if (zoneBulkMeter) {
        zoneBulkConsumption = Number(zoneBulkMeter[month as keyof WaterMeter]) || 0;
        meters.push(zoneBulkMeter);
      }

      // Sum all individual meters in this zone
      this.waterMeters.forEach(meter => {
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

  // Get monthly summary for all zones
  getMonthlySummary(month: string): {
    totalConsumption: number;
    totalLoss: number;
    zonesSummary: Array<{
      zone: string;
      zoneBulk: number;
      individual: number;
      loss: number;
      efficiency: number;
    }>;
  } {
    const zonesSummary: Array<{
      zone: string;
      zoneBulk: number;
      individual: number;
      loss: number;
      efficiency: number;
    }> = [];
    
    let totalConsumption = 0;
    let totalLoss = 0;

    this.getAllZones().forEach(zone => {
      const data = this.getZoneAnalysisData(zone, month);
      zonesSummary.push({
        zone,
        zoneBulk: data.zoneBulkConsumption,
        individual: data.sumOfIndividualMeters,
        loss: data.distributionLoss,
        efficiency: data.efficiency
      });
      totalConsumption += data.zoneBulkConsumption;
      totalLoss += data.distributionLoss;
    });

    return {
      totalConsumption,
      totalLoss,
      zonesSummary
    };
  }

  // Set water meters (for testing or manual data loading)
  setWaterMeters(meters: WaterMeter[]) {
    this.waterMeters = meters;
  }
}

// Create singleton instance
export const waterDataService = new WaterDataService();