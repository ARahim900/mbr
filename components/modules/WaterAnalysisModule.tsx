import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, LabelList
} from 'recharts';
import { 
  Droplets, CalendarDays, Building, Building2, Filter, CheckCircle, AlertCircle, 
  TrendingUp, Users2, Sparkles, X, LayoutDashboard, BarChart2, Database, Home,
  Tags, Download, RotateCw
} from 'lucide-react';
import { 
  waterSystemData, 
  waterMonthsAvailable, 
  calculateWaterLoss,
  getZoneAnalysis,
  getAvailableZones,
  calculateAggregatedDataForPeriod,
} from '../../database/waterDatabase';
import GaugeChart from '../ui/GaugeChart';
import MetricCard from '../ui/MetricCard';
import ChartCard from '../ui/ChartCard';
import Button from '../ui/Button';
import MonthRangeSlider from '../ui/MonthRangeSlider';
import ModuleNavigation from '../ui/ModuleNavigation';

// Design System Colors
const COLORS = {
  primary: '#0D1A26',
  accent: '#00D2B3',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  error: '#EF4444',
  chart: ['#1E3A8A', '#2563EB', '#60A5FA', '#93C5FD', '#FF69B4', '#F08080', '#4682B4', '#32CD32', '#FF6347', '#4169E1']
};

// Custom Tooltip for modern area chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-neutral-border dark:border-gray-700">
        <p className="label font-bold text-primary dark:text-white">{`${label}`}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.stroke }}>{`${pld.name}: ${pld.value.toLocaleString()} m³`}</p>
        ))}
      </div>
    );
  }
  return null;
};

// Enhanced Custom Label with Background for Better Visibility
const renderEnhancedLabel = (props: any) => {
  const { x, y, value } = props;
  if (!value || value === 0) return null;
  
  const formattedValue = value.toLocaleString();
  const labelWidth = formattedValue.length * 6 + 12; // Approximate width calculation
  const labelHeight = 18;
  
  return (
    <g>
      {/* Background rectangle with glassmorphism effect */}
      <rect
        x={x - labelWidth/2}
        y={y - labelHeight/2 - 2}
        width={labelWidth}
        height={labelHeight}
        rx={9}
        ry={9}
        fill="rgba(255, 255, 255, 0.92)"
        stroke="rgba(156, 163, 175, 0.4)"
        strokeWidth={1}
        filter="url(#label-shadow)"
      />
      {/* Text label with better contrast */}
      <text
        x={x}
        y={y + 2}
        textAnchor="middle"
        fontSize={10}
        fontWeight="600"
        fill="#374151"
      >
        {formattedValue}
      </text>
    </g>
  );
};

// Label component for different chart types
const CustomLabelList = ({ dataKey, offset = 8 }: any) => (
  <LabelList 
    dataKey={dataKey} 
    position="top" 
    offset={offset}
    content={renderEnhancedLabel}
  />
);

// Data for "By Type" Analysis (illustrative, based on user image)
const byTypeData = {
  table: [
    { type: 'Commercial', 'Jan-25': 19590, 'Feb-25': 20970, 'Mar-25': 22151, total: 62711, percentL1: 56.2 },
    { type: 'Residential', 'Jan-25': 7277, 'Feb-25': 6849, 'Mar-25': 5783, total: 19909, percentL1: 17.9 },
    { type: 'Irrigation', 'Jan-25': 2159, 'Feb-25': 2729, 'Mar-25': 326, total: 5214, percentL1: 4.7 },
    { type: 'Common', 'Jan-25': 800, 'Feb-25': 780, 'Mar-25': 751, total: 2331, percentL1: 2.1 },
  ],
  months: ['Jan-25', 'Feb-25', 'Mar-25'],
  barChart: [
    { name: 'Commercial', 'Total Consumption': 62711, fill: '#27AE60' },
    { name: 'Residential', 'Total Consumption': 19909, fill: '#4E4456' },
    { name: 'Irrigation', 'Total Consumption': 5214, fill: '#F1C40F' },
    { name: 'Common', 'Total Consumption': 2331, fill: '#E74C3C' },
  ],
  donutChart: [
    { name: 'Commercial', value: 69.6, color: '#27AE60' },
    { name: 'Residential', value: 22.1, color: '#4E4456' },
    { name: 'Irrigation', value: 5.8, color: '#F39C12' },
    { name: 'Common', value: 2.6, color: '#E74C3C' },
  ],
};

const waterSubSections = [
    { name: 'Overview', id: 'Overview', icon: LayoutDashboard, shortName: 'Over' },
    { name: 'Water Loss Analysis', id: 'WaterLoss', icon: TrendingUp, shortName: 'Loss' },
    { name: 'Zone Analysis', id: 'ZoneAnalysis', icon: BarChart2, shortName: 'Zone' },
    { name: 'Consumption by Type', id: 'ByTypeAnalysis', icon: Tags, shortName: 'Type' },
    { name: 'Main Database', id: 'MainDatabase', icon: Database, shortName: 'Data' },
];



