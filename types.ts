// Types for 4-level hierarchy
export interface WaterDataEntry {
  id: number;
  meterLabel: string;
  acctNo: string;
  zone: string;
  type: string;
  parentMeter: string;
  label: string;
  consumption: { [month: string]: number };
  totalConsumption: number;
}

export interface MonthlyConsumption {
    month: string;
    consumption: number;
}

export interface MeterReading {
    meterLabel: string;
    accountNumber: string;
    id: string;
    zone: string;
    type: string;
    parentMeter: string;
    label:string;
    monthlyConsumption: MonthlyConsumption[];
    totalConsumption: number;
    children: MeterReading[];
    waterLoss: number;
}

export interface ProcessedData {
    tree: MeterReading[];
    stats: {
        totalConsumption: number;
        totalWaterLoss: number;
        topConsumer: MeterReading | null;
        meterCount: number;
    };
    chartData: any[];
    months: string[];
}

export interface ElectricityDataEntry {
  id: string;
  name: string;
  type: string;
  accountNumber: string;
  consumption: { [month: string]: number };
  totalConsumption: number;
}

// STP Plant Types
export interface StpDataEntry {
  id: string;
  date: Date;
  tankerCount: number;
  expectedTankerVolume: number;
  directInlineSewage: number;
  totalInletSewage: number;
  totalTreatedWater: number;
  tseOutput: number;
  income: number;
  savings: number;
  totalSavingsAndIncome: number;
}

export interface MonthlyStpData {
  month: string; // e.g., "July 2024"
  monthKey: string; // e.g., "2024-07"
  totalTreatedWater: number;
  tseOutput: number;
  totalInletSewage: number;
  tankerCount: number;
  income: number;
  savings: number;
  totalSavingsAndIncome: number;
}

// Contractor Tracker Types
export interface Contractor {
    id: string;
    contractor: string;
    serviceProvided: string;
    status: 'Active' | 'Expired';
    contractType: 'Contract' | 'PO' | 'N/A';
    startDate: Date | null;
    endDate: Date | null;
    contractOMRMonth: string;
    contractTotalOMRYear: string;
    note: string;
    numericTotalOMRYear: number | null;
}

// HVAC System Types
export interface HvacEntry {
    id: string;
    building: string;
    mainSystem: string;
    equipment: string;
    ppm1Findings: string;
    ppm2Findings: string;
    ppm3Findings: string;
    ppm4Findings: string;
    commonIssues: string;
    fixedIssues: string;
    notes: string;
}

