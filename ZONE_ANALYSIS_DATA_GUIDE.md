# Zone Analysis Data Structure Guide

## Current Zone Data Issues and Required Information

### Overview
The Zone Analysis page requires complete data for each zone to calculate water loss and efficiency accurately. Currently, some zones have incomplete data which causes incorrect figures.

## Required Data Structure for Each Zone

### 1. Regular Zones (with individual meters only)
Example: Zone_FM, Zone_05, Zone_08, Zone_VS, Zone_SC

```typescript
{
  name: 'Zone Name',
  bulk: 'Zone Bulk Meter Label',      // e.g., 'ZONE FM ( BULK ZONE FM )'
  bulkAccount: 'Account Number',       // e.g., '4300346'
  individual: [
    {
      label: 'Meter Label',            // e.g., 'Building FM'
      account: 'Account Number',       // e.g., '4300296'
      type: 'Meter Type'              // e.g., 'MB_Common', 'Retail', 'Residential (Villa)'
    },
    // ... more individual meters
  ]
}
```

### 2. Zones with Building Bulk Meters
Example: Zone_03A, Zone_03B

```typescript
{
  name: 'Zone Name',
  bulk: 'Zone Bulk Meter Label',
  bulkAccount: 'Account Number',
  buildingBulkMeters: [
    {
      label: 'Building Bulk Meter Label',  // e.g., 'D-44 Building Bulk Meter'
      account: 'Account Number',           // e.g., '4300178'
      type: 'D_Building_Bulk'
    },
    // ... more building bulk meters
  ],
  villaMeters: [
    {
      label: 'Villa Label',               // e.g., 'Z3-42 (Villa)'
      account: 'Account Number',          // e.g., '4300002'
      type: 'Residential (Villa)'
    },
    // ... more villa meters
  ],
  otherMeters: [                          // Optional - for irrigation, etc.
    {
      label: 'Other Meter Label',
      account: 'Account Number',
      type: 'IRR_Services'
    }
  ]
}
```

### 3. Direct Connection (Special Case)
```typescript
{
  name: 'Direct Connection',
  bulk: null,                             // No bulk meter for direct connections
  bulkAccount: null,
  individual: [
    {
      label: 'Direct Connection Label',
      account: 'Account Number',
      type: 'Connection Type'
    },
    // ... more direct connections
  ]
}
```

## Data Required from You

To fix the Zone Analysis, please provide the following information for any zones showing incorrect data:

### For Each Zone:
1. **Zone Bulk Meter Information:**
   - Exact meter label as it appears in your system
   - Account number
   
2. **All Individual Meters in the Zone:**
   - Meter label
   - Account number  
   - Type (Residential Villa, Retail, MB_Common, IRR_Services, etc.)

3. **For Zones with Buildings (if applicable):**
   - Building bulk meter labels and account numbers
   - All apartment meters under each building
   - All standalone villas in the zone

### Example Format to Provide:

```
Zone: Zone_XX
Bulk Meter: "ZONE XX (Bulk Zone XX)" - Account: 4300XXX

Individual Meters:
1. "Building A" - Account: 4300XXX - Type: MB_Common
2. "Villa Z-XX" - Account: 4300XXX - Type: Residential (Villa)
3. "Shop XX" - Account: 4300XXX - Type: Retail

Building Bulk Meters (if applicable):
1. "D-XX Building Bulk Meter" - Account: 4300XXX
   - Apartments under this building:
     - "ZX-XX(1)" - Account: 4300XXX
     - "ZX-XX(2)" - Account: 4300XXX
```

## Current Zones in System:
1. Zone_FM (Zone 01 FM) ✓
2. Zone_05 (Zone 05) ✓
3. Zone_08 (Zone 08) ✓
4. Zone_VS (Village Square) ✓
5. Zone_SC (Sales Center) ✓
6. Zone_03A (Zone 03 A) - Has buildings ✓
7. Zone_03B (Zone 03 B) - Has buildings ✓
8. Direct_Connection ✓

## Questions to Answer:
1. Are there any other zones not listed above?
2. Are all meters listed for each zone complete?
3. Are the parent-child relationships correct (e.g., apartments under correct building bulk meters)?
4. Are there any meters that should be excluded from calculations?

Please provide this information so I can update the waterDatabase.ts file with the correct zone data structure.