const WaterAnalysisModule: React.FC = () => {
  const [activeWaterSubSection, setActiveWaterSubSection] = useState('Overview');
  

  const [selectedWaterMonth, setSelectedWaterMonth] = useState('May-25');
  const [overviewDateRange, setOverviewDateRange] = useState({
    start: waterMonthsAvailable[0],
    end: waterMonthsAvailable[waterMonthsAvailable.length - 1],
  });
  const [selectedZoneForAnalysis, setSelectedZoneForAnalysis] = useState('Zone_03A');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [useRangeSelector, setUseRangeSelector] = useState(false);
  const [zoneAnalysisDateRange, setZoneAnalysisDateRange] = useState({
    start: waterMonthsAvailable[0],
    end: waterMonthsAvailable[waterMonthsAvailable.length - 1],
  });
  const [isZoneDataLoading, setIsZoneDataLoading] = useState(false);

  const [consumptionVisibility, setConsumptionVisibility] = useState({
    'L1 - Main Source': true,
    'L2 - Zone Bulk Meters': true,
    'L3 - Building/Villa Meters': true,
  });

  const [lossVisibility, setLossVisibility] = useState({
    'Stage 1 Loss': true,
    'Stage 2 Loss': true,
    'Stage 3 Loss': true,
  });

  // --- Add state for ByTypeAnalysis ---
  const [selectedType, setSelectedType] = useState('Commercial');
  const [dateRange, setDateRange] = useState({
    start: byTypeData.months[0],
    end: byTypeData.months[byTypeData.months.length - 1],
  });
  const resetByTypeDateRange = () => {
    setDateRange({
      start: byTypeData.months[0],
      end: byTypeData.months[byTypeData.months.length - 1],
    });
  };

  // Get unique types from byTypeData.table
  const uniqueTypes = useMemo(() => byTypeData.table.map(row => row.type), []);

  // Filter months based on dateRange
  const startIdx = byTypeData.months.indexOf(dateRange.start);
  const endIdx = byTypeData.months.indexOf(dateRange.end);
  const filteredMonths = byTypeData.months.slice(startIdx, endIdx + 1);

  // Filtered data for selected type and month range
  const filteredRow = useMemo(() => byTypeData.table.find(row => row.type === selectedType), [selectedType]);

  // Table data for filtered months
  const filteredTableData = useMemo(() => {
    if (!filteredRow) return [];
    return [filteredRow];
  }, [filteredRow]);

  // Monthly trend data for selected type
  const typeMonthlyTrendData = useMemo(() => {
    if (!filteredRow) return [];
    return filteredMonths.map(month => ({
      name: month,
      'Consumption': (filteredRow as any)[month] || 0,
    }));
  }, [filteredRow, filteredMonths]);

  // Calculate detailed metrics for selected type
  const typeDetailedMetrics = useMemo(() => {
    if (!filteredRow) return null;
    
    const monthlyConsumption = filteredMonths.map(month => (filteredRow as any)[month] || 0);
    const totalConsumption = monthlyConsumption.reduce((sum, val) => sum + val, 0);
    const avgMonthlyConsumption = totalConsumption / filteredMonths.length;
    const maxMonth = filteredMonths[monthlyConsumption.indexOf(Math.max(...monthlyConsumption))];
    const minMonth = filteredMonths[monthlyConsumption.indexOf(Math.min(...monthlyConsumption))];
    const maxConsumption = Math.max(...monthlyConsumption);
    const minConsumption = Math.min(...monthlyConsumption);
    
    return {
      totalConsumption,
      avgMonthlyConsumption,
      maxMonth,
      minMonth,
      maxConsumption,
      minConsumption,
      percentOfL1: filteredRow.percentL1,
      monthlyGrowth: monthlyConsumption.length > 1 ? 
        ((monthlyConsumption[monthlyConsumption.length - 1] - monthlyConsumption[0]) / monthlyConsumption[0]) * 100 : 0
    };
  }, [filteredRow, filteredMonths]);

  // Bar chart data for filtered type


  // Donut chart data for filtered type
  const filteredDonutChartData = useMemo(() => {
    return byTypeData.donutChart.filter(row => row.name === selectedType);
  }, [selectedType]);

  const toggleVisibility = (setter: React.Dispatch<React.SetStateAction<any>>, key: string) => {
    setter((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };
  
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedZoneForAnalysis, activeWaterSubSection]);

  // For single-month analysis on tabs other than Overview
  const waterCalculations = useMemo(() => {
    return calculateWaterLoss(selectedWaterMonth);
  }, [selectedWaterMonth]);

  // For date-range analysis on the Overview tab
  const overviewCalculations = useMemo(() => {
    return calculateAggregatedDataForPeriod(overviewDateRange.start, overviewDateRange.end);
  }, [overviewDateRange]);

  const monthlyWaterTrendData = useMemo(() => {
    return waterMonthsAvailable.map(month => {
      const { A1_supply, L2_total, L3_total } = calculateWaterLoss(month);
      return {
        name: month,
        'L1 - Main Source': A1_supply,
        'L2 - Zone Bulk Meters': L2_total,
        'L3 - Building/Villa Meters': L3_total,
      };
    });
  }, []);

  const lossTrendData = useMemo(() => {
    return waterMonthsAvailable.map(month => {
      const { stage1Loss, stage2Loss, stage3Loss, totalLoss } = calculateWaterLoss(month);
      return {
        name: month,
        'Stage 1 Loss': stage1Loss,
        'Stage 2 Loss': stage2Loss,
        'Stage 3 Loss': stage3Loss,
        'Total Loss': totalLoss,
      };
    });
  }, []);



  // Optimized zone analysis data calculation with loading state
  const zoneAnalysisData = useMemo(() => {
    if (!selectedZoneForAnalysis) return null;
    
    // Set loading state
    setIsZoneDataLoading(true);
    
    try {
      if (useRangeSelector) {
        // Optimized range selector logic
        const startIndex = waterMonthsAvailable.indexOf(zoneAnalysisDateRange.start);
        const endIndex = waterMonthsAvailable.indexOf(zoneAnalysisDateRange.end);
        
        if (startIndex === -1 || endIndex === -1) {
          setIsZoneDataLoading(false);
          return null;
        }
        
        const monthsInRange = waterMonthsAvailable.slice(startIndex, endIndex + 1);
        
        // Get first month analysis for structure
        const firstAnalysis = getZoneAnalysis(selectedZoneForAnalysis, monthsInRange[0]);
        if (!firstAnalysis) {
          setIsZoneDataLoading(false);
          return null;
        }
        
        // Aggregate data more efficiently
        let totalZoneBulk = 0;
        let totalIndividual = 0;
        let totalBuilding = 0;
        let totalVilla = 0;
        let totalOther = 0;
        
        // Process each month
        monthsInRange.forEach(month => {
          const monthAnalysis = getZoneAnalysis(selectedZoneForAnalysis, month);
          if (monthAnalysis) {
            totalZoneBulk += monthAnalysis.zoneBulkConsumption || 0;
            totalIndividual += monthAnalysis.totalIndividualConsumption || 0;
            
            if (monthAnalysis.hasBuildings) {
              totalBuilding += monthAnalysis.totalBuildingConsumption || 0;
              totalVilla += monthAnalysis.totalVillaConsumption || 0;
              totalOther += monthAnalysis.totalOtherConsumption || 0;
            }
          }
        });
        
        // Create aggregated result
        const aggregatedData = {
          ...firstAnalysis,
          zoneBulkConsumption: totalZoneBulk,
          totalIndividualConsumption: totalIndividual,
          totalBuildingConsumption: totalBuilding,
          totalVillaConsumption: totalVilla,
          totalOtherConsumption: totalOther,
          difference: totalZoneBulk - totalIndividual,
          lossPercentage: totalZoneBulk > 0 ? ((totalZoneBulk - totalIndividual) / totalZoneBulk) * 100 : 0,
          efficiency: totalZoneBulk > 0 ? (totalIndividual / totalZoneBulk) * 100 : 0,
          dateRange: `${zoneAnalysisDateRange.start} to ${zoneAnalysisDateRange.end}`,
          monthsCount: monthsInRange.length
        };
        
        setIsZoneDataLoading(false);
        return aggregatedData;
      } else {
        // Single month selector
        const data = getZoneAnalysis(selectedZoneForAnalysis, selectedWaterMonth);
        setIsZoneDataLoading(false);
        return data;
      }
    } catch (error) {
      console.error('Error calculating zone analysis data:', error);
      setIsZoneDataLoading(false);
      return null;
    }
  }, [selectedZoneForAnalysis, selectedWaterMonth, useRangeSelector, zoneAnalysisDateRange]);

  // Optimized reset functions
  const resetDateRange = useCallback(() => {
    setOverviewDateRange({
      start: waterMonthsAvailable[0],
      end: waterMonthsAvailable[waterMonthsAvailable.length - 1],
    });
  }, []);

  const resetZoneFilters = useCallback(() => {
    setSelectedWaterMonth('May-25');
    setSelectedZoneForAnalysis('Zone_03A');
    setZoneAnalysisDateRange({
      start: waterMonthsAvailable[0],
      end: waterMonthsAvailable[waterMonthsAvailable.length - 1],
    });
  }, []);

  const handleAiAnalysis = async () => {
    setIsAiModalOpen(true);
    setIsAiLoading(true);
    setAiAnalysisResult("");
        
    setTimeout(() => {
      const {period, ...calcs} = overviewCalculations;
      setAiAnalysisResult(`🚀 4-Level Water Distribution Analysis for ${period}

📊 HIERARCHICAL WATER DISTRIBUTION TOTALS:

Level A1 (L1): Main water source from NAMA
• Supply: ${calcs.A1_supply.toLocaleString()} m³

Level A2 (L2 + DC): Zone distribution network  
• Total Distribution: ${calcs.A2_total.toLocaleString()} m³

Level A3 (L3): Building level distribution
• Total Building Level: ${calcs.A3_total.toLocaleString()} m³ 

Level A4 (L4 + L3 end users): Final consumption
• Total Consumption: ${calcs.A4_total.toLocaleString()} m³

💧 MULTI-STAGE LOSS ANALYSIS (Total for Period):

Stage 1 Loss: Main distribution (A1 → A2)
• Loss: ${calcs.stage1Loss.toFixed(0)} m³ (${calcs.stage1LossPercent.toFixed(1)}%)

Stage 2 Loss: Zone distribution (L2 → L3)  
• Loss: ${calcs.stage2Loss.toFixed(0)} m³ (${calcs.stage2LossPercent.toFixed(1)}%)

Stage 3 Loss: Building distribution (A3 → A4)
• Loss: ${calcs.stage3Loss.toFixed(0)} m³ (${calcs.stage3LossPercent.toFixed(1)}%)

Total System Loss: Overall efficiency
• Total Variance: ${calcs.totalLoss.toFixed(0)} m³ (${Math.abs(calcs.totalLossPercent).toFixed(1)}%)
• System Efficiency: ${calcs.systemEfficiency.toFixed(1)}%

🎯 KEY INSIGHTS FOR THE PERIOD:

• Critical Observations:
  ${calcs.totalLossPercent > 25 ? '- High total water loss detected - immediate investigation required.' : 
    calcs.totalLossPercent > 15 ? '- Moderate water loss - consider infrastructure review.' : 
    '- Water loss within acceptable range.'}
  ${calcs.stage1LossPercent > 10 ? '\n  - Significant loss in the main distribution network.' : ''}
  ${calcs.stage2LossPercent > 15 ? '\n  - High zone distribution loss suggests issues in zone networks.' : ''}
  ${calcs.stage3LossPercent > 15 ? '\n  - Building level losses need attention.' : ''}

📈 RECOMMENDATIONS:

1. ${calcs.stage2LossPercent > 20 ? 'URGENT: Investigate zone distribution networks for leaks or meter inaccuracies.' :
     calcs.stage2LossPercent > 10 ? 'Schedule zone infrastructure inspection.' :
     'Continue regular zone maintenance.'}

2. ${calcs.stage3LossPercent > 20 ? 'Prioritize review of building plumbing systems with highest consumption.' :
     'Building distribution is performing adequately.'}

3. System Efficiency:
   - System efficiency is at ${calcs.systemEfficiency.toFixed(1)}%. 
   - ${calcs.systemEfficiency < 80 ? 'Implement conservation measures and perform system-wide audit.' : 'Maintain current practices and monitoring.'}

💡 SYSTEM PERFORMANCE: ${calcs.systemEfficiency > 85 ? 'EXCELLENT' : 
                        calcs.systemEfficiency > 75 ? 'GOOD' : 
                        calcs.systemEfficiency > 65 ? 'FAIR' : 'NEEDS IMPROVEMENT'}`);
      setIsAiLoading(false);
    }, 1500);
  };

  // Handle range selector toggle with optimization
  const handleRangeSelectorToggle = useCallback(() => {
    setUseRangeSelector(prev => !prev);
    // Reset page when switching modes
    setCurrentPage(1);
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <h2 
        className="text-3xl font-bold text-primary dark:text-white"
        data-aos="fade-down"
        data-aos-duration="800"
      >
        Water System Analysis
      </h2>
      <ModuleNavigation 
        sections={waterSubSections}
        activeSection={activeWaterSubSection}
        onSectionChange={setActiveWaterSubSection}
      />
      
      {activeWaterSubSection === 'Overview' && (
        <>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6 border border-neutral-border dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="md:col-span-1">
                      <MonthRangeSlider 
                          months={waterMonthsAvailable} 
                          value={overviewDateRange} 
                          onChange={setOverviewDateRange}
                      />
                  </div>
                  <div className="md:col-span-1 flex flex-col gap-4">
                      <Button onClick={resetDateRange} className="bg-secondary hover:bg-primary-light text-white flex items-center justify-center gap-2 h-10">
                          <RotateCw size={16} />
                          Reset Range
                      </Button>
                      <Button 
                          onClick={handleAiAnalysis}
                          className="bg-accent hover:bg-opacity-80 text-white flex items-center justify-center gap-2 h-10 shadow-lg transform hover:scale-105 transition-all duration-300"
                          disabled={isAiLoading}
                      >
                          <Sparkles className="w-5 h-5" />
                          {isAiLoading ? 'Analyzing...' : 'AI Analysis'}
                      </Button>
                  </div>
              </div>
          </div>
          <div 
            className="mb-4"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="200"
          >
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 transition-colors duration-300">
              4-Level Water Distribution Totals for <span className="text-accent">{overviewCalculations.period}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                title="A1 - Main Source (L1)" 
                value={overviewCalculations.A1_supply.toLocaleString()} 
                unit="m³" 
                icon={Droplets} 
                subtitle="Main Bulk (NAMA)" 
                iconColor="text-blue-600" 
              />
              <MetricCard 
                title="A2 - Zone Distribution" 
                value={overviewCalculations.A2_total.toLocaleString()} 
                unit="m³" 
                icon={Building} 
                subtitle="L2 Zone Bulk + Direct" 
                iconColor="text-yellow-600" 
              />
              <MetricCard 
                title="A3 - Building Level" 
                value={overviewCalculations.A3_total.toLocaleString()} 
                unit="m³" 
                icon={Building2} 
                subtitle="L3 Buildings + Villas" 
                iconColor="text-green-600" 
              />
              <MetricCard 
                title="A4 - End Users" 
                value={overviewCalculations.A4_total.toLocaleString()} 
                unit="m³" 
                icon={Users2} 
                subtitle="L4 Apartments + L3 End" 
                iconColor="text-purple-600" 
              />
            </div>
          </div>
          <div 
            className="mb-6"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="400"
          >
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 transition-colors duration-300">
              Multi-Stage Water Loss Totals for <span className="text-accent">{overviewCalculations.period}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                title="Stage 1 Loss (A1→A2)" 
                value={Math.abs(overviewCalculations.stage1Loss).toFixed(0)} 
                unit="m³" 
                icon={AlertCircle} 
                subtitle={`Main Distribution: ${Math.abs(overviewCalculations.stage1LossPercent).toFixed(1)}%`} 
                iconColor={overviewCalculations.stage1Loss < 0 ? "text-orange-600" : "text-red-600"} 
              />
              <MetricCard 
                title="Stage 2 Loss (L2→L3)" 
                value={Math.abs(overviewCalculations.stage2Loss).toFixed(0)} 
                unit="m³" 
                icon={TrendingUp} 
                subtitle={`Zone Networks: ${Math.abs(overviewCalculations.stage2LossPercent).toFixed(1)}%`} 
                iconColor="text-orange-600" 
              />
              <MetricCard 
                title="Stage 3 Loss (A3→A4)" 
                value={Math.abs(overviewCalculations.stage3Loss).toFixed(0)} 
                unit="m³" 
                icon={Building2} 
                subtitle={`Building Networks: ${Math.abs(overviewCalculations.stage3LossPercent).toFixed(1)}%`} 
                iconColor="text-yellow-600" 
              />
              <MetricCard 
                title="Total System Loss" 
                value={Math.abs(overviewCalculations.totalLoss).toFixed(0)} 
                unit="m³" 
                icon={CheckCircle} 
                subtitle={`Overall: ${Math.abs(overviewCalculations.totalLossPercent).toFixed(1)}%`} 
                iconColor={Math.abs(overviewCalculations.totalLossPercent) > 20 ? "text-red-600" : "text-green-600"} 
              />
            </div>
          </div>

           <div 
             className="grid grid-cols-1 gap-6 mb-6"
             data-aos="fade-up"
             data-aos-duration="800"
             data-aos-delay="600"
           >
                <ChartCard title="Monthly Consumption Trend" subtitle="L1 Supply vs. L2 & L3 Meter Totals">
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {Object.keys(consumptionVisibility).map((key, index) => (
                            <button
                                key={key}
                                onClick={() => toggleVisibility(setConsumptionVisibility, key)}
                                className={`flex items-center space-x-2 text-xs font-semibold py-1 px-3 rounded-full transition-all duration-200 ${
                                    consumptionVisibility[key as keyof typeof consumptionVisibility] ? 'text-white shadow' : 'text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                                style={{ backgroundColor: consumptionVisibility[key as keyof typeof consumptionVisibility] ? COLORS.chart[index] : undefined }}
                            >
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.chart[index] }}></div>
                                <span>{key}</span>
                            </button>
                        ))}
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyWaterTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorL1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.chart[0]} stopOpacity={0.8}/><stop offset="95%" stopColor={COLORS.chart[0]} stopOpacity={0}/></linearGradient>
                                <linearGradient id="colorL2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.chart[1]} stopOpacity={0.8}/><stop offset="95%" stopColor={COLORS.chart[1]} stopOpacity={0}/></linearGradient>
                                <linearGradient id="colorL3" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.chart[2]} stopOpacity={0.8}/><stop offset="95%" stopColor={COLORS.chart[2]} stopOpacity={0}/></linearGradient>
                                {/* Enhanced label shadow filter */}
                                <filter id="label-shadow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.1)" />
                                </filter>
                            </defs>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            
                            {consumptionVisibility['L1 - Main Source'] && <Area type="monotone" dataKey="L1 - Main Source" stroke={COLORS.chart[0]} fillOpacity={1} fill="url(#colorL1)" strokeWidth={2}>
                                <CustomLabelList dataKey="L1 - Main Source" fill={COLORS.chart[0]} offset={12} />
                            </Area>}

                            {consumptionVisibility['L2 - Zone Bulk Meters'] && <Area type="monotone" dataKey="L2 - Zone Bulk Meters" stroke={COLORS.chart[1]} fillOpacity={1} fill="url(#colorL2)" strokeWidth={2}>
                                <CustomLabelList dataKey="L2 - Zone Bulk Meters" fill={COLORS.chart[1]} offset={12} />
                            </Area>}

                            {consumptionVisibility['L3 - Building/Villa Meters'] && <Area type="monotone" dataKey="L3 - Building/Villa Meters" stroke={COLORS.chart[2]} fillOpacity={1} fill="url(#colorL3)" strokeWidth={2}>
                                <CustomLabelList dataKey="L3 - Building/Villa Meters" fill={COLORS.chart[2]} offset={12} />
                            </Area>}
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Monthly Water Loss Trend" subtitle="Comparing loss at different stages of distribution">
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {Object.keys(lossVisibility).map((key, index) => (
                            <button
                                key={key}
                                onClick={() => toggleVisibility(setLossVisibility, key)}
                                className={`flex items-center space-x-2 text-xs font-semibold py-1 px-3 rounded-full transition-all duration-200 ${
                                    lossVisibility[key as keyof typeof lossVisibility] ? 'text-white shadow' : 'text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                                style={{ backgroundColor: lossVisibility[key as keyof typeof lossVisibility] ? ['#991B1B', '#DC2626', '#F87171'][index] : undefined }}
                            >
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#991B1B', '#DC2626', '#F87171'][index] }}></div>
                                <span>{key}</span>
                            </button>
                        ))}
                    </div>
                     <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={lossTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorS1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={'#991B1B'} stopOpacity={0.8}/><stop offset="95%" stopColor={'#991B1B'} stopOpacity={0}/></linearGradient>
                                <linearGradient id="colorS2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={'#DC2626'} stopOpacity={0.8}/><stop offset="95%" stopColor={'#DC2626'} stopOpacity={0}/></linearGradient>
                                <linearGradient id="colorS3" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={'#F87171'} stopOpacity={0.8}/><stop offset="95%" stopColor={'#F87171'} stopOpacity={0}/></linearGradient>
                            </defs>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            
                            {lossVisibility['Stage 1 Loss'] && <Area type="monotone" dataKey="Stage 1 Loss" stroke={'#991B1B'} fillOpacity={1} fill="url(#colorS1)" strokeWidth={2}>
                                <CustomLabelList dataKey="Stage 1 Loss" fill={'#991B1B'} offset={12} />
                            </Area>}

                            {lossVisibility['Stage 2 Loss'] && <Area type="monotone" dataKey="Stage 2 Loss" stroke={'#DC2626'} fillOpacity={1} fill="url(#colorS2)" strokeWidth={2}>
                                <CustomLabelList dataKey="Stage 2 Loss" fill={'#DC2626'} offset={12} />
                            </Area>}
                            
                            {lossVisibility['Stage 3 Loss'] && <Area type="monotone" dataKey="Stage 3 Loss" stroke={'#F87171'} fillOpacity={1} fill="url(#colorS3)" strokeWidth={2}>
                                <CustomLabelList dataKey="Stage 3 Loss" fill={'#F87171'} offset={12} />
                            </Area>}
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </>
      )}

      {activeWaterSubSection === 'WaterLoss' && (
        <ChartCard title="4-Level Water System Balance" subtitle={`Hierarchical flow analysis for ${selectedWaterMonth}`}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title="Monthly Water Distribution Trend" subtitle="Consumption at each level of the hierarchy">
                  <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={monthlyWaterTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                              <linearGradient id="colorA1" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={'#2563EB'} stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor={'#2563EB'} stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorA2" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={'#3B82F6'} stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor={'#3B82F6'} stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorA3" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={'#60A5FA'} stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor={'#60A5FA'} stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Area type="monotone" dataKey="L1 - Main Source" stroke={'#2563EB'} fillOpacity={1} fill="url(#colorA1)" />
                          <Area type="monotone" dataKey="L2 - Zone Bulk Meters" stroke={'#3B82F6'} fillOpacity={1} fill="url(#colorA2)" />
                          <Area type="monotone" dataKey="L3 - Building/Villa Meters" stroke={'#60A5FA'} fillOpacity={1} fill="url(#colorA3)" />
                      </AreaChart>
                  </ResponsiveContainer>
              </ChartCard>
              <div className="grid grid-cols-2 gap-4">
                    <GaugeChart
                      percentage={Math.abs(waterCalculations.stage1LossPercent)}
                      value={waterCalculations.stage1Loss}
                      title="Stage 1 Loss"
                      subtitle="Main Distribution"
                      color={'#991B1B'}
                  />
                  <GaugeChart
                      percentage={Math.abs(waterCalculations.stage2LossPercent)}
                      value={waterCalculations.stage2Loss}
                      title="Stage 2 Loss"
                      subtitle="Zone Networks"
                      color={'#DC2626'}
                  />
                  <GaugeChart
                      percentage={Math.abs(waterCalculations.stage3LossPercent)}
                      value={waterCalculations.stage3Loss}
                      title="Stage 3 Loss"
                      subtitle="Building Networks"
                      color={'#F87171'}
                  />
                  <GaugeChart
                      percentage={waterCalculations.systemEfficiency}
                      value={waterCalculations.A4_total}
                      title="System Efficiency"
                      subtitle="Overall Performance"
                      color={COLORS.success}
                  />
              </div>
            </div>
        </ChartCard>
      )}
      
      {activeWaterSubSection === 'ZoneAnalysis' && (
        <>
          {/* Zone Analysis Filter - Optimized */}
          <div className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg mb-6 print:hidden border border-neutral-border dark:border-gray-600">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Options</h3>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Range Selection</label>
                <button
                  onClick={handleRangeSelectorToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                    useRangeSelector ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    useRangeSelector ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
            
            {useRangeSelector ? (
              <div className="space-y-4">
                <MonthRangeSlider 
                  months={waterMonthsAvailable} 
                  value={zoneAnalysisDateRange} 
                  onChange={setZoneAnalysisDateRange}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Filter by Zone</label>
                    <div className="relative">
                      <select
                        value={selectedZoneForAnalysis} 
                        onChange={(e) => setSelectedZoneForAnalysis(e.target.value)} 
                        className="appearance-none w-full p-2.5 pr-10 border border-neutral-border dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                      >
                        {getAvailableZones().map(zone => ( 
                          <option key={zone.key} value={zone.key}>{zone.name}</option> 
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                        <Building size={16} />
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={resetZoneFilters}
                    className="bg-primary dark:bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 h-[46px] w-full hover:shadow-lg" 
                  > 
                    <Filter size={16}/> 
                    <span>Reset Filters</span> 
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Select Month</label>
                  <div className="relative">
                    <select
                      value={selectedWaterMonth} 
                      onChange={(e) => setSelectedWaterMonth(e.target.value)} 
                      className="appearance-none w-full p-2.5 pr-10 border border-neutral-border dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      {waterMonthsAvailable.map(month => ( 
                        <option key={month} value={month}>{month}</option> 
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                      <CalendarDays size={16} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Filter by Zone</label>
                  <div className="relative">
                    <select
                      value={selectedZoneForAnalysis} 
                      onChange={(e) => setSelectedZoneForAnalysis(e.target.value)} 
                      className="appearance-none w-full p-2.5 pr-10 border border-neutral-border dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      {getAvailableZones().map(zone => ( 
                        <option key={zone.key} value={zone.key}>{zone.name}</option> 
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                      <Building size={16} />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={resetZoneFilters}
                  className="bg-primary dark:bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 h-[46px] w-full hover:shadow-lg" 
                > 
                  <Filter size={16}/> 
                  <span>Reset Filters</span> 
                </button>
              </div>
            )}
          </div>

          {/* Zone Analysis Data Display - Optimized Loading State */}
          {isZoneDataLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading zone analysis data...</p>
              </div>
            </div>
          ) : !zoneAnalysisData ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
              <p className="text-red-600 dark:text-red-400">
                No data available for the selected zone and {useRangeSelector ? 'date range' : 'month'} combination.
              </p>
            </div>
          ) : (
            <>
              {/* Zone Analysis Header */}
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {zoneAnalysisData.zone?.name || 'Zone'} Analysis for {
                    useRangeSelector ? `${zoneAnalysisDateRange.start} to ${zoneAnalysisDateRange.end}` : selectedWaterMonth
                  }
                  {useRangeSelector && (
                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400 block mt-1">
                      ({(() => {
                        const startIndex = waterMonthsAvailable.indexOf(zoneAnalysisDateRange.start);
                        const endIndex = waterMonthsAvailable.indexOf(zoneAnalysisDateRange.end);
                        return endIndex - startIndex + 1;
                      })()} months aggregated)
                    </span>
                  )}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {zoneAnalysisData.isDirectConnection ? 
                    'Direct connection meters analysis with Main Bulk reference' : 
                    zoneAnalysisData.hasBuildings ?
                    'Zone with building bulk meters and individual villas' :
                    'Zone bulk vs individual meters consumption analysis'
                  }
                </p>
              </div>

              {/* Gauge Charts Section - RESTORED */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Water Consumption Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-neutral-border dark:border-gray-600">
                  {zoneAnalysisData.isDirectConnection ? (
                    <>
                      {/* For Direct Connection - show Main Bulk vs Direct Connections */}
                      <GaugeChart
                        percentage={100}
                        value={zoneAnalysisData.zoneBulkConsumption}
                        title="Main Bulk (NAMA)"
                        subtitle="Total Water Supply"
                        color="#1D4ED8"
                        size={140}
                      />
                      <GaugeChart
                        percentage={zoneAnalysisData.mainBulkUsagePercent || 0}
                        value={zoneAnalysisData.totalIndividualConsumption}
                        title="Direct Connections"
                        subtitle="Total DC Consumption"
                        color="#3B82F6"
                        size={140}
                      />
                      <GaugeChart
                        percentage={100 - (zoneAnalysisData.mainBulkUsagePercent || 0)}
                        value={zoneAnalysisData.zoneBulkConsumption - zoneAnalysisData.totalIndividualConsumption}
                        title="Other Zones Usage"
                        subtitle="Remaining Consumption"
                        color="#6b7280"
                        size={140}
                      />
                    </>
                  ) : (
                    <>
                      {/* For all zones - show Zone Bulk, Sum of Individual Meters, and Water Loss */}
                      <GaugeChart
                        percentage={100}
                        value={zoneAnalysisData.zoneBulkConsumption}
                        title="Zone Bulk Meter"
                        subtitle={`${zoneAnalysisData.zone.name} Total`}
                        color="#1D4ED8"
                        size={140}
                      />
                      <GaugeChart
                        percentage={zoneAnalysisData.zoneBulkConsumption > 0 ? 
                          (zoneAnalysisData.totalIndividualConsumption / zoneAnalysisData.zoneBulkConsumption) * 100 : 0}
                        value={zoneAnalysisData.totalIndividualConsumption}
                        title="Individual Meters Sum"
                        subtitle="Total Consumption"
                        color="#3B82F6"
                        size={140}
                      />
                      <GaugeChart
                        percentage={Math.abs(zoneAnalysisData.lossPercentage)}
                        value={Math.abs(zoneAnalysisData.difference)}
                        title="Water Loss"
                        subtitle="Distribution Loss"
                        color="#EF4444"
                        size={140}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Zone Consumption Trend Chart */}
              <div className="mb-8">
                <ChartCard title="Zone Consumption Trend" subtitle="Monthly comparison of zone bulk meter vs individual meters total">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={(() => {
                      // Generate trend data for all months
                      return waterMonthsAvailable.map(month => {
                        const monthAnalysis = getZoneAnalysis(selectedZoneForAnalysis, month);
                        return {
                          name: month,
                          'Zone Bulk': monthAnalysis?.zoneBulkConsumption || 0,
                          'Individual Total': monthAnalysis?.totalIndividualConsumption || 0,
                          'Water Loss': Math.abs((monthAnalysis?.zoneBulkConsumption || 0) - (monthAnalysis?.totalIndividualConsumption || 0))
                        };
                      });
                    })()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorZoneBulk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorIndividual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area type="monotone" dataKey="Zone Bulk" stroke="#1D4ED8" fillOpacity={1} fill="url(#colorZoneBulk)" />
                      <Area type="monotone" dataKey="Individual Total" stroke="#3B82F6" fillOpacity={1} fill="url(#colorIndividual)" />
                      <Area type="monotone" dataKey="Water Loss" stroke="#EF4444" fillOpacity={1} fill="url(#colorLoss)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Zone Summary Cards - Keep existing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard 
                  title={zoneAnalysisData.isDirectConnection ? "Main Source Total" : "Zone Bulk Meter"} 
                  value={zoneAnalysisData.zoneBulkConsumption.toLocaleString()} 
                  unit="m³" 
                  icon={Droplets} 
                  subtitle={zoneAnalysisData.zone.name} 
                  iconColor="text-blue-600" 
                />
                <MetricCard 
                  title="Individual Meters Total" 
                  value={zoneAnalysisData.totalIndividualConsumption.toLocaleString()} 
                  unit="m³" 
                  icon={Building2} 
                  subtitle={`${
                    zoneAnalysisData.hasBuildings 
                      ? `${(zoneAnalysisData.buildingBulkData || []).length} buildings, ${(zoneAnalysisData.villaData || []).length} villas`
                      : `${(zoneAnalysisData.individualMetersData || []).length} meters`
                  }`} 
                  iconColor="text-green-600" 
                />
                <MetricCard 
                  title="Water Loss/Variance" 
                  value={Math.abs(zoneAnalysisData.difference).toFixed(0)} 
                  unit="m³" 
                  icon={TrendingUp} 
                  subtitle={`${Math.abs(zoneAnalysisData.lossPercentage).toFixed(1)}% variance`} 
                  iconColor={zoneAnalysisData.difference < 0 ? "text-orange-600" : "text-red-600"} 
                />
                <MetricCard 
                  title="Zone Efficiency" 
                  value={`${zoneAnalysisData.efficiency.toFixed(1)}%`} 
                  unit="" 
                  icon={CheckCircle} 
                  subtitle="Meter coverage" 
                  iconColor={zoneAnalysisData.efficiency > 90 ? "text-green-600" : "text-yellow-600"} 
                />
              </div>

              {/* Zone Analysis Table - Simplified for Range Selection */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-neutral-border dark:border-gray-600">
                <div className="p-6 border-b border-neutral-border dark:border-gray-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Individual Meters - {zoneAnalysisData.zone.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {useRangeSelector ? 
                          `Aggregated consumption data for ${(() => {
                            const startIndex = waterMonthsAvailable.indexOf(zoneAnalysisDateRange.start);
                            const endIndex = waterMonthsAvailable.indexOf(zoneAnalysisDateRange.end);
                            return endIndex - startIndex + 1;
                          })()} months` :
                          `All individual meters in this ${zoneAnalysisData.isDirectConnection ? 'connection group' : 'zone'} with monthly consumption data`
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-200 sticky left-0 bg-gray-50 dark:bg-gray-700 z-10">Meter Label</th>
                        <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-200">Account #</th>
                        <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-200">Type</th>
                        {useRangeSelector ? (
                          <>
                            <th className="text-right p-4 font-semibold text-gray-700 dark:text-gray-200">Period Total</th>
                            <th className="text-right p-4 font-semibold text-gray-700 dark:text-gray-200">Avg/Month</th>
                          </>
                        ) : (
                          <>
                            <th className="text-right p-4 font-semibold text-gray-700 dark:text-gray-200">Jan-25</th>
                            <th className="text-right p-4 font-semibold text-gray-700 dark:text-gray-200">Feb-25</th>
                            <th className="text-right p-4 font-semibold text-gray-700 dark:text-gray-200">Mar-25</th>
                            <th className="text-right p-4 font-semibold text-gray-700 dark:text-gray-200">Apr-25</th>
                            <th className="text-right p-4 font-semibold text-gray-700 dark:text-gray-200">May-25</th>
                            <th className="text-right p-4 font-semibold text-gray-700 dark:text-gray-200">Total</th>
                          </>
                        )}
                        <th className="text-center p-4 font-semibold text-gray-700 dark:text-gray-200">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Zone Bulk Meter Row (if not Direct Connection) */}
                      {!zoneAnalysisData.isDirectConnection && zoneAnalysisData.zone.bulk && (
                        <tr className="border-b border-neutral-border dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                          <td className="p-4 font-semibold text-blue-800 dark:text-blue-200 sticky left-0 bg-blue-50 dark:bg-blue-900/20">{zoneAnalysisData.zone.bulk}</td>
                          <td className="p-4 text-blue-700 dark:text-blue-300">{zoneAnalysisData.zone.bulkAccount}</td>
                          <td className="p-4 text-blue-700 dark:text-blue-300">Zone Bulk</td>
                          {useRangeSelector ? (
                            <>
                              <td className="p-4 text-right font-bold text-blue-800 dark:text-blue-200">
                                {zoneAnalysisData.zoneBulkConsumption.toLocaleString()}
                              </td>
                              <td className="p-4 text-right font-semibold text-blue-800 dark:text-blue-200">
                                {(() => {
                                  const startIndex = waterMonthsAvailable.indexOf(zoneAnalysisDateRange.start);
                                  const endIndex = waterMonthsAvailable.indexOf(zoneAnalysisDateRange.end);
                                  const monthsCount = endIndex - startIndex + 1;
                                  return (zoneAnalysisData.zoneBulkConsumption / monthsCount).toFixed(0).toLocaleString();
                                })()}
                              </td>
                            </>
                          ) : (
                            <>
                              {waterMonthsAvailable.map(month => {
                                const zoneBulkMeter = waterSystemData.find(item => item.meterLabel === zoneAnalysisData.zone.bulk);
                                return (
                                  <td key={month} className="p-4 text-right font-semibold text-blue-800 dark:text-blue-200">
                                    {(zoneBulkMeter?.consumption[month] || 0).toLocaleString()}
                                  </td>
                                );
                              })}
                              <td className="p-4 text-right font-bold text-blue-800 dark:text-blue-200">
                                {(() => {
                                  const zoneBulkMeter = waterSystemData.find(item => item.meterLabel === zoneAnalysisData.zone.bulk);
                                  return (zoneBulkMeter?.totalConsumption || 0).toLocaleString();
                                })()}
                              </td>
                            </>
                          )}
                          <td className="p-4 text-center">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              L2 - Zone Bulk
                            </span>
                          </td>
                        </tr>
                      )}
                      
                      {/* All Individual Meters - Simplified for Performance */}
                      {(() => {
                        // Get all meters based on zone type
                        let allMeters: any[] = [];
                        
                        if (zoneAnalysisData.hasBuildings) {
                          // For zones with buildings (Zone 3A, 3B)
                          const buildingRows: any[] = [];
                          (zoneAnalysisData.buildingBulkData || []).forEach((building: any) => {
                            const buildingMeterData = building.meterData || waterSystemData.find(item => item.acctNo === building.account);
                            
                            // Add the building bulk meter
                            buildingRows.push({
                              ...building,
                              consumption: buildingMeterData?.consumption || {},
                              totalConsumption: buildingMeterData?.totalConsumption || 0,
                              isBuilding: true
                            });
                          });
                          
                          // Then add villas and other meters
                          allMeters = [
                            ...buildingRows,
                            ...(zoneAnalysisData.villaData || []).map((villa: any) => {
                              const villaData = villa.meterData || waterSystemData.find(item => item.acctNo === villa.account);
                              return {
                                ...villa,
                                consumption: villaData?.consumption || {},
                                totalConsumption: villaData?.totalConsumption || 0
                              };
                            })
                          ];
                        } else {
                          // For regular zones
                          allMeters = (zoneAnalysisData.individualMetersData || []).map((meter: any) => {
                            const meterDataFromDB = meter.meterData || waterSystemData.find(item => item.acctNo === meter.account);
                            return {
                              ...meter,
                              consumption: meterDataFromDB?.consumption || {},
                              totalConsumption: meterDataFromDB?.totalConsumption || 0
                            };
                          });
                        }
                        
                        return allMeters
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .map((meter: any) => {
                            const currentMonthConsumption = meter.consumption[selectedWaterMonth] || 0;
                            // const percentage = zoneAnalysisData.isDirectConnection ? 
                            //   (zoneAnalysisData.totalIndividualConsumption > 0 ? (currentMonthConsumption / zoneAnalysisData.totalIndividualConsumption) * 100 : 0) :
                            //   (zoneAnalysisData.zoneBulkConsumption > 0 ? (currentMonthConsumption / zoneAnalysisData.zoneBulkConsumption) * 100 : 0);
                            
                            return (
                              <tr key={meter.account} className={`border-b border-neutral-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                meter.isBuilding ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                              }`}>
                                <td className={`p-4 font-medium text-gray-800 dark:text-gray-200 sticky left-0 ${
                                  meter.isBuilding ? 'bg-purple-50 dark:bg-purple-900/20' : 
                                  'bg-white dark:bg-gray-800'
                                }`}>
                                  {meter.label}
                                </td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{meter.account}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{meter.type}</td>
                                {useRangeSelector ? (
                                  <>
                                    <td className="p-4 text-right font-bold text-gray-800 dark:text-gray-200">
                                      {meter.totalConsumption?.toLocaleString() || '0'}
                                    </td>
                                    <td className="p-4 text-right text-gray-800 dark:text-gray-200">
                                      {(() => {
                                        const startIndex = waterMonthsAvailable.indexOf(zoneAnalysisDateRange.start);
                                        const endIndex = waterMonthsAvailable.indexOf(zoneAnalysisDateRange.end);
                                        const monthsCount = endIndex - startIndex + 1;
                                        return (meter.totalConsumption / monthsCount).toFixed(0).toLocaleString();
                                      })()}
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    {waterMonthsAvailable.map(month => (
                                      <td key={month} className="p-4 text-right text-gray-800 dark:text-gray-200">
                                        {(meter.consumption[month] || 0).toLocaleString()}
                                      </td>
                                    ))}
                                    <td className="p-4 text-right font-bold text-gray-800 dark:text-gray-200">
                                      {meter.totalConsumption.toLocaleString()}
                                    </td>
                                  </>
                                )}
                                <td className="p-4 text-center">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    meter.isBuilding ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                                    currentMonthConsumption === 0 ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300' :
                                    currentMonthConsumption > 1000 ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                    currentMonthConsumption > 500 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                    'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                  }`}>
                                    {meter.isBuilding ? 'L3 - Building' :
                                     currentMonthConsumption === 0 ? 'No Usage' :
                                     currentMonthConsumption > 1000 ? 'High' :
                                     currentMonthConsumption > 500 ? 'Medium' : 'Normal'}
                                  </span>
                                </td>
                              </tr>
                            );
                          });
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls - Simplified */}
                {(() => {
                  let totalMeters = 0;
                  
                  if (zoneAnalysisData.hasBuildings) {
                    totalMeters = (zoneAnalysisData.buildingBulkData || []).length +
                                  (zoneAnalysisData.villaData || []).length +
                                  (zoneAnalysisData.otherData || []).length;
                  } else {
                    totalMeters = (zoneAnalysisData.individualMetersData || []).length;
                  }
                  
                  const totalPages = Math.ceil(totalMeters / itemsPerPage);
                  
                  return totalMeters > itemsPerPage ? (
                    <div className="p-4 border-t border-neutral-border dark:border-gray-600 bg-white dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalMeters)} of {totalMeters} meters
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded text-sm ${
                              currentPage === 1 
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                                : 'bg-white dark:bg-gray-700 border border-neutral-border dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            Previous
                          </button>
                          
                          <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded text-sm ${
                              currentPage === totalPages 
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' 
                                : 'bg-white dark:bg-gray-700 border border-neutral-border dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Summary Footer */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-neutral-border dark:border-gray-600">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Zone Bulk Total
                      </p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {zoneAnalysisData.zoneBulkConsumption.toLocaleString()} m³
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Individual Meters Total
                      </p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        {zoneAnalysisData.totalIndividualConsumption.toLocaleString()} m³
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Water Loss
                      </p>
                      <p className="text-xl font-bold text-red-600 dark:text-red-400">
                        {Math.abs(zoneAnalysisData.difference).toFixed(0)} m³ ({Math.abs(zoneAnalysisData.lossPercentage).toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {activeWaterSubSection === 'ByTypeAnalysis' && (
        <div className="space-y-6">
          {/* Filter by Type Buttons */}
          <ChartCard title="Filter by Usage Type">
            <div className="flex flex-wrap gap-3">
              {uniqueTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-accent to-accent/80 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  <Tags size={14} /> {type}
                </button>
              ))}
            </div>
          </ChartCard>

          {/* Month Range Selector */}
          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <MonthRangeSlider
                  months={byTypeData.months}
                  value={dateRange}
                  onChange={setDateRange}
                />
              </div>
              <Button
                onClick={resetByTypeDateRange}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white flex items-center justify-center gap-2 h-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <RotateCw size={16} />
                Reset Range
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary dark:text-white">Consumption by Type</h2>
              <p className="text-secondary dark:text-gray-400">Analysis of water consumption for <span className='font-bold text-accent'>{selectedType}</span> from <span className='font-bold text-accent'>{dateRange.start}</span> to <span className='font-bold text-accent'>{dateRange.end}</span>.</p>
            </div>
            <Button className="bg-primary hover:bg-primary-dark text-white flex items-center gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>

          {/* Detailed Metrics for Selected Type */}
          {typeDetailedMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                title="Total Consumption"
                value={typeDetailedMetrics.totalConsumption.toLocaleString()}
                unit="m³"
                icon={Droplets}
                subtitle={`${selectedType} total for period`}
                iconColor="text-blue-500"
              />
              <MetricCard 
                title="Monthly Average"
                value={typeDetailedMetrics.avgMonthlyConsumption.toFixed(0)}
                unit="m³/month"
                icon={TrendingUp}
                subtitle={`Average across ${filteredMonths.length} months`}
                iconColor="text-green-500"
              />
              <MetricCard 
                title="Peak Month"
                value={typeDetailedMetrics.maxMonth}
                unit=""
                icon={AlertCircle}
                subtitle={`${typeDetailedMetrics.maxConsumption.toLocaleString()} m³`}
                iconColor="text-red-500"
              />
              <MetricCard 
                title="% of L1 Supply"
                value={typeDetailedMetrics.percentOfL1.toFixed(1)}
                unit="%"
                icon={CheckCircle}
                subtitle={`${selectedType} share of total`}
                iconColor="text-purple-500"
              />
            </div>
          )}

          {/* Monthly Trend Chart for Selected Type */}
          <ChartCard title={`Monthly Trend for ${selectedType}`} subtitle="Consumption pattern over selected period">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={typeMonthlyTrendData}>
                <defs>
                  <linearGradient id="colorSelectedType" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D2B3" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00D2B3" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  fontSize={12} 
                  stroke="#9CA3AF"
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                />
                <YAxis 
                  fontSize={12} 
                  tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`} 
                  stroke="#9CA3AF"
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="Consumption" 
                  stroke="#00D2B3" 
                  fill="url(#colorSelectedType)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Consumption by Type" subtitle="Monthly and total consumption for the selected category.">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr className="text-left text-primary-dark dark:text-gray-300 uppercase">
                  <th className="p-3 font-semibold">Type</th>
                  {filteredMonths.map(month => (
                    <th key={month} className="p-3 font-semibold text-right">{month} (m³)</th>
                  ))}
                  <th className="p-3 font-semibold text-right">Total (m³)</th>
                  <th className="p-3 font-semibold text-right">% of L1</th>
                </tr>
              </thead>
              <tbody>
                {filteredTableData.map((row) => (
                  <tr key={row.type} className="border-b border-neutral-border dark:border-gray-700">
                    <td className="p-3 font-medium text-primary dark:text-gray-200">{row.type}</td>
                    {filteredMonths.map(month => (
                      <td key={month} className="p-3 text-right text-secondary dark:text-gray-400">{(row as any)[month]?.toLocaleString() ?? '-'}</td>
                    ))}
                    <td className="p-3 text-right font-bold text-primary dark:text-white">{row.total.toLocaleString()}</td>
                    <td className="p-3 text-right text-secondary dark:text-gray-400">{row.percentL1.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ChartCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Monthly Consumption Breakdown" subtitle="Bar chart showing monthly consumption for selected type">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={typeMonthlyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="Consumption" fill="#00D2B3" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Type Distribution" subtitle="Percentage breakdown of selected type">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={filteredDonutChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(1)}%`}
                  >
                    {filteredDonutChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}

      {activeWaterSubSection === 'MainDatabase' && (
        <>
          {/* Main Database Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Water System Main Database
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Complete meter inventory with consumption data for all months
            </p>
          </div>

          {/* Database Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <MetricCard 
              title="Total Meters" 
              value={waterSystemData.length.toLocaleString()} 
              unit="meters" 
              icon={Database} 
              subtitle="All levels" 
              iconColor="text-blue-600" 
            />
            <MetricCard 
              title="L1 Meters" 
              value={waterSystemData.filter(m => m.label === 'L1').length.toString()} 
              unit="meter" 
              icon={Droplets} 
              subtitle="Main source" 
              iconColor="text-blue-800" 
            />
            <MetricCard 
              title="L2 Meters" 
              value={waterSystemData.filter(m => m.label === 'L2').length.toString()} 
              unit="meters" 
              icon={Building} 
              subtitle="Zone bulk" 
              iconColor="text-yellow-600" 
            />
            <MetricCard 
              title="L3 Meters" 
              value={waterSystemData.filter(m => m.label === 'L3').length.toString()} 
              unit="meters" 
              icon={Building2} 
              subtitle="Buildings/Villas" 
              iconColor="text-green-600" 
            />
            <MetricCard 
              title="L4 Meters" 
              value={waterSystemData.filter(m => m.label === 'L4').length.toString()} 
              unit="meters" 
              icon={Home} 
              subtitle="Apartments" 
              iconColor="text-purple-600" 
            />
          </div>

          {/* Export Buttons */}
          <div className="mb-6 flex justify-end space-x-4">
            <button 
              onClick={() => {
                // Export to CSV functionality
                const csvRows = waterSystemData.map(row => {
                  const values = [
                    `"${row.meterLabel.replace(/"/g, '""')}"`,
                    row.acctNo,
                    row.zone,
                    row.type,
                    `"${row.parentMeter.replace(/"/g, '""')}"`,
                    row.label,
                    ...waterMonthsAvailable.map(month => row.consumption[month] || 0)
                  ];
                  return values.join(',');
                });
                
                const csvContent = [
                  ['Meter Label', 'Account #', 'Zone', 'Type', 'Parent Meter', 'Label', ...waterMonthsAvailable].join(','),
                  ...csvRows
                ].join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `water_system_data.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              }}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <Database size={16} />
              <span>Export to CSV</span>
            </button>
          </div>

          {/* Main Database Table */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-neutral-border dark:border-gray-600 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-200 sticky left-0 bg-gray-50 dark:bg-gray-700 z-10">Meter Label</th>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-200">Account #</th>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-200">Zone</th>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-200">Type</th>
                    <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-200">Parent Meter</th>
                    <th className="text-center p-4 font-semibold text-gray-700 dark:text-gray-200">Level</th>
                    {waterMonthsAvailable.map(month => (
                      <th key={month} className="text-right p-4 font-semibold text-gray-700 dark:text-gray-200 min-w-[100px]">
                        {month}
                      </th>
                    ))}
                    <th className="text-right p-4 font-semibold text-gray-700 dark:text-gray-200">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {waterSystemData
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((meter) => (
                    <tr key={meter.id} className={`border-b border-neutral-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      meter.label === 'L1' ? 'bg-blue-50 dark:bg-blue-900/20' :
                      meter.label === 'L2' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                      meter.label === 'L3' && meter.type === 'D_Building_Bulk' ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                    }`}>
                      <td className="p-4 font-medium text-gray-800 dark:text-gray-200 sticky left-0 bg-inherit">{meter.meterLabel}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{meter.acctNo}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{meter.zone}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{meter.type}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{meter.parentMeter}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          meter.label === 'L1' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                          meter.label === 'L2' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                          meter.label === 'L3' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                          meter.label === 'L4' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                          'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                        }`}>
                          {meter.label}
                        </span>
                      </td>
                      {waterMonthsAvailable.map(month => (
                        <td key={month} className={`p-4 text-right font-medium ${
                          meter.consumption[month] === 0 ? 'text-gray-400 dark:text-gray-500' :
                          meter.consumption[month] > 1000 ? 'text-red-600 dark:text-red-400' :
                          'text-gray-800 dark:text-gray-200'
                        }`}>
                          {meter.consumption[month]?.toLocaleString() || '0'}
                        </td>
                      ))}
                      <td className="p-4 text-right font-bold text-gray-800 dark:text-gray-200">
                        {meter.totalConsumption.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             <div className="p-4 border-t border-neutral-border dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, waterSystemData.length)} of {waterSystemData.length} meters
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                    <span>Page {currentPage} of {Math.ceil(waterSystemData.length / itemsPerPage)}</span>
                    <Button onClick={() => setCurrentPage(p => Math.min(Math.ceil(waterSystemData.length / itemsPerPage), p + 1))} disabled={currentPage * itemsPerPage >= waterSystemData.length}>Next</Button>
                </div>
            </div>
          </div>
        </>
      )}

      {/* AI Analysis Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-accent" />
                AI Water System Analysis
              </h3>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              {isAiLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">
                    {aiAnalysisResult}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterAnalysisModule;