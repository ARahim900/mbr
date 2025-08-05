// Data validation utilities to prevent visualization failures

import { WaterDataEntry } from '../types';

/**
 * Validates water system data integrity
 */
export const validateWaterData = (data: WaterDataEntry[]): {
  isValid: boolean;
  errors: string[];
  safeData: WaterDataEntry[];
} => {
  const errors: string[] = [];
  let safeData: WaterDataEntry[] = [];

  try {
    if (!Array.isArray(data)) {
      errors.push('Water data is not an array');
      return { isValid: false, errors, safeData: [] };
    }

    if (data.length === 0) {
      errors.push('Water data array is empty');
      return { isValid: false, errors, safeData: [] };
    }

    // Validate each entry
    safeData = data.filter((entry, index) => {
      if (!entry) {
        errors.push(`Entry at index ${index} is null or undefined`);
        return false;
      }

      if (!entry.consumption || typeof entry.consumption !== 'object') {
        errors.push(`Entry at index ${index} has invalid consumption data`);
        return false;
      }

      // Ensure all consumption values are numbers
      const validConsumption: { [key: string]: number } = {};
      Object.entries(entry.consumption).forEach(([month, value]) => {
        const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
        validConsumption[month] = numValue;
      });

      return {
        ...entry,
        consumption: validConsumption,
        totalConsumption: Object.values(validConsumption).reduce((sum, val) => sum + val, 0)
      };
    });

    return {
      isValid: errors.length === 0,
      errors,
      safeData
    };
  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { isValid: false, errors, safeData: [] };
  }
};

/**
 * Validates month availability and provides safe fallbacks
 */
export const validateMonthsAvailable = (months: string[]): {
  isValid: boolean;
  safeMonths: string[];
  errors: string[];
} => {
  const errors: string[] = [];
  const fallbackMonths = ['Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25', 'Jun-25', 'Jul-25'];

  try {
    if (!Array.isArray(months)) {
      errors.push('Months is not an array');
      return { isValid: false, safeMonths: fallbackMonths, errors };
    }

    if (months.length === 0) {
      errors.push('Months array is empty');
      return { isValid: false, safeMonths: fallbackMonths, errors };
    }

    // Filter out invalid months
    const validMonths = months.filter(month => 
      typeof month === 'string' && month.trim().length > 0
    );

    if (validMonths.length === 0) {
      errors.push('No valid months found');
      return { isValid: false, safeMonths: fallbackMonths, errors };
    }

    return {
      isValid: errors.length === 0,
      safeMonths: validMonths,
      errors
    };
  } catch (error) {
    errors.push(`Month validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { isValid: false, safeMonths: fallbackMonths, errors };
  }
};

/**
 * Safely gets a value from water data with fallback
 */
export const safeGetWaterValue = (
  data: WaterDataEntry[],
  finder: (entry: WaterDataEntry) => boolean,
  month: string,
  fallback: number = 0
): number => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      return fallback;
    }

    const entry = data.find(finder);
    if (!entry || !entry.consumption) {
      return fallback;
    }

    const value = entry.consumption[month];
    return typeof value === 'number' && !isNaN(value) ? value : fallback;
  } catch (error) {
    console.warn('Error getting water value:', error);
    return fallback;
  }
};

/**
 * Validates chart data before rendering
 */
export const validateChartData = (data: any[]): {
  isValid: boolean;
  safeData: any[];
  errors: string[];
} => {
  const errors: string[] = [];

  try {
    if (!Array.isArray(data)) {
      errors.push('Chart data is not an array');
      return { isValid: false, safeData: [], errors };
    }

    if (data.length === 0) {
      errors.push('Chart data array is empty');
      return { isValid: false, safeData: [], errors };
    }

    // Filter out invalid entries and ensure numeric values
    const safeData = data.filter((item, index) => {
      if (!item || typeof item !== 'object') {
        errors.push(`Chart data item at index ${index} is invalid`);
        return false;
      }

      // Convert numeric values to ensure they're valid
      Object.keys(item).forEach(key => {
        if (key !== 'name' && key !== 'fill' && key !== 'color') {
          const value = item[key];
          if (typeof value === 'string' && !isNaN(parseFloat(value))) {
            item[key] = parseFloat(value);
          } else if (typeof value !== 'number' || isNaN(value)) {
            item[key] = 0;
          }
        }
      });

      return true;
    });

    return {
      isValid: errors.length === 0,
      safeData,
      errors
    };
  } catch (error) {
    errors.push(`Chart validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { isValid: false, safeData: [], errors };
  }
};

/**
 * Creates a safe fallback for missing or corrupted data
 */
export const createFallbackData = (months: string[]) => {
  return months.map(month => ({
    name: month,
    'L1 - Main Source': 0,
    'L2 - Zone Bulk Meters': 0,
    'L3 - Building/Villa Meters': 0,
    'Total Loss': 0
  }));
};