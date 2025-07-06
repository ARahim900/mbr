
import { MeterReading, MonthlyConsumption, ProcessedData } from '../types';

const rawData = `Meter Label	Acct #	Zone	Type	Parent Meter	Label	Jan-25	Feb-25	Mar-25	Apr-25	May-25
Z5-17	4300001	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	112	80	81	90	58
Z3-42 (Villa)	4300002	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	32	46	19	62	87
Z3-46(5) (Building)	4300003	Zone_03_(A)	Residential (Apart)	D-46 Building Bulk Meter	L4	5	0	0	0	4
Z3-49(3) (Building)	4300004	Zone_03_(A)	Residential (Apart)	D-49 Building Bulk Meter	L4	10	15	11	13	12
Z3-38 (Villa)	4300005	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	10	7	7	7	8
Z3-75(4) (Building)	4300006	Zone_03_(A)	Residential (Apart)	D-75 Building Bulk Meter	L4	0	0	0	0	1
Z3-46(3A) (Building)	4300007	Zone_03_(A)	Residential (Apart)	D-46 Building Bulk Meter	L4	38	35	15	35	43
Z3-52(6) (Building)	4300008	Zone_03_(B)	Residential (Apart)	D-52 Building Bulk Meter	L4	10	9	9	14	12
Z3-21 (Villa)	4300009	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	41	53	42	48	51
Z3-049(4) (Building)	4300010	Zone_03_(A)	Residential (Apart)	D-49 Building Bulk Meter	L4	8	1	8	0	0
Z3-46(1A) (Building)	4300011	Zone_03_(A)	Residential (Apart)	D-46 Building Bulk Meter	L4	11	10	10	11	11
Z3-47(2) (Building)	4300012	Zone_03_(A)	Residential (Apart)	D-47  Building Bulk Meter	L4	1	1	1	1	1
Z3-45(3A) (Building)	4300013	Zone_03_(A)	Residential (Apart)	D-45 Building Bulk Meter	L4	8	4	0	1	1
Z3-46(2A) (Building)	4300014	Zone_03_(A)	Residential (Apart)	D-46 Building Bulk Meter	L4	0	0	0	0	0
Z3-46(6) (Building)	4300015	Zone_03_(A)	Residential (Apart)	D-46 Building Bulk Meter	L4	3	1	1	5	5
Z3-47(4) (Building)	4300016	Zone_03_(A)	Residential (Apart)	D-47  Building Bulk Meter	L4	11	12	0	1	0
Z3-45(5) (Building)	4300017	Zone_03_(A)	Residential (Apart)	D-45 Building Bulk Meter	L4	5	3	2	2	2
Z3-47(5) (Building)	4300018	Zone_03_(A)	Residential (Apart)	D-47  Building Bulk Meter	L4	36	12	11	18	16
Z3-45(6) (Building)	4300019	Zone_03_(A)	Residential (Apart)	D-45 Building Bulk Meter	L4	5	18	32	42	47
Z3-20 (Villa)	4300020	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	12	14	7	3	5
Z3-50(4) (Building)	4300021	Zone_03_(A)	Residential (Apart)	D-50 Building Bulk Meter	L4	6	4	6	17	7
Z3-74(3) (Building)	4300022	Zone_03_(A)	Residential (Apart)	D-74 Building Bulk Meter	L4	12	19	19	27	26
Z8-11	4300023	Zone_08	Residential (Villa)	BULK ZONE 8	L3	0	1	0	0	0
Z8-13	4300024	Zone_08	Residential (Villa)	BULK ZONE 8	L3	0	0	0	0	0
Z3-13 (Villa)	4300025	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	20	22	18	24	20
Z3-45(4A) (Building)	4300026	Zone_03_(A)	Residential (Apart)	D-45 Building Bulk Meter	L4	0	0	0	0	0
Z3-50(5) (Building)	4300027	Zone_03_(A)	Residential (Apart)	D-50 Building Bulk Meter	L4	9	10	22	11	11
Z3-50(6) (Building)	4300028	Zone_03_(A)	Residential (Apart)	D-50 Building Bulk Meter	L4	21	20	18	13	16
Z3-52(4A) (Building)	4300029	Zone_03_(B)	Residential (Apart)	D-52 Building Bulk Meter	L4	0	0	0	0	6
Z3-44(1A) (Building)	4300030	Zone_03_(A)	Residential (Apart)	D-44 Building Bulk Meter	L4	11	11	10	6	11
Z3-44(1B) (Building)	4300031	Zone_03_(A)	Residential (Apart)	D-44 Building Bulk Meter	L4	0	0	0	0	0
Z3-44(2A) (Building)	4300032	Zone_03_(A)	Residential (Apart)	D-44 Building Bulk Meter	L4	9	3	5	10	7
Z3-44(2B) (Building)	4300033	Zone_03_(A)	Residential (Apart)	D-44 Building Bulk Meter	L4	7	7	7	8	3
Z3-44(5) (Building)	4300034	Zone_03_(A)	Residential (Apart)	D-44 Building Bulk Meter	L4	118	139	38	25	6
Z3-44(6) (Building)	4300035	Zone_03_(A)	Residential (Apart)	D-44 Building Bulk Meter	L4	34	37	31	37	35
Z3-75(1) (Building)	4300036	Zone_03_(A)	Residential (Apart)	D-75 Building Bulk Meter	L4	1	0	0	1	1
Z3-75(3) (Building)	4300037	Zone_03_(A)	Residential (Apart)	D-75 Building Bulk Meter	L4	2	7	0	6	0
Z3-23 (Villa)	4300038	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	0	0	0	0	1
Z3-47(3) (Building)	4300039	Zone_03_(A)	Residential (Apart)	D-47  Building Bulk Meter	L4	18	19	17	17	18
Z3-48(3) (Building)	4300040	Zone_03_(A)	Residential (Apart)	D-48 Building Bulk Meter	L4	3	5	4	4	7
Z3-48(6) (Building)	4300041	Zone_03_(A)	Residential (Apart)	D-48 Building Bulk Meter	L4	0	0	0	1	0
Z3-52(3A) (Building)	4300042	Zone_03_(B)	Residential (Apart)	D-52 Building Bulk Meter	L4	6	9	5	5	11
Z3-46(4A) (Building)	4300043	Zone_03_(A)	Residential (Apart)	D-46 Building Bulk Meter	L4	4	1	0	19	5
Z3-41 (Villa)	4300044	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	13	18	34	26	25
Z3-74(5) (Building)	4300045	Zone_03_(A)	Residential (Apart)	D-74 Building Bulk Meter	L4	13	7	12	16	9
Z3-74(6) (Building)	4300046	Zone_03_(A)	Residential (Apart)	D-74 Building Bulk Meter	L4	12	4	4	5	5
Z3-50(3) (Building)	4300047	Zone_03_(A)	Residential (Apart)	D-50 Building Bulk Meter	L4	8	13	6	0	0
Z3-48(5) (Building)	4300048	Zone_03_(A)	Residential (Apart)	D-48 Building Bulk Meter	L4	2	1	1	0	0
Z3-37 (Villa)	4300049	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	26	15	18	28	49
Z3-43 (Villa)	4300050	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	70	68	46	52	48
Z3-47(6) (Building)	4300051	Zone_03_(A)	Residential (Apart)	D-47  Building Bulk Meter	L4	29	14	16	17	9
Z3-31 (Villa)	4300052	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	165	133	30	306	527
Z3-49(5) (Building)	4300053	Zone_03_(A)	Residential (Apart)	D-49 Building Bulk Meter	L4	0	5	0	0	0
Z3-62(6) (Building)	4300054	Zone_03_(B)	Residential (Apart)	D-62 Building Bulk Meter	L4	39	19	17	11	3
Z3-75(5) (Building)	4300055	Zone_03_(A)	Residential (Apart)	D-75 Building Bulk Meter	L4	16	12	12	16	16
Z3-52(5) (Building)	4300056	Zone_03_(B)	Residential (Apart)	D-52 Building Bulk Meter	L4	5	3	4	7	9
Z3-15 (Villa)	4300057	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	40	41	35	47	44
Z5-13	4300058	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	72	106	89	120	109
Z5-14	4300059	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	71	93	77	93	82
Z3-14 (Villa)	4300060	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	166	102	30	43	32
Z3-49(6) (Building)	4300061	Zone_03_(A)	Residential (Apart)	D-49 Building Bulk Meter	L4	25	22	21	27	22
Z3-62(1) (Building)	4300062	Zone_03_(B)	Residential (Apart)	D-62 Building Bulk Meter	L4	4	1	15	10	5
Z3-75(6) (Building)	4300063	Zone_03_(A)	Residential (Apart)	D-75 Building Bulk Meter	L4	35	32	35	36	26
Z3-53(4B) (Building)	4300064	Zone_03_(B)	Residential (Apart)	D-53 Building Bulk Meter	L4	0	0	0	0	0
Z3-60(1B) (Building)	4300065	Zone_03_(B)	Residential (Apart)	D-60 Building Bulk Meter	L4	14	14	9	14	13
Z3-59(4B) (Building)	4300066	Zone_03_(B)	Residential (Apart)	D-59 Building Bulk Meter	L4	3	3	0	1	0
Z3-60(3B) (Building)	4300067	Zone_03_(B)	Residential (Apart)	D-60 Building Bulk Meter	L4	0	2	0	0	0
Z3-60(4B) (Building)	4300068	Zone_03_(B)	Residential (Apart)	D-60 Building Bulk Meter	L4	1	3	5	6	4
Z3-52(2A) (Building)	4300069	Zone_03_(B)	Residential (Apart)	D-52 Building Bulk Meter	L4	0	0	0	0	0
Z3-58(1B) (Building)	4300070	Zone_03_(B)	Residential (Apart)	D-58 Building Bulk Meter	L4	2	2	1	2	3
Z3-55(1B) (Building)	4300071	Zone_03_(B)	Residential (Apart)	D-55 Building Bulk Meter	L4	3	4	3	3	4
Z3-60(2B) (Building)	4300072	Zone_03_(B)	Residential (Apart)	D-60 Building Bulk Meter	L4	3	0	0	11	2
Z3-59(3A) (Building)	4300073	Zone_03_(B)	Residential (Apart)	D-59 Building Bulk Meter	L4	0	0	0	0	0
Z3-53(6) (Building)	4300074	Zone_03_(B)	Residential (Apart)	D-53 Building Bulk Meter	L4	0	0	0	0	0
Z3-35 (Villa)	4300075	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	65	61	52	74	68
Z3-12 (Villa)	4300076	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	73	59	54	181	178
Z3-11 (Villa)	4300077	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	0	0	0	0	0
Z3-4 (Villa)	4300078	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	90	55	22	23	113
Z3-40 (Villa)	4300079	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	18	23	37	37	139
Z3-17 (Villa)	4300080	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	19	8	5	13	15
Z3-30 (Villa)	4300081	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	0	0	4	0	0
Z3-33 (Villa)	4300082	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	45	45	40	50	49
Z3-18 (Villa)	4300083	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	36	36	33	39	76
Z3-36 (Villa)	4300084	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	81	83	69	83	170
Z3-32 (Villa)	4300085	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	38	39	33	38	40
Z3-39 (Villa)	4300086	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	39	36	29	33	41
Z3-34 (Villa)	4300087	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	0	0	0	20	18
Z3-3 (Villa)	4300088	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	66	59	63	73	176
Z3-27 (Villa)	4300089	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	15	32	55	73	25
Z3-7 (Villa)	4300090	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	38	45	46	57	58
Z3-24 (Villa)	4300091	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	18	39	78	101	75
Z3-10 (Villa)	4300092	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	78	81	62	101	89
Z3-25 (Villa)	4300093	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	3	0	0	0	0
Z3-1 (Villa)	4300094	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	4	4	5	7	7
Z3-26 (Villa)	4300095	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	0	0	0	0	0
Z3-9 (Villa)	4300096	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	67	49	55	60	69
Z3-29 (Villa)	4300097	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	0	7	3	2	0
Z3-2 (Villa)	4300098	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	6	6	8	7	38
Z3-19 (Villa)	4300099	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	138	6	26	108	77
Z3-6 (Villa)	4300100	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	31	33	38	36	30
Z3-28 (Villa)	4300101	Zone_03_(A)	Residential (Villa)	ZONE 3A (BULK ZONE 3A)	L3	44	38	30	41	53
Z3-22 (Villa)	4300102	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	32	14	53	31	32
Z3-16 (Villa)	4300103	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	1	28	2	5	21
Z3-5 (Villa)	4300104	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	40	51	42	55	51
Z3-8 (Villa)	4300105	Zone_03_(B)	Residential (Villa)	ZONE 3B (BULK ZONE 3B)	L3	83	106	196	358	414
Z3-74(1) (Building)	4300106	Zone_03_(A)	Residential (Apart)	D-74 Building Bulk Meter	L4	1	0	0	1	1
Z3-49(1) (Building)	4300107	Zone_03_(A)	Residential (Apart)	D-49 Building Bulk Meter	L4	0	4	3	9	3
Z3-49(2) (Building)	4300108	Zone_03_(A)	Residential (Apart)	D-49 Building Bulk Meter	L4	15	15	12	15	13
Z3-50(1) (Building)	4300109	Zone_03_(A)	Residential (Apart)	D-50 Building Bulk Meter	L4	22	26	28	6	1
Z3-45(1A) (Building)	4300110	Zone_03_(A)	Residential (Apart)	D-45 Building Bulk Meter	L4	0	1	0	0	1
Z3-51(1) (Building)	4300111	Zone_03_(A)	Residential (Apart)	D-51 Building Bulk Meter	L4	0	0	0	0	1
Z3-51(2) (Building)	4300112	Zone_03_(A)	Residential (Apart)	D-51 Building Bulk Meter	L4	32	28	31	30	32
Z3-45(2A) (Building)	4300113	Zone_03_(A)	Residential (Apart)	D-45 Building Bulk Meter	L4	2	7	9	11	4
Z3-050(2) (Building)	4300114	Zone_03_(A)	Residential (Apart)	D-50 Building Bulk Meter	L4	0	8	0	3	0
Z3-47(1) (Building)	4300115	Zone_03_(A)	Residential (Apart)	D-47  Building Bulk Meter	L4	9	11	10	15	10
Z3-52(1A) (Building)	4300116	Zone_03_(B)	Residential (Apart)	D-52 Building Bulk Meter	L4	19	14	5	8	8
Z3-48(1) (Building)	4300117	Zone_03_(A)	Residential (Apart)	D-48 Building Bulk Meter	L4	3	5	4	5	14
Z3-74(2) (Building)	4300118	Zone_03_(A)	Residential (Apart)	D-74 Building Bulk Meter	L4	0	0	0	0	0
Z3-62(2) (Building)	4300119	Zone_03_(B)	Residential (Apart)	D-62 Building Bulk Meter	L4	7	10	8	11	14
Z3-58(5) (Building)	4300120	Zone_03_(B)	Residential (Apart)	D-58 Building Bulk Meter	L4	29	23	32	30	30
Z3-51(3) (Building)	4300121	Zone_03_(A)	Residential (Apart)	D-51 Building Bulk Meter	L4	13	10	9	11	14
Z3-75(2) (Building)	4300122	Zone_03_(A)	Residential (Apart)	D-75 Building Bulk Meter	L4	7	7	9	8	7
Z3-48(2) (Building)	4300123	Zone_03_(A)	Residential (Apart)	D-48 Building Bulk Meter	L4	3	0	4	2	0
Z3-62(3) (Building)	4300124	Zone_03_(B)	Residential (Apart)	D-62 Building Bulk Meter	L4	0	0	0	0	0
Z3-74(4) (Building)	4300125	Zone_03_(A)	Residential (Apart)	D-74 Building Bulk Meter	L4	0	2	0	0	0
D 52-Building Common Meter	4300126	Zone_03_(B)	D_Building_Common	D-52 Building Bulk Meter	L4	1	1	2	4	1
Z3-51(4) (Building)	4300127	Zone_03_(A)	Residential (Apart)	D-51 Building Bulk Meter	L4	11	9	12	9	11
Z3-051(5) (Building)	4300128	Zone_03_(A)	Residential (Apart)	D-51 Building Bulk Meter	L4	2	5	19	6	7
Z3-62(4) (Building)	4300129	Zone_03_(B)	Residential (Apart)	D-62 Building Bulk Meter	L4	0	0	0	0	0
Z3-58(3B) (Building)	4300130	Zone_03_(B)	Residential (Apart)	D-58 Building Bulk Meter	L4	6	6	3	29	7
Z3-48(4) (Building)	4300131	Zone_03_(A)	Residential (Apart)	D-48 Building Bulk Meter	L4	5	5	5	4	2
Z3-058(4B) (Building)	4300132	Zone_03_(B)	Residential (Apart)	D-58 Building Bulk Meter	L4	9	8	4	6	5
Z3-62(5) (Building)	4300133	Zone_03_(B)	Residential (Apart)	D-62 Building Bulk Meter	L4	0	0	0	0	0
Z3-51(6) (Building)	4300134	Zone_03_(A)	Residential (Apart)	D-51 Building Bulk Meter	L4	8	2	5	6	9
D 45-Building Common Meter	4300135	Zone_03_(A)	D_Building_Common	D-45 Building Bulk Meter	L4	0	1	1	0	1
D 50-Building Common Meter	4300136	Zone_03_(A)	D_Building_Common	D-50 Building Bulk Meter	L4	1	1	1	1	1
D 51-Building Common Meter	4300137	Zone_03_(A)	D_Building_Common	D-51 Building Bulk Meter	L4	1	0	1	1	2
D 46-Building Common Meter	4300138	Zone_03_(A)	D_Building_Common	D-46 Building Bulk Meter	L4	1	0	1	0	1
D 74-Building Common Meter	4300139	Zone_03_(A)	D_Building_Common	D-74 Building Bulk Meter	L4	0	1	1	2	1
D 49-Building Common Meter	4300140	Zone_03_(A)	D_Building_Common	D-49 Building Bulk Meter	L4	0	1	2	1	1
D 48-Building Common Meter	4300141	Zone_03_(A)	D_Building_Common	D-48 Building Bulk Meter	L4	0	1	0	1	0
D 62-Building Common Meter	4300142	Zone_03_(B)	D_Building_Common	D-62 Building Bulk Meter	L4	0	0	0	0	0
D 47-Building Common Meter	4300143	Zone_03_(A)	D_Building_Common	D-47  Building Bulk Meter	L4	1	0	0	2	1
D 44-Building Common Meter	4300144	Zone_03_(A)	D_Building_Common	D-44 Building Bulk Meter	L4	1	1	0	1	1
D 75-Building Common Meter	4300145	Zone_03_(A)	D_Building_Common	D-75 Building Bulk Meter	L4	3	4	3	7	9
Z5-5	4300146	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	3	6	2	5	39
Z5-30	4300147	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	65	87	71	113	203
Z5-2	4300148	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	0	0	0	0	0
Z5-10	4300149	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	37	0	0	0	0
Z5-4	4300150	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	81	98	35	49	29
Z5-6	4300151	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	6	3	10	5	37
Z5 020	4300152	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	25	30	147	164	202
Z5-23	4300153	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	0	22	19	0	0
Z5-15	4300154	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	35	19	16	23	30
Z5-9	4300155	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	38	49	40	56	77
Z5-26	4300156	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	61	41	16	69	107
Z5-25	4300157	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	37	24	10	71	104
Z5-31	4300158	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	33	24	14	16	4
Z5-33	4300159	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	2	0	24	0	19
Z5-29	4300160	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	49	66	21	20	28
Z5-28	4300161	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	50	21	9	8	14
Z5-32	4300162	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	59	119	71	72	68
Z5-22	4300163	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	15	40	186	243	201
Z5-7	4300164	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	0	26	14	7	5
Z5-27	4300165	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	36	13	19	12	15
Z5-12	4300166	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	44	47	40	66	81
Z5 024	4300167	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	68	1	0	0	0
Z5 016	4300168	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	27	29	37	51	53
Z5-21	4300169	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	25	22	34	58	57
Z5-3	4300170	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	149	86	67	100	70
Z5 019	4300171	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	5	7	6	2	57
Z5-1	4300172	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	5	5	4	5	47
Z5-11	4300173	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	30	45	3	3	9
Z5-18	4300174	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	8	12	11	37	30
Z5-8	4300175	Zone_05	Residential (Villa)	ZONE 5 (Bulk Zone 5)	L3	6	12	11	67	12
D-75 Building Bulk Meter	4300176	Zone_03_(A)	D_Building_Bulk	ZONE 3A (BULK ZONE 3A)	L3	63	60	66	71	59
D-74 Building Bulk Meter	4300177	Zone_03_(A)	D_Building_Bulk	ZONE 3A (BULK ZONE 3A)	L3	41	35	36	54	51
D-44 Building Bulk Meter	4300178	Zone_03_(A)	D_Building_Bulk	ZONE 3A (BULK ZONE 3A)	L3			746		62
D-45 Building Bulk Meter	4300179	Zone_03_(A)	D_Building_Bulk	ZONE 3A (BULK ZONE 3A)	L3	20	32	44	56	55
D-46 Building Bulk Meter	4300180	Zone_03_(A)	D_Building_Bulk	ZONE 3A (BULK ZONE 3A)	L3	61	46	29	68	69
D-47  Building Bulk Meter	4300181	Zone_03_(A)	D_Building_Bulk	ZONE 3A (BULK ZONE 3A)	L3	103	70	55	69	57
D-48 Building Bulk Meter	4300182	Zone_03_(A)	D_Building_Bulk	ZONE 3A (BULK ZONE 3A)	L3	17	17	19	18	25
D-49 Building Bulk Meter	4300183	Zone_03_(A)	D_Building_Bulk	ZONE 3A (BULK ZONE 3A)	L3	58	63	59	0	108
D-50 Building Bulk Meter	4300184	Zone_03_(A)	D_Building_Bulk	ZONE 3A (BULK ZONE 3A)	L3	65	81	82	49	34
D-51 Building Bulk Meter	4300185	Zone_03_(A)	D_Building_Bulk	ZONE 3A (BULK ZONE 3A)	L3	92	108	152	166	111
D-52 Building Bulk Meter	4300186	Zone_03_(B)	D_Building_Bulk	ZONE 3B (BULK ZONE 3B)	L3	40	35	25	37	48
D-62 Building Bulk Meter	4300187	Zone_03_(B)	D_Building_Bulk	ZONE 3B (BULK ZONE 3B)	L3	49	32	39	35	22
Z8-1	4300188	Zone_08	Residential (Villa)	BULK ZONE 8	L3	1	2	3	16	7
Z8-2	4300189	Zone_08	Residential (Villa)	BULK ZONE 8	L3	0	0	0	0	0
Z8-3	4300190	Zone_08	Residential (Villa)	BULK ZONE 8	L3	0	0	0	0	0
Z8-4	4300191	Zone_08	Residential (Villa)	BULK ZONE 8	L3	0	0	0	0	0
Z8-6	4300192	Zone_08	Residential (Villa)	BULK ZONE 8	L3	1	0	0	0	0
Z8-7	4300193	Zone_08	Residential (Villa)	BULK ZONE 8	L3	0	0	0	0	0
Z8-8	4300194	Zone_08	Residential (Villa)	BULK ZONE 8	L3	0	0	0	0	0
Z8-10	4300195	Zone_08	Residential (Villa)	BULK ZONE 8	L3	0	0	0	0	0
Z8-12	4300196	Zone_08	Residential (Villa)	BULK ZONE 8	L3	236	192	249	267	295
Z8-14	4300197	Zone_08	Residential (Villa)	BULK ZONE 8	L3	0	0	0	0	0
Z8-15	4300198	Zone_08	Residential (Villa)	BULK ZONE 8	L3	99	61	70	125	112
Z8-16	4300199	Zone_08	Residential (Villa)	BULK ZONE 8	L3	67	72	54	98	95
Z8-17	4300200	Zone_08	Residential (Villa)	BULK ZONE 8	L3	164	162	171	207	238
D 53-Building Common Meter	4300201	Zone_03_(B)	D_Building_Common	D-53 Building Bulk Meter	L4	0	1	7	2	2
D 54-Building Common Meter	4300202	Zone_03_(B)	D_Building_Common	D-54 Building Bulk Meter	L4	0	1	1	3	1
D 55-Building Common Meter	4300203	Zone_03_(B)	D_Building_Common	D-55 Building Bulk Meter	L4	1	1	2	3	2
D 56-Building Common Meter	4300204	Zone_03_(B)	D_Building_Common	D-56 Building Bulk Meter	L4	1	2	8	3	4
D 57-Building Common Meter	4300205	Zone_03_(B)	D_Building_Common	D-57 Building Bulk Meter	L4	2	1	4	7	3
D 58-Building Common Meter	4300206	Zone_03_(B)	D_Building_Common	D-58 Building Bulk Meter	L4	1	0	0	3	0
D 59-Building Common Meter	4300207	Zone_03_(B)	D_Building_Common	D-59 Building Bulk Meter	L4	1	0	1	1	1
D 60-Building Common Meter	4300208	Zone_03_(B)	D_Building_Common	D-60 Building Bulk Meter	L4	1	1	0	1	2
D 61-Building Common Meter	4300209	Zone_03_(B)	D_Building_Common	D-61 Building Bulk Meter	L4	1	0	1	2	0
Z3-53(1A) (Building)	4300210	Zone_03_(B)	Residential (Apart)	D-53 Building Bulk Meter	L4	8	9	10	12	4
Z3-53(1B) (Building)	4300211	Zone_03_(B)	Residential (Apart)	D-53 Building Bulk Meter	L4	6	8	6	8	9
Z3-53(2A) (Building)	4300212	Zone_03_(B)	Residential (Apart)	D-53 Building Bulk Meter	L4	0	0	0	0	0
Z3-53(2B) (Building)	4300213	Zone_03_(B)	Residential (Apart)	D-53 Building Bulk Meter	L4	0	0	0	0	0
Z3-53(3A) (Building)	4300214	Zone_03_(B)	Residential (Apart)	D-53 Building Bulk Meter	L4	0	1	0	6	0
Z3-53(3B) (Building)	4300215	Zone_03_(B)	Residential (Apart)	D-53 Building Bulk Meter	L4	1	3	1	6	6
Z3-53(4A) (Building)	4300216	Zone_03_(B)	Residential (Apart)	D-53 Building Bulk Meter	L4	0	5	0	5	0
Z3-53(5) (Building)	4300217	Zone_03_(B)	Residential (Apart)	D-53 Building Bulk Meter	L4	2	1	1	0	0
Z3-54(1A) (Building)	4300218	Zone_03_(B)	Residential (Apart)	D-54 Building Bulk Meter	L4	11	12	8	13	5
Z3-54(1B) (Building)	4300219	Zone_03_(B)	Residential (Apart)	D-54 Building Bulk Meter	L4	1	1	5	6	3
Z3-54(2A) (Building)	4300220	Zone_03_(B)	Residential (Apart)	D-54 Building Bulk Meter	L4	3	3	3	1	0
Z3-54(2B) (Building)	4300221	Zone_03_(B)	Residential (Apart)	D-54 Building Bulk Meter	L4	20	9	19	14	10
Z3-54(3A) (Building)	4300222	Zone_03_(B)	Residential (Apart)	D-54 Building Bulk Meter	L4	8	8	3	8	5
Z3-54(3B) (Building)	4300223	Zone_03_(B)	Residential (Apart)	D-54 Building Bulk Meter	L4	1	1	0	1	0
Z3-54(4A) (Building)	4300224	Zone_03_(B)	Residential (Apart)	D-54 Building Bulk Meter	L4	0	0	0	14	0
Z3-54(4B) (Building)	4300225	Zone_03_(B)	Residential (Apart)	D-54 Building Bulk Meter	L4	0	0	1	2	0
Z3-54(5) (Building)	4300226	Zone_03_(B)	Residential (Apart)	D-54 Building Bulk Meter	L4	15	18	11	19	19
Z3-54(6) (Building)	4300227	Zone_03_(B)	Residential (Apart)	D-54 Building Bulk Meter	L4	5	4	4	23	9
Z3-55(1A) (Building)	4300228	Zone_03_(B)	Residential (Apart)	D-55 Building Bulk Meter	L4	0	0	0	0	0
Z3-55(2A) (Building)	4300229	Zone_03_(B)	Residential (Apart)	D-55 Building Bulk Meter	L4	23	24	5	15	25
Z3-55(2B) (Building)	4300230	Zone_03_(B)	Residential (Apart)	D-55 Building Bulk Meter	L4	3	4	5	5	4
Z3-55(3A) (Building)	4300231	Zone_03_(B)	Residential (Apart)	D-55 Building Bulk Meter	L4	17	8	4	10	12
Z3-55(3B) (Building)	4300232	Zone_03_(B)	Residential (Apart)	D-55 Building Bulk Meter	L4	7	3	5	7	5
Z3-55(4A) (Building)	4300233	Zone_03_(B)	Residential (Apart)	D-55 Building Bulk Meter	L4	4	7	7	9	6
Z3-55(4B) (Building)	4300234	Zone_03_(B)	Residential (Apart)	D-55 Building Bulk Meter	L4	6	5	5	5	3
Z3-55(5) (Building)	4300235	Zone_03_(B)	Residential (Apart)	D-55 Building Bulk Meter	L4	0	1	1	0	1
Z3-55(6) (Building)	4300236	Zone_03_(B)	Residential (Apart)	D-55 Building Bulk Meter	L4	7	5	68	129	31
Z3-56(1A) (Building)	4300237	Zone_03_(B)	Residential (Apart)	D-56 Building Bulk Meter	L4	50	0	0	0	0
Z3-56(1B) (Building)	4300238	Zone_03_(B)	Residential (Apart)	D-56 Building Bulk Meter	L4	1	0	0	0	1
Z3-56(2A) (Building)	4300239	Zone_03_(B)	Residential (Apart)	D-56 Building Bulk Meter	L4	2	7	0	4	6
Z3-56(2B) (Building)	4300240	Zone_03_(B)	Residential (Apart)	D-56 Building Bulk Meter	L4	5	1	8	11	3
Z3-56(3A) (Building)	4300241	Zone_03_(B)	Residential (Apart)	D-56 Building Bulk Meter	L4	0	0	0	0	0
Z3-56(3B) (Building)	4300242	Zone_03_(B)	Residential (Apart)	D-56 Building Bulk Meter	L4	0	1	0	0	0
Z3-56(4A) (Building)	4300243	Zone_03_(B)	Residential (Apart)	D-56 Building Bulk Meter	L4	0	0	4	3	2
Z3-56(4B) (Building)	4300244	Zone_03_(B)	Residential (Apart)	D-56 Building Bulk Meter	L4	7	0	0	0	0
Z3-56(5) (Building)	4300245	Zone_03_(B)	Residential (Apart)	D-56 Building Bulk Meter	L4	1	2	0	1	0
Z3-56(6) (Building)	4300246	Zone_03_(B)	Residential (Apart)	D-56 Building Bulk Meter	L4	14	3	17	3	0
Z3-57(1A) (Building)	4300247	Zone_03_(B)	Residential (Apart)	D-57 Building Bulk Meter	L4	2	8	0	0	2
Z3-57(1B) (Building)	4300248	Zone_03_(B)	Residential (Apart)	D-57 Building Bulk Meter	L4	3	1	0	1	0
Z3-57(2A) (Building)	4300249	Zone_03_(B)	Residential (Apart)	D-57 Building Bulk Meter	L4	4	5	5	4	5
Z3-57(2B) (Building)	4300250	Zone_03_(B)	Residential (Apart)	D-57 Building Bulk Meter	L4	1	1	5	8	11
Z3-57(3A) (Building)	4300251	Zone_03_(B)	Residential (Apart)	D-57 Building Bulk Meter	L4	6	4	5	5	7
Z3-57(3B) (Building)	4300252	Zone_03_(B)	Residential (Apart)	D-57 Building Bulk Meter	L4	0	0	1	0	0
Z3-57(4A) (Building)	4300253	Zone_03_(B)	Residential (Apart)	D-57 Building Bulk Meter	L4	0	0	0	1	0
Z3-57(4B) (Building)	4300254	Zone_03_(B)	Residential (Apart)	D-57 Building Bulk Meter	L4	0	3	0	3	0
Z3-57(5) (Building)	4300255	Zone_03_(B)	Residential (Apart)	D-57 Building Bulk Meter	L4	17	14	7	21	30
Z3-57(6) (Building)	4300256	Zone_03_(B)	Residential (Apart)	D-57 Building Bulk Meter	L4	10	26	22	14	13
Z3-58(1A) (Building)	4300257	Zone_03_(B)	Residential (Apart)	D-58 Building Bulk Meter	L4	3	2	4	4	4
Z3-58(2A) (Building)	4300258	Zone_03_(B)	Residential (Apart)	D-58 Building Bulk Meter	L4	0	0	4	5	0
Z3-58(2B) (Building)	4300259	Zone_03_(B)	Residential (Apart)	D-58 Building Bulk Meter	L4	5	5	1	9	6
Z3-58(3A) (Building)	4300260	Zone_03_(B)	Residential (Apart)	D-58 Building Bulk Meter	L4	0	0	0	0	12
Z3-58(4A) (Building)	4300261	Zone_03_(B)	Residential (Apart)	D-58 Building Bulk Meter	L4	0	0	1	0	0
Z3-58(6) (Building)	4300262	Zone_03_(B)	Residential (Apart)	D-58 Building Bulk Meter	L4	2	3	3	9	14
Z3-59(1A) (Building)	4300263	Zone_03_(B)	Residential (Apart)	D-59 Building Bulk Meter	L4	7	7	4	5	6
Z3-59(1B) (Building)	4300264	Zone_03_(B)	Residential (Apart)	D-59 Building Bulk Meter	L4	2	4	1	0	0
Z3-59(2A) (Building)	4300265	Zone_03_(B)	Residential (Apart)	D-59 Building Bulk Meter	L4	9	13	14	14	14
Z3-59(2B) (Building)	4300266	Zone_03_(B)	Residential (Apart)	D-59 Building Bulk Meter	L4	13	15	10	16	10
Z3-59(3B) (Building)	4300267	Zone_03_(B)	Residential (Apart)	D-59 Building Bulk Meter	L4	1	4	3	3	0
Z3-59(4A) (Building)	4300268	Zone_03_(B)	Residential (Apart)	D-59 Building Bulk Meter	L4	10	8	6	7	4
Z3-59(5) (Building)	4300269	Zone_03_(B)	Residential (Apart)	D-59 Building Bulk Meter	L4	12	3	7	11	6
Z3-59(6) (Building)	4300270	Zone_03_(B)	Residential (Apart)	D-59 Building Bulk Meter	L4	0	1	1	0	14
Z3-60(1A) (Building)	4300271	Zone_03_(B)	Residential (Apart)	D-60 Building Bulk Meter	L4	3	7	6	6	6
Z3-60(2A) (Building)	4300272	Zone_03_(B)	Residential (Apart)	D-60 Building Bulk Meter	L4	4	4	3	3	4
Z3-60(3A) (Building)	4300273	Zone_03_(B)	Residential (Apart)	D-60 Building Bulk Meter	L4	5	10	15	10	7
Z3-60(4A) (Building)	4300274	Zone_03_(B)	Residential (Apart)	D-60 Building Bulk Meter	L4	6	5	5	5	8
Z3-60(5) (Building)	4300275	Zone_03_(B)	Residential (Apart)	D-60 Building Bulk Meter	L4	0	0	0	0	0
Z3-60(6) (Building)	4300276	Zone_03_(B)	Residential (Apart)	D-60 Building Bulk Meter	L4	20	38	39	49	45
Z3-61(1A) (Building)	4300277	Zone_03_(B)	Residential (Apart)	D-61 Building Bulk Meter	L4	2	0	3	3	1
Z3-61(1B) (Building)	4300278	Zone_03_(B)	Residential (Apart)	D-61 Building Bulk Meter	L4	9	9	2	9	2
Z3-61(2A) (Building)	4300279	Zone_03_(B)	Residential (Apart)	D-61 Building Bulk Meter	L4	0	0	11	11	13
Z3-61(2B) (Building)	4300280	Zone_03_(B)	Residential (Apart)	D-61 Building Bulk Meter	L4	0	1	0	1	1
Z3-61(3A) (Building)	4300281	Zone_03_(B)	Residential (Apart)	D-61 Building Bulk Meter	L4	0	7	19	23	2
Z3-61(3B) (Building)	4300282	Zone_03_(B)	Residential (Apart)	D-61 Building Bulk Meter	L4	0	0	0	5	11
Z3-61(4A) (Building)	4300283	Zone_03_(B)	Residential (Apart)	D-61 Building Bulk Meter	L4	6	11	5	9	5
Z3-61(4B) (Building)	4300284	Zone_03_(B)	Residential (Apart)	D-61 Building Bulk Meter	L4	2	5	8	4	2
Z3-61(5) (Building)	4300285	Zone_03_(B)	Residential (Apart)	D-61 Building Bulk Meter	L4	6	0	1	2	0
Z3-61(6) (Building)	4300286	Zone_03_(B)	Residential (Apart)	D-61 Building Bulk Meter	L4	16	16	17	17	12
Z8-5	4300287	Zone_08	Residential (Villa)	BULK ZONE 8	L3	208	341	313	336	325
Z8-9	4300288	Zone_08	Residential (Villa)	BULK ZONE 8	L3	5	12	5	4	6
Z8-18	4300289	Zone_08	Residential (Villa)	BULK ZONE 8	L3	122	111	336	0	679
Z8-19	4300290	Zone_08	Residential (Villa)	BULK ZONE 8	L3	104	87	231	0	513
Z8-20	4300291	Zone_08	Residential (Villa)	BULK ZONE 8	L3	146	110	312	0	579
Z8-21	4300292	Zone_08	Residential (Villa)	BULK ZONE 8	L3	99	72	276	0	393
Z8-22	4300293	Zone_08	Residential (Villa)	BULK ZONE 8	L3	225	156	336	0	806
Irrigation Tank 04 - (Z08)	4300294	Direct Connection 	IRR_Servies	Main Bulk (NAMA)	DC	0	0	0	0	0
"Sales Center  Common Building"	4300295	Zone_SC	Zone Bulk	Main Bulk (NAMA)	L2	76	68	37	67	63
Building FM	4300296	Zone_01_(FM)	MB_Common	ZONE FM ( BULK ZONE FM )	L3	37	39	49	40	41
Building (Security)	4300297	Direct Connection 	MB_Common	Main Bulk (NAMA)	DC	17	18	13	16	16
Building Taxi	4300298	Zone_01_(FM)	Retail	ZONE FM ( BULK ZONE FM )	L3	11	16	12	14	13
Building (ROP)	4300299	Direct Connection 	MB_Common	Main Bulk (NAMA)	DC	23	21	19	20	20
Building B1	4300300	Zone_01_(FM)	Retail	ZONE FM ( BULK ZONE FM )	L3	228	225	235	253	233
Building B2	4300301	Zone_01_(FM)	Retail	ZONE FM ( BULK ZONE FM )	L3	236	213	202	187	199
Building B3	4300302	Zone_01_(FM)	Retail	ZONE FM ( BULK ZONE FM )	L3	169	165	132	134	160
Building B4	4300303	Zone_01_(FM)	Retail	ZONE FM ( BULK ZONE FM )	L3	108	108	148	148	121
Building B5	4300304	Zone_01_(FM)	Retail	ZONE FM ( BULK ZONE FM )	L3	1	2	1	1	0
Building B6	4300305	Zone_01_(FM)	Retail	ZONE FM ( BULK ZONE FM )	L3	254	228	268	281	214
Building B7	4300306	Zone_01_(FM)	Retail	ZONE FM ( BULK ZONE FM )	L3	178	190	174	201	200
Building B8	4300307	Zone_01_(FM)	Retail	ZONE FM ( BULK ZONE FM )	L3	268	250	233	0	413
Irrigation Tank (Z01_FM)	4300308	Zone_01_(FM)	IRR_Servies	ZONE FM ( BULK ZONE FM )	L3	0	0	0	0	0
Room PUMP (FIRE)	4300309	Zone_01_(FM)	MB_Common	ZONE FM ( BULK ZONE FM )	L3	78	0	0	0	0
Building (MEP)	4300310	Zone_01_(FM)	MB_Common	ZONE FM ( BULK ZONE FM )	L3	2	2	1	5	6
D-53 Building Bulk Meter	4300311	Zone_03_(B)	D_Building_Bulk	ZONE 3B (BULK ZONE 3B)	L3	18	27	26	39	21
D-54 Building Bulk Meter	4300312	Zone_03_(B)	D_Building_Bulk	ZONE 3B (BULK ZONE 3B)	L3	63	52	66	95	51
D-55 Building Bulk Meter	4300313	Zone_03_(B)	D_Building_Bulk	ZONE 3B (BULK ZONE 3B)	L3	71	62	107	181	94
D-56 Building Bulk Meter	4300314	Zone_03_(B)	D_Building_Bulk	ZONE 3B (BULK ZONE 3B)	L3	92	17	39	0	
D-57 Building Bulk Meter	4300315	Zone_03_(B)	D_Building_Bulk	ZONE 3B (BULK ZONE 3B)	L3	47	65	48	63	72
D-58 Building Bulk Meter	4300316	Zone_03_(B)	D_Building_Bulk	ZONE 3B (BULK ZONE 3B)	L3	56	52	57	94	83
D-59 Building Bulk Meter	4300317	Zone_03_(B)	D_Building_Bulk	ZONE 3B (BULK ZONE 3B)	L3	57	60	47	66	47
D-60 Building Bulk Meter	4300318	Zone_03_(B)	D_Building_Bulk	ZONE 3B (BULK ZONE 3B)	L3	56	83	86	102	91
D-61 Building Bulk Meter	4300319	Zone_03_(B)	D_Building_Bulk	ZONE 3B (BULK ZONE 3B)	L3	42	50	68	82	49
Irrigation Tank 02 (Z03)	4300320	Zone_03_(B)	IRR_Servies	ZONE 3B (BULK ZONE 3B)	L3	49	47	43	15	320
Irrigation Tank 03 (Z05)	4300321	Zone_05	IRR_Servies	ZONE 5 (Bulk Zone 5)	L3	0	0	0	0	0
Irrigation Tank 01 (Outlet)	4300322	N/A	IRR_Servies	N/A	N/A	0	0	0	0	30826
Irrigation Tank 01 (Inlet)	4300323	Direct Connection 	IRR_Servies	Main Bulk (NAMA)	DC	0	0	0	0	2
Building CIF/CB	4300324	Zone_01_(FM)	Retail	ZONE FM ( BULK ZONE FM )	L3	420	331	306	307	284
Building Nursery Building	4300325	Zone_01_(FM)	Retail	ZONE FM ( BULK ZONE FM )	L3	4	4	4	0	6
Irrigation Tank - VS	4300326	Zone_VS	IRR_Servies	Village Square (Zone Bulk)	L3	0	0	0	0	0
Coffee 1 (GF Shop No.591)	4300327	Zone_VS	Retail	Village Square (Zone Bulk)	L3	0	0	3	-3	0
Sale Centre Caffe & Bar (GF Shop No.592 A)	4300328	Zone_SC	Retail	 Sale Centre (Zone Bulk)	L3	0	2	3	5	12
Coffee 2 (GF Shop No.594 A)	4300329	Zone_VS	Retail	Village Square (Zone Bulk)	L3	2	3	5	5	5
Supermarket (FF Shop No.591)	4300330	Zone_VS	Retail	Village Square (Zone Bulk)	L3	0	0	0	0	0
Pharmacy (FF Shop No.591 A)	4300331	Zone_VS	Retail	Village Square (Zone Bulk)	L3	0	0	0	0	0
Laundry Services (FF Shop No.593)	4300332	Zone_VS	Retail	Village Square (Zone Bulk)	L3	33	25	22	0	44
Shop No.593 A	4300333	Zone_VS	Retail	Village Square (Zone Bulk)	L3	0	0	0	0	0
Hotel Main Building	4300334	Direct Connection 	Retail	Main Bulk (NAMA)	DC	18048	19482	22151	27676	26963
Village Square (Zone Bulk)	4300335	Zone_VS	Zone Bulk	Main Bulk (NAMA)	L2	14	12	21	13	21
Community Mgmt - Technical Zone, STP	4300336	Direct Connection 	MB_Common	Main Bulk (NAMA)	DC	29	37	25	35	29
Cabinet FM (CONTRACTORS OFFICE)	4300337	Zone_01_(FM)	Building	ZONE FM ( BULK ZONE FM )	L3	68	59	52	58	51
PHASE 02, MAIN ENTRANCE (Infrastructure)	4300338	Direct Connection 	MB_Common	Main Bulk (NAMA)	DC	11	8	6	7	6
Building CIF/CB (COFFEE SH)	4300339	Zone_01_(FM)	Retail	ZONE FM ( BULK ZONE FM )	L3	0	0	0	0	0
Irrigation- Controller UP	4300340	Direct Connection 	IRR_Servies	Main Bulk (NAMA)	DC	0	0	0	1000	313
Irrigation- Controller DOWN	4300341	Direct Connection 	IRR_Servies	Main Bulk (NAMA)	DC	159	239	283	411	910
ZONE 8 (Bulk Zone 8)	4300342	Zone_08	Zone Bulk	Main Bulk (NAMA)	L2	1547	1498	2605	3203	2937
ZONE 3A (Bulk Zone 3A)	4300343	Zone_03_(A)	Zone Bulk	Main Bulk (NAMA)	L2	4235	4273	3591	4041	4898
ZONE 3B (Bulk Zone 3B)	4300344	Zone_03_(B)	Zone Bulk	Main Bulk (NAMA)	L2	3256	2962	3331	2157	3093
ZONE 5 (Bulk Zone 5)	4300345	Zone_05	Zone Bulk	Main Bulk (NAMA)	L2	4267	4231	3862	3737	3849
ZONE FM ( BULK ZONE FM )	4300346	Zone_01_(FM)	Zone Bulk	Main Bulk (NAMA)	L2	2008	1740	1880	1880	1693
Al Adrak Construction	4300347	Direct Connection 	Retail	Main Bulk (NAMA)	DC	597	520	580	600	2698
Al Adrak Camp	4300348	Direct Connection 	Retail	Main Bulk (NAMA)	DC	1038	702	1161	1000	1228
Main Bulk (NAMA)	C43659	Main Bulk	Main BULK	NAMA	L1	32580	44043	34915	46039	58425
`;

