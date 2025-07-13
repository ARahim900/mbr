import { ElectricityDataEntry } from '../types';

const rawElectricityData = `Name	Type	Meter Account No.	Apr-24	May-24	Jun-24	Jul-24	Aug-24	Sep-24	Oct-24	Nov-24	Dec-24	Jan-25	Feb-25	Mar-25	Apr-25	May-25	Jun-25
Beachwell	D_Building	R51903	16908	46	19332	23170	42241	15223	25370	24383	37236	38168	18422	40	27749	46800	
Helipad	D_Building	R52334	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
Central Park	D_Building	R54672	12208	21845	29438	28186	21995	20202	14900	9604	19032	22819	19974	14190	13846	32135	
Guard House	D_Building	R53651	823	1489	1574	1586	1325	1391	1205	1225	814	798	936	879	1467	2249	
Security Building	D_Building	R53649	3529	3898	4255	4359	3728	3676	3140	5702	5131	5559	5417	4504	5978	8519	
ROP Building	D_Building	R53648	2047	4442	3057	4321	4185	3554	3692	3581	2352	2090	2246	1939	3537	4868	
D Building 44	D_Building	R53705	463	2416	2036	2120	1645	1717	1643	1377	764	647	657	650	1306	3598	
D Building 45	D_Building	R53665	709	2944	1267	262	3212	1330	1570	1252	841	670	556	608	1069	2840	
D Building 46	D_Building	R53700	818	2392	1620	2216	1671	1718	1734	1577	890	724	690	752	1292	2517	
D Building 47	D_Building	R53690	918	2678	1446	2173	2068	2073	1651	1774	1055	887	738	792	1545	2864	
D Building 48	D_Building	R53666	725	1970	1415	1895	1853	1084	1127	1046	785	826	676	683	1092	1927	
D Building 49	D_Building	R53715	947	2912	780	1911	1714	1839	1785	1608	1068	860	837	818	984	2986	
D Building 50	D_Building	R53672	577	1253	849	1097	1059	1091	1107	1102	789	765	785	707	1331	3556	
D Building 51	D_Building	R53657	735	3030	1677	2046	2472	2285	2165	1855	710	661	682	642	904	2235	
D Building 52	D_Building	R53699	727	2882	2087	2897	2786	2990	2501	1986	1208	979	896	952	1651	3662	
D Building 53	D_Building	R54782	714	2699	1405	1845	1494	1709	1525	1764	968	693	732	760	1281	1411	
D Building 54	D_Building	R54793	717	2904	1961	2449	3031	1453	1261	1777	834	681	559	531	1042	2652	
D Building 55	D_Building	R54804	693	2550	1735	2430	2250	2100	1947	1828	1035	677	616	719	1417	2703	
D Building 56	D_Building	R54815	938	3099	1617	2384	2185	2190	2055	1805	937	683	731	765	1536	2938	
D Building 57	D_Building	R54826	574	2704	1816	2477	2429	1935	2260	2262	1332	990	846	795	1732	3064	
D Building 58	D_Building	R54836	568	2430	1555	2233	1860	1688	1469	1534	778	593	535	594	1415	2307	
D Building 59	D_Building	R54847	546	1847	1514	2112	1691	1792	1790	1634	998	628	582	697	1138	2511	
D Building 60	D_Building	R54858	628	1935	1327	1762	1269	1360	1260	1275	705	674	612	679	1069	2330	
D Building 61	D_Building	R54869	532	2022	1662	2255	1929	1958	1704	1734	977	767	800	719	1394	2606	
D Building 62	D_Building	R53717	858	2297	1744	2425	2018	1950	1768	1630	957	715	677	595	800	2886	
D Building 74	D_Building	R53675	718	2495	1291	1895	1339	840	1147	1303	766	639	566	463	1079	3153	
D Building 75	D_Building	R53668	795	6744	983	1438	1268	1225	1125	1169	702	475	508	554	912	2005	
Village Square	D_Building	R56628	2550	2550	2550	2550	8117	9087	4038	6229	3695	3304	3335	3383	4415	9112	
Actuator DB 01 (Z8)	DB	R53196	39	49	43	43	45	43	36	34	29	7	28	24	27.1	31	
Actuator DB 02	DB	R51900	285	335	275	220	210	219	165	232	161	33	134	139	211	363	
Actuator DB 03	DB	R51904	188	226	197	203	212	203	196	220	199	56	203	196	211.6	217	
Actuator DB 04	DB	R51901	159	275	258	210	184	201	144	172	173	186	161	227	253	255	
Actuator DB 05	DB	R51907	15	18	15	16	16	16	15	18	16	4	18	14	17.7	21	
Actuator DB 06	DB	R51909	39	50	42	48	46	129	43	49	44	47	45	38	46.9	56	
Zone-3 landscape light 17	FP-Landscape Lights Z3	R54872	0	0	0	0	0	0	0	0	0	0	0	0	0	0	
Zone-3 landscape light 21	FP-Landscape Lights Z3	R54873	42	67	37	42	40	33	28	40	48	13	57	47	55	74	
Zone-3 landscape light 22	FP-Landscape Lights Z3	R54874	5	10	3	5	4	5	12	6	8	0	0	0	0	0	
Irrigation Tank 01	IRR	R52324 (R52326)	1543	2673	2763	2623	1467	1290	1244	1432	1268	1689	2214	1718	1663	2380	
Irrigation Tank 02	IRR	R52331	1272	2839	3118	2330	2458	1875	893	974	1026	983	1124	1110	1830	3260	
Irrigation Tank 03	IRR	R52323	894	866	1869	1543	1793	524	266	269	417	840	1009	845	1205	2266	
Irrigation Tank 04	IRR	R53195	880	827	555	443	336	195	183	212	213	40	233	235	447.2	1394	
Lifting Station 02	LS	R52328	44	0	0	0	153	125	0	0	0	0	0	0	0	0	
Lifting Station 03	LS	R52333	198	269	122	203	208	257	196	91	185	28	40	58	83	85	
Lifting Station 04	LS	R52324	644	865	791	768	747	723	628	686	631	701	638	572	750.22	698	
Lifting Station 05	LS	R52332	2056	2577	2361	3016	3684	5866	1715	2413	2643	2873	3665	3069	4201.4	8461	
Pumping Station 01	PS	R52330	1608	1940	1783	1874	1662	3822	6876	1629	1640	1903	2095	3032	3940	3420	
Pumping Station 03	PS	R52329	31	47	25	3	0	0	33	0	179	33	137	131	276.6	278	
Pumping Station 04	PS	R52327	830	818	720	731	857	1176	445	919	921	245	870	646	984.9	1049.7	
Pumping Station 05	PS	R52325	1774	2216	2011	2059	2229	5217	2483	2599	1952	2069	2521	2601	3317	3254	
Bank muscat	Retail		0	0	0	3	71	-2	1407	148	72	59	98	88	163	222	
CIF kitchen	Retail		0	0	0	17895	16532	18955	15071	16742	15554	16788	16154	14971	18446	23503	
OUA Store (BTU Meter)	Retail		0	0	0	0	0	0	0	0	0	0	0	0	0	0	
Street Light FP 01 (Z8)	Street Light	R53197	2773	3276	3268	3040	3203	3225	3064	3593	3147	787	3228	2663	3230	3804	
Street Light FP 02	Street Light	R51906	1705	2076	1758	1738	1940	2006	1944	2361	2258	633	2298	1812	2153	2435	
Street Light FP 03	Street Light	R51905	1399	1608	1365	1380	1457	1499	1561	2060	1966	1868	1974	1562	1847	1984	
Street Light FP 04	Street Light	R51908	861	1045	1051	2268	2478	2513	2341	2299	1389	325	1406	1401	2412.9	4099	
Street Light FP 05	Street Light	R51902	532	587	575	770	1341	1895	1844	1477	1121	449	2070	1870	3233	5406`;

