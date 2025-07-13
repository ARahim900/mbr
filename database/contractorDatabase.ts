import { Contractor } from '../types';

const rawContractorData = `Contractor	Service Provided	Status	Contract Type	Start Date	End Date	Contract (OMR)/Month	Contract Total (OMR)/Year	Note
KONE Assarain LLC	Lift Maintenance Services	Active	Contract	1/1/2025	12/31/2025	525 OMR	11550 OMR (Excl VAT)	
Oman Water Treatment Company (OWATCO)	Comprehensive STP Operation and Maintenance	Active	Contract	1/26/2024	1/25/2029	3,103.8 OMR	37,245.4 OMR (Inc VAT)	New contract due to early termination of previous Contract with Celar Company
Kalhat	Facility Management (FM)	Active	Contract	5/7/2024	5/6/2030	32,200.8 OMR	386,409.718 OMR (Inc VAT)	New contract overlapping with COMO
Future Cities S.A.O.C (Tadoom)	SUPPLY AND INSTALLATION OF SMART WATER METERS, BILLING FOR WATER CONSUMPTION	Active	Contract	9/24/2024	9/23/2032	2.7 Per Meter Collection	184.3 OMR	New contract replacing OIFC
Muna Noor International LLC	Pest Control Services	Active	Contract	7/1/2024	6/30/2026	1,400 /Month Inc VAT	16,000 OMR (Inc VAT)	
Celar Water	Comprehensive STP Operation and Maintenance	Expired	Contract	1/16/2021	1/15/2025	4,439 /Month		Transitioned to OWATCO before contract end
Gulf Expert	Chillers, BMS & Pressurisation Units	Active	Contract	6/3/2025	6/2/2026	603	7,234.500	
Advanced Technology and Projects Company	BMS Non-Comprehensive Annual Maintenance	Expired	PO	3/26/2023	3/25/2024	3,800 /Year		
Al Naba Services LLC	Garbage Removal Services	Expired	Contract	4/2/2023	4/1/2024	32 /Skip Trip		
Bahwan Engineering Company LLC	Maintenance of Fire Alarm & Fire Fighting Equipment	Active	Contract	11/1/2024	10/31/2025	743.8	8,925 OMR (Inc VAT)	
Oman Pumps Manufacturing Co.	Supply, Installation, and Commissioning of Pumps	Expired	Contract	2/23/2020	7/22/2025	37,800 on Delivery		
Rimal Global	Provision of Services	Expired	Contract	11/22/2021	11/21/2031	51,633 on Delivery		
COMO	Facility Management (FM)	Expired	Contract	3/1/2022	2/28/2025	44,382 /Month		Transitioned to Kalhat before contract end
Muscat Electronics LLC	Daikin AC Chillers (Sale Center) Maintenance Services	Expired	Contract	3/26/2023	4/25/2024	199.5 /Service Quarter		Nearing expiration, review for renewal needed
Uni Gaz	Gas Refilling for Flame Operation at Muscat Bay Main Entrance	Expired	PO				
Genetcoo	York AC Chillers (Zone 01) Maintenance Services	Expired	Contract				
Gulf Expert	BMS AMC FM & Staff Accommodation	Active	Contract	6/3/2025	6/2/2026	2,205.00		
National Marine Services LLC	Diving services	Active	PO	11/6/2024	11/5/2026	4,757.76		
Muscat Electronics LLC	Daikin AC at sale center	Active	PO	6/3/2025	6/2/2026	871.82		
Iron mountain ARAMEX	Offsite record storage	Active	Contract	1/1/2025	12/31/2025	Schedule of rates		
`;

const parseDate = (dateStr: string): Date | null => {
    if (!dateStr || dateStr.trim() === '') return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    // MM/DD/YYYY format from image
    const [month, day, year] = parts.map(p => parseInt(p, 10));
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
};

const parseNumericValue = (valueStr: string): number | null => {
    if (!valueStr) return null;
    const cleanedStr = valueStr.replace(/,/g, '').trim();
    const match = cleanedStr.match(/^[\d.]+/);
    return match ? parseFloat(match[0]) : null;
};

export const parseContractorData = (data: string): Contractor[] => {
    const lines = data.trim().split('\n').slice(1);
    
    return lines.map((line, index) => {
        const values = line.split('\t');
        
        const status = values[2] as 'Active' | 'Expired';
        let contractType: 'Contract' | 'PO' | 'N/A' = 'N/A';
        if(values[3] === 'Contract' || values[3] === 'PO'){
            contractType = values[3];
        }

        const totalOMRYear = values[7]?.trim() || '';

        return {
            id: `${values[0]}-${index}`,
            contractor: values[0]?.trim() || 'N/A',
            serviceProvided: values[1]?.trim() || 'N/A',
            status: status || 'Expired',
            contractType: contractType,
            startDate: parseDate(values[4]),
            endDate: parseDate(values[5]),
            contractOMRMonth: values[6]?.trim() || 'N/A',
            contractTotalOMRYear: totalOMRYear,
            note: values[8]?.trim() || '',
            numericTotalOMRYear: parseNumericValue(totalOMRYear)
        };
    });
};

export const contractorData = parseContractorData(rawContractorData);

export const getContractStats = (contracts: Contractor[]) => {
    const total = contracts.length;
    const active = contracts.filter(c => c.status === 'Active').length;
    const expired = contracts.filter(c => c.status === 'Expired').length;
    
    const totalAnnualValue = contracts.reduce((sum, c) => {
        if (c.numericTotalOMRYear !== null) {
            return sum + c.numericTotalOMRYear;
        }
        return sum;
    }, 0);

    return {
        total,
        active,
        expired,
        totalAnnualValue
    };
};