const cleanLabel = (label: string): string => label.replace(/"/g, '').trim();

export function getProcessedWaterData(): ProcessedData {
    const lines = rawData.trim().split('\n');
    const header = lines[0].split('\t').map(h => h.trim());
    const monthHeaders = header.slice(6);

    const flatData: MeterReading[] = lines.slice(1).map(line => {
        const values = line.split('\t');
        const monthlyConsumption: MonthlyConsumption[] = monthHeaders.map((month, index) => ({
            month,
            consumption: parseInt(values[6 + index], 10) || 0,
        }));
        
        const totalConsumption = monthlyConsumption.reduce((sum, current) => sum + current.consumption, 0);

        return {
            meterLabel: cleanLabel(values[0]),
            accountNumber: values[1].trim(),
            id: values[1].trim(),
            zone: values[2].trim(),
            type: values[3].trim(),
            parentMeter: cleanLabel(values[4]),
            label: values[5].trim(),
            monthlyConsumption,
            totalConsumption,
            children: [],
            waterLoss: 0,
        };
    });

    const meterMap: { [key: string]: MeterReading } = {};
    flatData.forEach(meter => {
        meterMap[meter.meterLabel] = meter;
    });

    const tree: MeterReading[] = [];
    flatData.forEach(meter => {
        if (meter.parentMeter && meterMap[meter.parentMeter]) {
            meterMap[meter.parentMeter].children.push(meter);
        } else {
            // Root or orphan nodes
            tree.push(meter);
        }
    });

    let totalWaterLoss = 0;
    const calculateWaterLoss = (meter: MeterReading): number => {
        if (meter.children.length === 0) {
            meter.waterLoss = 0;
            return 0;
        }
        
        const childrenConsumption = meter.children.reduce((sum, child) => sum + child.totalConsumption, 0);
        const loss = meter.totalConsumption - childrenConsumption;
        meter.waterLoss = loss;
        totalWaterLoss += loss;
        
        meter.children.forEach(calculateWaterLoss);
        return loss;
    };

    tree.forEach(calculateWaterLoss);
    
    const rootNode = flatData.find(m => m.label === 'L1');
    const totalConsumption = rootNode ? rootNode.totalConsumption : 0;
    const topConsumer = [...flatData].sort((a, b) => b.totalConsumption - a.totalConsumption)[0] || null;

    const zoneMeters = tree.filter(m => m.label === 'L2');
    const chartData = monthHeaders.map((month, i) => {
        const monthData: { name: string; [key: string]: string | number } = { name: month };
        zoneMeters.forEach(zone => {
             monthData[zone.zone] = zone.monthlyConsumption[i].consumption;
        });
        return monthData;
    });

    return {
        tree,
        stats: {
            totalConsumption,
            totalWaterLoss,
            topConsumer,
            meterCount: flatData.length,
        },
        chartData,
        months: monthHeaders,
    };
}
