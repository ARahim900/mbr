import Papa from 'papaparse';
import { WaterMeter } from '../data/waterDatabase';

export function parseWaterConsumptionCSV(csvContent: string): WaterMeter[] {
  const result = Papa.parse<WaterMeter>(csvContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => {
      if (typeof value === 'string') {
        return value.trim();
      }
      return value;
    }
  });

  if (result.errors.length > 0) {
    console.error('CSV parsing errors:', result.errors);
  }

  return result.data;
}

export function processWaterMeters(meters: WaterMeter[]): WaterMeter[] {
  // Clean and process the data
  return meters.map(meter => {
    // Ensure numeric values for consumption columns
    const processedMeter = { ...meter };
    const monthColumns = [
      'Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25',
      'Jun-25', 'Jul-25', 'Aug-25', 'Sep-25', 'Oct-25', 'Nov-25', 'Dec-25'
    ];

    monthColumns.forEach(month => {
      const value = processedMeter[month as keyof WaterMeter];
      if (value === '' || value === null || value === undefined) {
        processedMeter[month as keyof WaterMeter] = 0;
      } else if (typeof value === 'string') {
        const numValue = parseFloat(value.replace(/,/g, ''));
        processedMeter[month as keyof WaterMeter] = isNaN(numValue) ? 0 : numValue;
      }
    });

    // Process Total
    if (typeof processedMeter.Total === 'string') {
      processedMeter.Total = parseFloat(processedMeter.Total.toString().replace(/,/g, '')) || 0;
    }

    return processedMeter;
  });
}

export async function loadWaterConsumptionData(file: File): Promise<WaterMeter[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvContent = event.target?.result as string;
        const meters = parseWaterConsumptionCSV(csvContent);
        const processedMeters = processWaterMeters(meters);
        resolve(processedMeters);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}