export const BILLING_RATE = 0.025; // OMR per kWh

export const parseElectricityData = (rawData: string): ElectricityDataEntry[] => {
    const lines = rawData.trim().split('\n');
    const header = lines[0].split('\t').map(h => h.trim());
    const monthHeaders = header.slice(3);

    const dataLines = lines.slice(1);

    return dataLines.map((line, index) => {
        const values = line.split('\t');
        const consumption: { [month: string]: number } = {};
        monthHeaders.forEach((month, i) => {
            const valStr = values[3 + i] || '0';
            consumption[month] = parseFloat(valStr) || 0;
        });

        const totalConsumption = Object.values(consumption).reduce((acc, val) => acc + val, 0);
        
        return {
            id: `${values[2]?.trim() || 'N/A'}-${index}`,
            name: values[0]?.trim() || 'N/A',
            type: values[1]?.trim() || 'N/A',
            accountNumber: values[2]?.trim() || 'N/A',
            consumption,
            totalConsumption,
        };
    }).filter(d => d.name !== 'N/A');
};


export const electricityData = parseElectricityData(rawElectricityData);
export const electricityMonthsAvailable = electricityData.length > 0 ? Object.keys(electricityData[0].consumption) : [];

export const getUniqueMeterTypes = (data: ElectricityDataEntry[]): string[] => {
    const types = new Set(data.map(meter => meter.type));
    return Array.from(types).sort();
};

