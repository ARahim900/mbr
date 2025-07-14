# Firefighting & Alarm System Tracker

This feature adds a comprehensive Firefighting & Alarm System PPM (Planned Preventive Maintenance) tracker to the MBR application.

## Features

### 1. Dashboard Overview
- **Statistics Cards**: Display total locations, completed PPMs, pending PPMs, and findings requiring action
- **Visual Charts**: 
  - Line chart showing PPM status trends over time
  - Pie chart displaying current status distribution
  - Equipment distribution overview

### 2. PPM Tracker
- **Searchable Table**: View all locations with their PPM status across different periods
- **Status Badges**: Visual indicators for PPM completion status
- **Period Filtering**: Filter data by specific maintenance periods
- **Location Filtering**: Filter by location type (Zone, Staff Accommodation, Villa, etc.)

### 3. Findings Report
- **Active Issues List**: View all equipment findings requiring attention
- **Status Tracking**: Track quotes and approval status for spare parts
- **Quick Actions**: Update status buttons for each finding

### 4. Equipment Overview
- **Equipment Distribution**: See how different equipment types are distributed across locations
- **Visual Representation**: Clean cards showing equipment counts

## File Structure

```
src/
├── types/
│   └── firefighting.ts          # TypeScript interfaces and types
├── data/
│   └── firefightingData.ts      # Sample data
├── components/
│   └── firefighting/
│       └── FirefightingTracker.tsx  # Main component
├── utils/
│   └── firefightingDataProcessor.ts # Excel data processing utilities
└── app/
    └── firefighting/
        └── page.tsx             # Page component
```

## Data Format

The tracker expects data in the following format:

```typescript
interface PPMRecord {
  id: number;
  location: string;
  equipment: string;
  periods: PPMPeriod[];
}

interface PPMPeriod {
  date: string;        // Format: "Dec-24", "Apr-25", etc.
  status: PPMStatus;
  findings: string;
  findingsStatus: string;
}
```

## Excel Import

The `firefightingDataProcessor.ts` utility provides functions to transform Excel data into the required format:

```typescript
import { transformExcelData } from '@/utils/firefightingDataProcessor';

// Convert Excel data to PPMRecord format
const records = transformExcelData(excelData);
```

## Integration

1. **Navigation**: Add a link to `/firefighting` in your main navigation
2. **Data Source**: Replace the sample data in `firefightingData.ts` with actual data from your database or Excel import
3. **Styling**: The component uses your existing UI components and color scheme to maintain consistency

## Customization

### Adding New Equipment Types
Update the equipment array in the Equipment Overview tab:

```typescript
['Fire Alarm System', 'Fire Hose reel', 'Fire Pump', 'Fire Extinguisher', 'Your New Equipment']
```

### Modifying Status Colors
Edit the `COLORS` object in `FirefightingTracker.tsx`:

```typescript
const COLORS = {
  completed: '#10b981',  // Green
  pending: '#f59e0b',    // Yellow
  inProgress: '#3b82f6', // Blue
  // Add your custom colors
};
```

### Adding New Periods
The system automatically detects periods from your data. Simply add new period data to your records.

## Future Enhancements

1. **Database Integration**: Connect to a real-time database for live updates
2. **Export Functionality**: Add ability to export reports to Excel/PDF
3. **Email Notifications**: Alert stakeholders about pending maintenance
4. **Photo Attachments**: Add capability to attach photos to findings
5. **Approval Workflow**: Implement approval process for spare parts quotes

## Usage

Navigate to `/firefighting` in your application to access the tracker. Use the filters and search functionality to find specific information quickly.
