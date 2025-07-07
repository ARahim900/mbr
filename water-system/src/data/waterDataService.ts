import { WaterMeter } from './waterDatabase';
import { parseWaterConsumptionCSV, processWaterMeters } from '../utils/csvParser';

// Zone name mapping to handle different variations
const ZONE_NAME_MAPPING: { [key: string]: string[] } = {
  'Zone 03(A)': ['Zone 03(A)', 'Zone 3A', 'Zone 03 A', 'Zone 03A', '3A'],
  'Zone 3A': ['Zone 03(A)', 'Zone 3A', 'Zone 03 A', 'Zone 03A', '3A'],
  'Sales Center': ['Sales Center', 'Sales Centre', 'Sale Center', 'Sale Centre'],
  'Zone 5A': ['Zone 5A', 'Zone 05A', 'Zone 05(A)', '5A'],
  'Direct Connection': ['Direct Connection', 'Direct Connections', 'DC'],
  // Add more mappings as needed
};

// Normalize zone names for consistent matching
function normalizeZoneName(zone: string): string {
  if (!zone) return '';
  
  // Check if this zone name matches any mapping
  for (const [normalized, variations] of Object.entries(ZONE_NAME_MAPPING)) {
    if (variations.some(v => v.toLowerCase() === zone.toLowerCase())) {
      return normalized;
    }
  }
  
  return zone;
}

// Sample data structure - will be replaced by CSV
const sampleData: WaterMeter[] = [];

export class WaterDataService {
  private waterMeters: WaterMeter[] = [];
  private isDataLoaded: boolean = false;

