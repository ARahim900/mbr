import { waterMeters, getZoneAnalysisData, getAllZones } from './waterDatabase';
import { zoneDataWrapper } from './zoneDataWrapper';

/**
 * Debugging utilities for Zone 03(A) and 03(B) data issues
 */
export class ZoneDebugger {
  /**
   * Run comprehensive diagnostics for specific zones
   */
  async runZoneDiagnostics(zoneIds: string[]): Promise<{
    timestamp: string;
    zones: Map<string, {
      exists: boolean;
      hasData: boolean;
      meterCount: number;
      hasBulkMeter: boolean;
      hasRetailMeters: boolean;
      dataCompleteness: number;
      issues: string[];
    }>;
  }> {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      zones: new Map()
    };

    for (const zoneId of zoneIds) {
      const issues: string[] = [];
      const zoneMeters = waterMeters.filter(m => m.Zone === zoneId);
      const exists = zoneMeters.length > 0;
      
      if (!exists) {
        issues.push(`Zone ${zoneId} does not exist in the database`);
      }

      const bulkMeter = zoneMeters.find(m => m.Type === 'Zone Bulk');
      const retailMeters = zoneMeters.filter(m => m.Type === 'Retail');

      if (exists && !bulkMeter) {
        issues.push('No bulk meter found');
      }

      if (exists && retailMeters.length === 0) {
        issues.push('No retail meters found');
      }

      // Check data completeness
      let totalFields = 0;
      let filledFields = 0;
      const months = ['Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25'];
      
      zoneMeters.forEach(meter => {
        months.forEach(month => {
          totalFields++;
          if (meter[month as keyof typeof meter] !== '' && 
              meter[month as keyof typeof meter] !== null && 
              meter[month as keyof typeof meter] !== undefined) {
            filledFields++;
          }
        });
      });

      const dataCompleteness = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;

      diagnostics.zones.set(zoneId, {
        exists,
        hasData: zoneMeters.length > 0,
        meterCount: zoneMeters.length,
        hasBulkMeter: !!bulkMeter,
        hasRetailMeters: retailMeters.length > 0,
        dataCompleteness,
        issues
      });
    }