export const filterDataByType = (data: ElectricityDataEntry[], type: string): ElectricityDataEntry[] => {
    if (type === 'All') return data;
    return data.filter(meter => meter.type === type);
}

export const calculateElectricityTotalsForPeriod = (data: ElectricityDataEntry[], startMonth: string, endMonth: string) => {
    const startIndex = electricityMonthsAvailable.indexOf(startMonth);
    const endIndex = electricityMonthsAvailable.indexOf(endMonth);

    const defaultReturn = {
        totalConsumption: 0,
        totalCost: 0,
        meterCount: data.length,
        topConsumer: null as (ElectricityDataEntry & { cost: number }) | null,
        consumptionAndCostByType: {} as {[type: string]: { consumption: number, cost: number }},
        period: ''
    };

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
        return defaultReturn;
    }

    const selectedMonths = electricityMonthsAvailable.slice(startIndex, endIndex + 1);
    
    let totalConsumption = 0;
    const consumptionAndCostByType: {[type: string]: { consumption: number, cost: number }} = {};
    const periodData: (ElectricityDataEntry & { cost: number })[] = [];

    data.forEach(meter => {
        let meterPeriodConsumption = 0;
        selectedMonths.forEach(month => {
            meterPeriodConsumption += meter.consumption[month] || 0;
        });
        
        totalConsumption += meterPeriodConsumption;
        const meterCost = meterPeriodConsumption * BILLING_RATE;

        if (!consumptionAndCostByType[meter.type]) {
            consumptionAndCostByType[meter.type] = { consumption: 0, cost: 0 };
        }
        consumptionAndCostByType[meter.type].consumption += meterPeriodConsumption;
        consumptionAndCostByType[meter.type].cost += meterCost;
        
        periodData.push({ ...meter, totalConsumption: meterPeriodConsumption, cost: meterCost });
    });
    
    const topConsumer = periodData.length > 0 
        ? [...periodData].sort((a, b) => b.totalConsumption - a.totalConsumption)[0]
        : null;

    return {
        totalConsumption,
        totalCost: totalConsumption * BILLING_RATE,
        meterCount: data.length,
        topConsumer,
        consumptionAndCostByType,
        period: startMonth === endMonth ? startMonth : `${startMonth} to ${endMonth}`
    };
};
