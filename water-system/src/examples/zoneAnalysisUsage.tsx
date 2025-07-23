import { waterMeters, getZoneAnalysisData } from '../data/waterDatabase';
import { zoneDataWrapper } from '../data/zoneDataWrapper';
import { zoneDebugger } from '../data/zoneDebugger';

/**
 * Example usage of the zone analysis fixes
 * This shows how to use the new utilities in your components
 */

// Example 1: Display zones with complete data representation
export function displayAllZonesWithData(month: string) {
  // console.log('=== Displaying All Zones with Complete Data ===');
  
  const completeData = zoneDataWrapper.getCompleteZoneData(month);
  
  completeData.forEach((data, zone) => {
    // console.log(`\n${zone}:`);
    // console.log(`  Status: ${data.status}`);
    // console.log(`  Bulk Consumption: ${data.zoneBulkConsumption}`);
    // console.log(`  Individual Sum: ${data.sumOfIndividualMeters}`);
    // console.log(`  Distribution Loss: ${data.distributionLoss}`);
    // console.log(`  Efficiency: ${data.efficiency.toFixed(2)}%`);
  });
}

// Example 2: Check specific zones 03(A) and 03(B)
export function checkZone03Status() {
  // console.log('=== Checking Zones 03(A) and 03(B) ===');
  
  // Quick check
  zoneDebugger.quickCheck();
  
  // Detailed check
  const zones = ['Zone 03(A)', 'Zone 03(B)'];
  zones.forEach(zone => {
    const connectivity = zoneDebugger.checkZoneConnectivity(zone);
    // console.log(`\n${zone} Connectivity:`, connectivity);
    
    const data = getZoneAnalysisData(zone, 'May-25');
    // console.log(`${zone} Analysis:`, {
      hasBulkMeter: data.zoneBulkConsumption > 0,
      numberOfRetailMeters: data.meters.filter(m => m.Type === 'Retail').length,
      totalConsumption: data.zoneBulkConsumption
    });
  });
}

// Example 3: React component usage
export const ZoneAnalysisComponent = ({ month }: { month: string }) => {
  const [zoneData, setZoneData] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    async function loadZoneData() {
      try {
        // Get complete zone data
        const completeData = zoneDataWrapper.getCompleteZoneData(month);
        setZoneData(completeData);
        
        // Check for issues
        const issues = zoneDataWrapper.getIncompleteZones(month);
        if (issues.length > 0) {
          setErrors(issues.map(i => `${i.zone}: ${i.issue}`));
        }
        
        // Run diagnostics in development
        if (process.env.NODE_ENV === 'development') {
          const report = await zoneDebugger.generateDebugReport();
          // console.log('Debug Report:', report);
        }
      } catch (error) {
        console.error('Error loading zone data:', error);
        setErrors(['Failed to load zone data']);
      } finally {
        setLoading(false);
      }
    }

    loadZoneData();
  }, [month]);

  if (loading) return <div>Loading zone data...</div>;

  return (
    <div className="zone-analysis">
      {errors.length > 0 && (
        <div className="errors">
          <h3>Data Issues Detected:</h3>
          <ul>
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="zones-grid">
        {Array.from(zoneData.entries()).map(([zone, data]) => (
          <div key={zone} className={`zone-card ${data.status}`}>
            <h3>{zone}</h3>
            <div className="zone-metrics">
              <div>
                <span>Status:</span>
                <span className={`status-${data.status.toLowerCase()}`}>
                  {data.status}
                </span>
              </div>
              <div>
                <span>Bulk:</span>
                <span>{data.zoneBulkConsumption.toLocaleString()}</span>
              </div>
              <div>
                <span>Individual:</span>
                <span>{data.sumOfIndividualMeters.toLocaleString()}</span>
              </div>
              <div>
                <span>Loss:</span>
                <span className={data.distributionLoss > 0 ? 'loss' : 'no-loss'}>
                  {data.distributionLoss.toLocaleString()}
                </span>
              </div>
              <div>
                <span>Efficiency:</span>
                <span>{data.efficiency.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example 4: Validation before saving data
export async function validateBeforeSave(): Promise<boolean> {
  // console.log('=== Validating Zone Data ===');
  
  const requiredZones = [
    'Zone 01', 'Zone 02', 'Zone 03(A)', 'Zone 03(B)',
    'Zone 04', 'Zone 05', 'Sales Center', 'Direct Connection'
  ];
  
  const validation = zoneDataWrapper.validateZoneData(requiredZones);
  
  if (!validation.isValid) {
    console.error('Validation Failed:');
    console.error('Missing Zones:', validation.missingZones);
    console.error('Empty Data Zones:', validation.emptyDataZones);
    return false;
  }
  
  // console.log('✅ All zones validated successfully');
  return true;
}

// Example 5: Debug specific issues
export async function debugZone03Issues() {
  // console.log('=== Debugging Zone 03 Issues ===');
  
  // Run full diagnostics
  const report = await zoneDebugger.generateDebugReport();
  // console.log(report);
  
  // Check specific month data
  const months = ['Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25'];
  const zones = ['Zone 03(A)', 'Zone 03(B)'];
  
  zones.forEach(zone => {
    // console.log(`\n${zone} Monthly Data:`);
    months.forEach(month => {
      const comparison = zoneDebugger.compareZoneData(zone, month);
      if (comparison.expected.zoneBulk > 0) {
        // console.log(`  ${month}: Bulk=${comparison.actual.zoneBulk}, Loss=${comparison.discrepancy}`);
      }
    });
  });
}

// Export all examples
export const ZoneAnalysisExamples = {
  displayAllZonesWithData,
  checkZone03Status,
  validateBeforeSave,
  debugZone03Issues,
  ZoneAnalysisComponent
};