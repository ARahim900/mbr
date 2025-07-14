import { PPMRecord } from '@/types/firefighting';

export const firefightingData: PPMRecord[] = [
  {
    id: 1,
    location: "Staff Accommodation Building 1,2,3,4",
    equipment: "Fire Alarm System, Fire Hose reel",
    periods: [
      {
        date: "Dec-24",
        status: "PPM Completed",
        findings: "1) Building 4: 12V, 7Ah Battery defective (2 nos)\n2) Building 1: 4.5Kg dcp fire extinguisher (1 no)\n3)Building 1: DF61002 panel defective (1no)\n4)Building 1: 1\" jet spray nozzle for fhr unit (1no)\n5)Building 3: 1\" jet spray nozzle for fhr unit (1no)\n6)Building 3: 4.5Kg DCP fire  extinguisher refilling",
        findingsStatus: "Quote sent for spares"
      },
      {
        date: "Apr-25",
        status: "PPM Completed",
        findings: "1) Building 4: 12V, 7Ah Battery defective (2 nos)\n2) Building 1: DF61002 panel defective (1no)\n3) Building 1: 1\" jet spray nozzle for fhr unit (1no)\n4) Building 3: 1\" jet spray nozzle for fhr unit (1no)",
        findingsStatus: "Quote sent for spares. Waiting for approval"
      },
      {
        date: "Jun-25",
        status: "PPM Completed",
        findings: "",
        findingsStatus: ""
      },
      {
        date: "Aug-25",
        status: "PPM Pending",
        findings: "",
        findingsStatus: ""
      }
    ]
  },
  {
    id: 2,
    location: "Staff Accommodation Building 5,6,7,8",
    equipment: "Fire Alarm System, Fire Hose reel",
    periods: [
      {
        date: "Dec-24",
        status: "PPM Completed",
        findings: "1) Building 6: 12V, 7Ah Battery defective\n\n2) Building 7: DF61002 Loop Fire Alarm Panel Defective\n\n3) Building 8: DF61002 Loop Fire Alarm Panel Defective",
        findingsStatus: "Quote sent for spares"
      },
      {
        date: "Apr-25",
        status: "PPM Completed",
        findings: "1) Building 6: 12V, 7Ah Battery defective\n2) Building 7: 2 Loop Fire Alarm Panel Defective\n3) Building 8: DF61002 Loop Fire Alarm Panel Defective",
        findingsStatus: "Quote sent for spares. Waiting for approval"
      },
      {
        date: "Jun-25",
        status: "PPM Completed",
        findings: "",
        findingsStatus: ""
      },
      {
        date: "Aug-25",
        status: "PPM Pending",
        findings: "",
        findingsStatus: ""
      }
    ]
  },
  {
    id: 3,
    location: "Security room & Nursery building, Security & Surveillance Control Room, Taxi building, ROP Building",
    equipment: "Fire Alarm System",
    periods: [
      {
        date: "Dec-24",
        status: "PPM Completed",
        findings: "1) ROP Building: 12v,7Ah battery defective",
        findingsStatus: "Quote sent for spares"
      },
      {
        date: "Apr-25",
        status: "PPM Completed",
        findings: "1) ROP Building: 12v,7Ah battery defective\n2) Taxi Building: DF61002 panel",
        findingsStatus: "Quote sent for spares. Waiting for approval"
      },
      {
        date: "Jun-25",
        status: "PPM Completed",
        findings: "",
        findingsStatus: ""
      },
      {
        date: "Aug-25",
        status: "PPM Pending",
        findings: "",
        findingsStatus: ""
      }
    ]
  },
  {
    id: 4,
    location: "Mechanical Equipment Room Zone 01, Zone 02, Zone 03",
    equipment: "Fire Alarm System, Fire Hose reel, Fire Pump",
    periods: [
      {
        date: "Dec-24",
        status: "PPM Completed",
        findings: "1) Zone 01: Fire extinguisher expired",
        findingsStatus: "Quote sent for spares"
      },
      {
        date: "Apr-25",
        status: "PPM Completed",
        findings: "1) Zone 01: Fire extinguisher expired\n2) Zone 03: 12V,7Ah battery defective",
        findingsStatus: "Quote sent for spares. Waiting for approval"
      },
      {
        date: "Jun-25",
        status: "PPM Completed",
        findings: "",
        findingsStatus: ""
      },
      {
        date: "Aug-25",
        status: "PPM Pending",
        findings: "",
        findingsStatus: ""
      }
    ]
  },
  {
    id: 5,
    location: "Sales office, M&E Store",
    equipment: "Fire Alarm System",
    periods: [
      {
        date: "Dec-24",
        status: "PPM Completed",
        findings: "",
        findingsStatus: ""
      },
      {
        date: "Apr-25",
        status: "PPM Completed",
        findings: "",
        findingsStatus: ""
      },
      {
        date: "Jun-25",
        status: "PPM Completed",
        findings: "",
        findingsStatus: ""
      },
      {
        date: "Aug-25",
        status: "PPM Pending",
        findings: "",
        findingsStatus: ""
      }
    ]
  },
  {
    id: 6,
    location: "Zone 01 Villa (1-5)",
    equipment: "Fire Alarm System, Fire Hose reel",
    periods: [
      {
        date: "Dec-24",
        status: "PPM Completed",
        findings: "1) Fire Alarm Panel Defective - 4 nos",
        findingsStatus: "Quote sent for spares"
      },
      {
        date: "Apr-25",
        status: "PPM Completed",
        findings: "1) Fire Alarm Panel Defective - 4 nos",
        findingsStatus: "Quote sent for spares. Waiting for approval"
      },
      {
        date: "Jun-25",
        status: "PPM Completed",
        findings: "",
        findingsStatus: ""
      },
      {
        date: "Aug-25",
        status: "PPM Pending",
        findings: "",
        findingsStatus: ""
      }
    ]
  },
  {
    id: 7,
    location: "Zone 01 Villa (6-16)",
    equipment: "Fire Alarm System, Fire Hose reel",
    periods: [
      {
        date: "Dec-24",
        status: "PPM Completed",
        findings: "1) Fire Alarm Panel Defective - 6 nos",
        findingsStatus: "Quote sent for spares"
      },
      {
        date: "Apr-25",
        status: "PPM Completed",
        findings: "1) Fire Alarm Panel Defective - 6 nos",
        findingsStatus: "Quote sent for spares. Waiting for approval"
      },
      {
        date: "Jun-25",
        status: "PPM Completed",
        findings: "",
        findingsStatus: ""
      },
      {
        date: "Aug-25",
        status: "PPM Pending",
        findings: "",
        findingsStatus: ""
      }
    ]
  },
  {
    id: 8,
    location: "Zone 01 Villa (17-23)",
    equipment: "Fire Alarm System, Fire Hose reel",
    periods: [
      {
        date: "Dec-24",
        status: "PPM Completed",
        findings: "1) Fire Alarm Panel Defective - 4 nos",
        findingsStatus: "Quote sent for spares"
      },
      {
        date: "Apr-25",
        status: "PPM Completed",
        findings: "1) Fire Alarm Panel Defective - 4 nos",
        findingsStatus: "Quote sent for spares. Waiting for approval"
      },
      {
        date: "Jun-25",
        status: "PPM Completed",
        findings: "",
        findingsStatus: ""
      },
      {
        date: "Aug-25",
        status: "PPM Pending",
        findings: "",
        findingsStatus: ""
      }
    ]
  }
];