    return diagnostics;
  }

  /**
   * Check connectivity for specific zones
   */
  checkZoneConnectivity(zoneId: string): {
    connected: boolean;
    lastUpdate: string | null;
    dataPoints: number;
  } {
    const zoneMeters = waterMeters.filter(m => m.Zone === zoneId);
    
    if (zoneMeters.length === 0) {
      return {
        connected: false,
        lastUpdate: null,
        dataPoints: 0
      };
    }

    // Find the most recent data point
    const months = ['May-25', 'Apr-25', 'Mar-25', 'Feb-25', 'Jan-25'];
    let lastUpdate = null;
    let dataPoints = 0;

    for (const month of months) {
      const hasData = zoneMeters.some(meter => 
        meter[month as keyof typeof meter] !== '' && 
        meter[month as keyof typeof meter] !== null
      );
      
      if (hasData) {
        if (!lastUpdate) lastUpdate = month;
        dataPoints++;
      }
    }

    return {
      connected: dataPoints > 0,
      lastUpdate,
      dataPoints
    };
  }

  /**
   * Compare expected vs actual zone data
   */
  compareZoneData(zoneId: string, month: string): {
    expected: {
      zoneBulk: number;
      individualSum: number;
    };
    actual: {
      zoneBulk: number;
      individualSum: number;
    };
    discrepancy: number;
    discrepancyPercentage: number;
  } {
    const data = getZoneAnalysisData(zoneId, month);
    
    // Expected values (from bulk meter)
    const expected = {
      zoneBulk: data.zoneBulkConsumption,
      individualSum: data.zoneBulkConsumption // Expected to match
    };

    // Actual values
    const actual = {
      zoneBulk: data.zoneBulkConsumption,
      individualSum: data.sumOfIndividualMeters
    };

    const discrepancy = expected.individualSum - actual.individualSum;
    const discrepancyPercentage = expected.zoneBulk > 0 
      ? (discrepancy / expected.zoneBulk) * 100 
      : 0;

    return {
      expected,
      actual,
      discrepancy,
      discrepancyPercentage
    };
  }

  /**
   * Generate detailed debug report
   */
  async generateDebugReport(): Promise<string> {
    let report = `Zone Analysis Debug Report\n`;
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `${'='.repeat(50)}\n\n`;

    // Check zones 03(A) and 03(B) specifically
    const targetZones = ['Zone 03(A)', 'Zone 03(B)'];
    const diagnostics = await this.runZoneDiagnostics(targetZones);

    report += `ZONE DIAGNOSTICS:\n`;
    report += `-----------------\n`;

    diagnostics.zones.forEach((data, zone) => {
      report += `\n${zone}:\n`;
      report += `  Exists: ${data.exists ? 'YES' : 'NO'}\n`;
      report += `  Has Data: ${data.hasData ? 'YES' : 'NO'}\n`;
      report += `  Meter Count: ${data.meterCount}\n`;
      report += `  Has Bulk Meter: ${data.hasBulkMeter ? 'YES' : 'NO'}\n`;
      report += `  Has Retail Meters: ${data.hasRetailMeters ? 'YES' : 'NO'}\n`;
      report += `  Data Completeness: ${data.dataCompleteness.toFixed(1)}%\n`;
      
      if (data.issues.length > 0) {
        report += `  Issues:\n`;
        data.issues.forEach(issue => {
          report += `    - ${issue}\n`;
        });
      }
    });

    // Check connectivity
    report += `\n\nCONNECTIVITY STATUS:\n`;
    report += `--------------------\n`;

    targetZones.forEach(zone => {
      const connectivity = this.checkZoneConnectivity(zone);
      report += `\n${zone}:\n`;
      report += `  Connected: ${connectivity.connected ? 'YES' : 'NO'}\n`;
      report += `  Last Update: ${connectivity.lastUpdate || 'Never'}\n`;
      report += `  Data Points: ${connectivity.dataPoints}\n`;
    });

    // Data comparison
    report += `\n\nDATA VALIDATION:\n`;
    report += `----------------\n`;

    const months = ['Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25'];
    targetZones.forEach(zone => {
      report += `\n${zone}:\n`;
      months.forEach(month => {
        const comparison = this.compareZoneData(zone, month);
        if (comparison.expected.zoneBulk > 0 || comparison.actual.individualSum > 0) {
          report += `  ${month}:\n`;
          report += `    Bulk Meter: ${comparison.expected.zoneBulk}\n`;
          report += `    Individual Sum: ${comparison.actual.individualSum}\n`;
          report += `    Loss: ${comparison.discrepancy} (${comparison.discrepancyPercentage.toFixed(1)}%)\n`;
        }
      });
    });

    // Summary from wrapper
    report += `\n\n${zoneDataWrapper.getZoneSummaryReport('May-25')}`;

    return report;
  }

  /**
   * Quick check for zones 03(A) and 03(B)
   */
  quickCheck(): void {
    // console.log('Quick Check for Zones 03(A) and 03(B)');
    // console.log('=====================================');
    
    const zones = ['Zone 03(A)', 'Zone 03(B)'];
    
    zones.forEach(zone => {
      const meters = waterMeters.filter(m => m.Zone === zone);
      // console.log(`\n${zone}:`);
      // console.log(`  Total Meters: ${meters.length}`);
      
      if (meters.length > 0) {
        meters.forEach(meter => {
          // console.log(`  - ${meter["Meter Label"]} (${meter.Type})`);
        });
      } else {
        // console.log('  ⚠️  NO METERS FOUND!');
      }
    });

    // console.log('\nAll Zones in Database:', getAllZones());
  }
}

// Export singleton instance
export const zoneDebugger = new ZoneDebugger();

// Export convenience function for quick debugging
export async function debugZone03Issues(): Promise<void> {
  const report = await zoneDebugger.generateDebugReport();
  // console.log(report);
  return;
}