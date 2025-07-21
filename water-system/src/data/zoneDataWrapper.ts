import { WaterMeter, getZoneAnalysisData, waterMeters } from './waterDatabase';

/**
 * Data wrapper to ensure complete zone data representation
 * This handles missing zones and provides default data when needed
 */
export class ZoneDataWrapper {
  private requiredZones = [
    'Zone 01',
    'Zone 02', 
    'Zone 03(A)',
    'Zone 03(B)',
    'Zone 04',
    'Zone 05',
    'Sales Center',
    'Direct Connection'
  ];

  constructor(private data: WaterMeter[] = waterMeters) {}

  /**
   * Get complete zone data with all required zones
   * Missing zones will have default empty data
   */
  getCompleteZoneData(month: string): Map<string, {
    zoneBulkConsumption: number;
    sumOfIndividualMeters: number;
    distributionLoss: number;
    efficiency: number;
    meters: WaterMeter[];
    status: 'OK' | 'NO_DATA' | 'PARTIAL_DATA';
  }> {
    const completeData = new Map();

    for (const zone of this.requiredZones) {
      const zoneData = getZoneAnalysisData(zone, month);
      
      // Determine status
      let status: 'OK' | 'NO_DATA' | 'PARTIAL_DATA' = 'OK';
      if (zoneData.meters.length === 0) {
        status = 'NO_DATA';
      } else if (zoneData.zoneBulkConsumption === 0) {
        status = 'PARTIAL_DATA';
      }

      completeData.set(zone, {
        ...zoneData,
        status
      });
    }

    return completeData;
  }

  /**
   * Check for missing zones
   */
  getMissingZones(): string[] {
    const existingZones = new Set(this.data.map(meter => meter.Zone));
    return this.requiredZones.filter(zone => !existingZones.has(zone));
  }

  /**
   * Get zones with incomplete data
   */
  getIncompleteZones(month: string): {
    zone: string;
    issue: string;
  }[] {
    const issues: { zone: string; issue: string }[] = [];

    for (const zone of this.requiredZones) {
      const zoneMeters = this.data.filter(m => m.Zone === zone);
      
      if (zoneMeters.length === 0) {
        issues.push({ zone, issue: 'No meters found' });
        continue;
      }

      const bulkMeter = zoneMeters.find(m => m.Type === 'Zone Bulk');
      if (!bulkMeter && zone !== 'Direct Connection') {
        issues.push({ zone, issue: 'No bulk meter' });
      }

      const retailMeters = zoneMeters.filter(m => m.Type === 'Retail');
      if (retailMeters.length === 0 && zone !== 'Direct Connection') {
        issues.push({ zone, issue: 'No retail meters' });
      }

      // Check for missing monthly data
      zoneMeters.forEach(meter => {
        const monthValue = meter[month as keyof WaterMeter];
        if (monthValue === '' || monthValue === null || monthValue === undefined) {
          issues.push({ 
            zone, 
            issue: `Meter ${meter["Meter Label"]} has no data for ${month}` 
          });
        }
      });
    }

    return issues;
  }

  /**
   * Fill missing zone data with defaults
   */
  fillMissingZoneData(zone: string): WaterMeter[] {
    const defaultBulkMeter: WaterMeter = {
      "Meter Label": `${zone} Bulk (Missing)`,
      "Acct #": "0000000",
      "Zone": zone,
      "Type": "Zone Bulk",
      "Parent Meter": "",
      "Label": "L2 - Zone Bulk",
      "Jan-25": 0,
      "Feb-25": 0,
      "Mar-25": 0,
      "Apr-25": 0,
      "May-25": 0,
      "Jun-25": 0,
      "Jul-25": 0,
      "Aug-25": 0,
      "Sep-25": 0,
      "Oct-25": 0,
      "Nov-25": 0,
      "Dec-25": 0,
      "Total": 0
    };

    return [defaultBulkMeter];
  }

  /**
   * Get summary report of all zones
   */
  getZoneSummaryReport(month: string): string {
    const completeData = this.getCompleteZoneData(month);
    const missingZones = this.getMissingZones();
    const incompleteZones = this.getIncompleteZones(month);

    let report = `Zone Analysis Summary Report for ${month}\n`;
    report += `=======================================\n\n`;

    report += `Required Zones: ${this.requiredZones.length}\n`;
    report += `Missing Zones: ${missingZones.length}\n`;
    report += `Zones with Issues: ${incompleteZones.length}\n\n`;

    if (missingZones.length > 0) {
      report += `Missing Zones:\n`;
      missingZones.forEach(zone => {
        report += `  - ${zone}\n`;
      });
      report += `\n`;
    }

    if (incompleteZones.length > 0) {
      report += `Zones with Issues:\n`;
      incompleteZones.forEach(({ zone, issue }) => {
        report += `  - ${zone}: ${issue}\n`;
      });
      report += `\n`;
    }

    report += `Zone Data Summary:\n`;
    completeData.forEach((data, zone) => {
      report += `\n${zone}:\n`;
      report += `  Status: ${data.status}\n`;
      report += `  Bulk Consumption: ${data.zoneBulkConsumption}\n`;
      report += `  Individual Meters Sum: ${data.sumOfIndividualMeters}\n`;
      report += `  Distribution Loss: ${data.distributionLoss}\n`;
      report += `  Efficiency: ${data.efficiency.toFixed(2)}%\n`;
      report += `  Number of Meters: ${data.meters.length}\n`;
    });

    return report;
  }
}

// Export singleton instance
export const zoneDataWrapper = new ZoneDataWrapper();