  // Load data from CSV file
  async loadFromCSV(csvContent: string) {
    try {
      const meters = parseWaterConsumptionCSV(csvContent);
      this.waterMeters = processWaterMeters(meters);
      
      // Normalize zone names
      this.waterMeters = this.waterMeters.map(meter => ({
        ...meter,
        Zone: normalizeZoneName(meter.Zone)
      }));
      
      this.isDataLoaded = true;
      console.log('Loaded meters:', this.waterMeters.length);
      console.log('Zones found:', this.getAllZones());
      
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
    buildingBulkConsumption: number;
    villasConsumption: number;
    buildingCount: number;
    villaCount: number;
  } {
    let zoneBulkConsumption = 0;
    let sumOfIndividualMeters = 0;
    let buildingBulkConsumption = 0;
    let villasConsumption = 0;
    let buildingCount = 0;
    let villaCount = 0;
    const meters: WaterMeter[] = [];

    // Normalize the search zone name
    const normalizedZone = normalizeZoneName(zone);

    if (normalizedZone === 'Direct Connection') {
      // Special case for Direct Connection
      // Zone Bulk = Main Bulk (NAMA) - A1
      const mainBulk = this.waterMeters.find(m => 
        m.Type === 'A1 - NAMA' || 
        m.Label === 'A1 - NAMA' ||
        m['Meter Label']?.toLowerCase().includes('nama main') ||
        m['Meter Label']?.toLowerCase().includes('main bulk')
      );
      
      if (mainBulk) {
        zoneBulkConsumption = Number(mainBulk[month as keyof WaterMeter]) || 0;
        meters.push(mainBulk);
      }

      // Individual Meters = All Zone Bulks (L2) + Direct Connections (DC) = A2
      this.waterMeters.forEach(meter => {
        if (meter.Type === 'Zone Bulk' || 
            meter.Type === 'DC - Direct Connection' ||
            meter.Label === 'L2 - Zone Bulk' ||
            meter.Label === 'DC - Direct Connection') {
          const consumption = Number(meter[month as keyof WaterMeter]) || 0;
          sumOfIndividualMeters += consumption;
          if (meter.Type !== 'A1 - NAMA' && meter.Label !== 'A1 - NAMA') {
            meters.push(meter);
          }
        }
      });
    } else {
      // Normal zone calculation
      // Find zone bulk meter - try multiple matching strategies
      const zoneBulkMeter = this.waterMeters.find(m => {
        const meterZone = normalizeZoneName(m.Zone);
        return (
          meterZone === normalizedZone && 
          (m.Type === 'Zone Bulk' || 
           m.Label === 'L2 - Zone Bulk' ||
           m['Meter Label']?.toLowerCase().includes('bulk') ||
           m['Meter Label']?.toLowerCase().includes('common'))
        );
      });
      
      if (zoneBulkMeter) {
        zoneBulkConsumption = Number(zoneBulkMeter[month as keyof WaterMeter]) || 0;
        meters.push(zoneBulkMeter);
      } else {
        console.warn(`No zone bulk meter found for zone: ${normalizedZone}`);
      }

      // Process all meters in this zone
      this.waterMeters.forEach(meter => {
        const meterZone = normalizeZoneName(meter.Zone);
        if (meterZone === normalizedZone) {
          const consumption = Number(meter[month as keyof WaterMeter]) || 0;
          
          // Check if it's a building bulk meter
          if (meter.Type === 'Building Bulk' || 
              meter.Label === 'L3 - Building Bulk' ||
              (meter['Meter Label']?.toLowerCase().includes('building') && 
               meter['Meter Label']?.toLowerCase().includes('bulk'))) {
            buildingBulkConsumption += consumption;
            buildingCount++;
            if (meter !== zoneBulkMeter) {
              meters.push(meter);
            }
          }
          // Check if it's a villa meter
          else if (meter.Type === 'Villa' || 
                   meter.Label === 'L4 - Villa' ||
                   meter['Meter Label']?.toLowerCase().includes('villa')) {
            villasConsumption += consumption;
            villaCount++;
            meters.push(meter);
          }
          // Regular retail meter
          else if (meter.Type === 'Retail' || 
                   meter.Label === 'Retail' ||
                   meter.Label === 'L5 - Retail') {
            sumOfIndividualMeters += consumption;
            if (meter !== zoneBulkMeter) {
              meters.push(meter);
            }
          }
        }
      });

      // Sum of individual meters includes building bulk + villas + retail
      sumOfIndividualMeters += buildingBulkConsumption + villasConsumption;
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
      meters,
      buildingBulkConsumption,
      villasConsumption,
      buildingCount,
      villaCount
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

  // Check if data is loaded
  hasData(): boolean {
    return this.isDataLoaded && this.waterMeters.length > 0;
  }

  // Set water meters (for testing or manual data loading)
  setWaterMeters(meters: WaterMeter[]) {
    this.waterMeters = meters.map(meter => ({
      ...meter,
      Zone: normalizeZoneName(meter.Zone)
    }));
    this.isDataLoaded = true;
  }

  // Get meters by zone
  getMetersByZone(zone: string): WaterMeter[] {
    const normalizedZone = normalizeZoneName(zone);
    return this.waterMeters.filter(meter => 
      normalizeZoneName(meter.Zone) === normalizedZone
    );
  }

  // Debug method to check zone bulk meters
  debugZoneBulkMeters(): void {
    console.log('=== Zone Bulk Meters Debug ===');
    const zones = this.getAllZones();
    zones.forEach(zone => {
      const meters = this.getMetersByZone(zone);
      const bulkMeters = meters.filter(m => 
        m.Type === 'Zone Bulk' || 
        m.Label === 'L2 - Zone Bulk' ||
        m['Meter Label']?.toLowerCase().includes('bulk')
      );
      console.log(`Zone: ${zone}`);
      console.log(`Total meters: ${meters.length}`);
      console.log(`Bulk meters found: ${bulkMeters.length}`);
      bulkMeters.forEach(m => {
        console.log(`  - ${m['Meter Label']} (Type: ${m.Type}, Label: ${m.Label})`);
      });
    });
  }
}

// Create singleton instance
export const waterDataService = new WaterDataService();