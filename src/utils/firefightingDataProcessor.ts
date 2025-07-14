import { PPMRecord, PPMPeriod } from '@/types/firefighting';

/**
 * Transforms Excel data into PPMRecord format
 * @param excelData - Raw data from Excel file
 * @returns Array of PPMRecord objects
 */
export function transformExcelData(excelData: any[]): PPMRecord[] {
  if (!excelData || excelData.length === 0) return [];

  // Skip header rows and process data
  const records: PPMRecord[] = [];
  
  excelData.forEach((row, index) => {
    // Skip if row doesn't have required data
    if (!row['Sl.No'] || !row['Location'] || !row['Equipment\'s name']) return;
    
    const periods: PPMPeriod[] = [];
    
    // Extract period data from columns
    const periodColumns = [
      { date: 'Dec-24', statusCol: 'PPM Status', findingsCol: 'PPM Findings', findingsStatusCol: 'PPM Findings status' },
      { date: 'Apr-25', statusCol: 'PPM Status.1', findingsCol: 'PPM Findings.1', findingsStatusCol: 'PPM Findings status.1' },
      { date: 'Jun-25', statusCol: 'PPM Status.2', findingsCol: 'PPM Findings.2', findingsStatusCol: 'PPM Findings status.2' },
      { date: 'Aug-25', statusCol: 'PPM Status.3', findingsCol: 'PPM Findings.3', findingsStatusCol: 'PPM Findings status.3' }
    ];
    
    periodColumns.forEach(period => {
      const status = row[period.statusCol] || 'PPM Pending';
      const findings = row[period.findingsCol] || '';
      const findingsStatus = row[period.findingsStatusCol] || '';
      
      periods.push({
        date: period.date,
        status: status as any,
        findings: findings.toString(),
        findingsStatus: findingsStatus.toString()
      });
    });
    
    records.push({
      id: parseInt(row['Sl.No']) || index + 1,
      location: row['Location'] || '',
      equipment: row['Equipment\'s name'] || '',
      periods
    });
  });
  
  return records;
}

/**
 * Extracts unique equipment types from PPM records
 * @param records - Array of PPMRecord objects
 * @returns Array of unique equipment types
 */
export function getUniqueEquipment(records: PPMRecord[]): string[] {
  const equipmentSet = new Set<string>();
  
  records.forEach(record => {
    // Split equipment by comma and add each item
    const items = record.equipment.split(',').map(item => item.trim());
    items.forEach(item => equipmentSet.add(item));
  });
  
  return Array.from(equipmentSet).sort();
}

/**
 * Calculates completion percentage for a given period
 * @param records - Array of PPMRecord objects
 * @param period - Period to calculate for (e.g., 'Dec-24')
 * @returns Completion percentage
 */
export function calculateCompletionRate(records: PPMRecord[], period: string): number {
  const periodData = records.map(record => 
    record.periods.find(p => p.date === period)
  ).filter(Boolean);
  
  if (periodData.length === 0) return 0;
  
  const completed = periodData.filter(p => p?.status === 'PPM Completed').length;
  return Math.round((completed / periodData.length) * 100);
}

/**
 * Groups findings by status
 * @param records - Array of PPMRecord objects
 * @returns Object with findings grouped by status
 */
export function groupFindingsByStatus(records: PPMRecord[]): Record<string, any[]> {
  const grouped: Record<string, any[]> = {
    'Quote sent for spares': [],
    'Quote sent for spares. Waiting for approval': [],
    'Other': []
  };
  
  records.forEach(record => {
    record.periods.forEach(period => {
      if (period.findings) {
        const finding = {
          location: record.location,
          equipment: record.equipment,
          date: period.date,
          findings: period.findings,
          status: period.findingsStatus
        };
        
        if (grouped[period.findingsStatus]) {
          grouped[period.findingsStatus].push(finding);
        } else {
          grouped['Other'].push(finding);
        }
      }
    });
  });
  
  return grouped;
}
