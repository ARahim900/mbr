// Type definitions for Firefighting & Alarm System Tracker

export interface PPMRecord {
  id: number;
  location: string;
  equipment: string;
  periods: PPMPeriod[];
}

export interface PPMPeriod {
  date: string; // Format: "Dec-24", "Apr-25", etc.
  status: PPMStatus;
  findings: string;
  findingsStatus: string;
}

export type PPMStatus = 'PPM Completed' | 'PPM Pending' | 'PPM In Progress';

export interface FirefightingStats {
  totalLocations: number;
  completedPPMs: number;
  pendingPPMs: number;
  findingsRequiringAction: number;
}

export interface PPMFinding {
  location: string;
  equipment: string;
  date: string;
  description: string;
  status: string;
}

export interface PPMSummary {
  period: string;
  completed: number;
  pending: number;
  inProgress: number;
  total: number;
}
