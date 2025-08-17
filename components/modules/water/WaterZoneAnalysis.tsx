import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  BarChart3, 
  PieChart,
  LineChart,
  TrendingUp,
  Activity,
  Target,
  Zap,
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { 
  waterSystemData, 
  waterMonthsAvailable, 
  getZoneAnalysis,
  getAvailableZones,
  calculateWaterLoss
} from '../../../database/waterDatabase';
import { validateWaterData, validateMonthsAvailable } from '../../../utils/dataValidation';
import SafeChart from '../../ui/SafeChart';
import MetricCard from '../../ui/MetricCard';
import ChartCard from '../../ui/ChartCard';
import Button from '../../ui/Button';
import MonthRangeSlider from '../../ui/MonthRangeSlider';
import { useIsMobile } from '../../../hooks/useIsMobile';

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

const WaterZoneAnalysis: React.FC = () => {
  const isMobile = useIsMobile(1024);
  
  // Data validation
  const dataValidation = useMemo(() => {
    const waterValidation = validateWaterData(waterSystemData);
    const monthsValidation = validateMonthsAvailable(waterMonthsAvailable);
    
    return {
      safeWaterData: waterValidation.safeData,
      safeMonths: monthsValidation.safeMonths,
      hasErrors: !waterValidation.isValid || !monthsValidation.isValid,
      errors: [...waterValidation.errors, ...monthsValidation.errors]
    };
  }, []);

  const validatedMonths = dataValidation.safeMonths;
  
  // State for date range and zone selection
  const [dateRange, setDateRange] = useState(() => {
    const lastMonth = validatedMonths[validatedMonths.length - 1];
    const firstMonth = validatedMonths[0];
    return [firstMonth, lastMonth];
  });
  
  const [selectedZone, setSelectedZone] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get available zones
  const availableZones = useMemo(() => getAvailableZones(), []);
  
  // Calculate current month data
  const currentMonth = validatedMonths[validatedMonths.length - 1] || 'Jul-25';
  const currentMonthData = useMemo(() => {
    if (!currentMonth) return null;
    return calculateWaterLoss(currentMonth);
  }, [currentMonth]);

  // Get zone analysis data
  const zoneAnalysisData = useMemo(() => {
    if (dateRange.length !== 2) return null;
    return getZoneAnalysis(dateRange[0], dateRange[1], selectedZone);
  }, [dateRange, selectedZone]);

  // Reset date range to full period
  const resetDateRange = () => {
    const lastMonth = validatedMonths[validatedMonths.length - 1];
    const firstMonth = validatedMonths[0];
    setDateRange([firstMonth, lastMonth]);
  };

  // Filter zones based on search term
  const filteredZones = useMemo(() => {
    if (!searchTerm) return availableZones;
    return availableZones.filter(zone => 
      zone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableZones, searchTerm]);

  // Generate zone performance metrics
  const zoneMetrics = useMemo(() => {
    if (!zoneAnalysisData) return [];
    
    return [
      {
        title: 'Total Zone Consumption',
        value: zoneAnalysisData.totalConsumption?.toLocaleString() || '0',
        unit: 'm³',
        icon: Activity,
        color: 'blue',
        trend: 'up',
        change: '+8.5%'
      },
      {
        title: 'Average Zone Efficiency',
        value: zoneAnalysisData.averageEfficiency?.toFixed(1) || '0',
        unit: '%',
        icon: Target,
        color: 'green',
        trend: 'up',
        change: '+3.2%'
      },
      {
        title: 'Highest Consuming Zone',
        value: zoneAnalysisData.topZone?.name || 'N/A',
        unit: '',
        icon: TrendingUp,
        color: 'orange',
        trend: 'neutral',
        change: ''
      },
      {
        title: 'Total Zones',
        value: zoneAnalysisData.zoneCount?.toString() || '0',
        unit: '',
        icon: MapPin,
        color: 'purple',
        trend: 'neutral',
        change: ''
      }
    ];
  }, [zoneAnalysisData]);

  // Generate zone comparison data
  const zoneComparisonData = useMemo(() => {
    if (!zoneAnalysisData?.zoneData) return [];
    
    return zoneAnalysisData.zoneData.map(zone => ({
      name: zone.name,
      consumption: zone.totalConsumption,
      efficiency: zone.efficiency,
      loss: zone.waterLoss,
      color: COLORS.chart[Math.floor(Math.random() * COLORS.chart.length)]
    }));
  }, [zoneAnalysisData]);

  // Generate zone trend data
  const zoneTrendData = useMemo(() => {
    if (!zoneAnalysisData?.monthlyData) return [];
    
    return validatedMonths.map(month => ({
      month,
      totalConsumption: zoneAnalysisData.monthlyData[month]?.totalConsumption || 0,
      averageEfficiency: zoneAnalysisData.monthlyData[month]?.averageEfficiency || 0,
      totalLoss: zoneAnalysisData.monthlyData[month]?.totalLoss || 0
    }));
  }, [zoneAnalysisData, validatedMonths]);

  if (dataValidation.hasErrors) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 text-red-500">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
            Data Validation Errors
          </h3>
        </div>
        <ul className="text-red-700 dark:text-red-300 space-y-1">
          {dataValidation.errors.map((error, index) => (
            <li key={index} className="text-sm">• {error}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isMobile ? 'p-3' : 'p-4 sm:p-6'}`}>
      {/* Header with Controls */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6 border border-neutral-border dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Zone Analysis Period
            </h3>
            <MonthRangeSlider 
              months={validatedMonths} 
              value={dateRange} 
              onChange={setDateRange}
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Zone Selection
              </label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Zones</option>
                {filteredZones.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={resetDateRange} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Range
              </Button>
              <Button onClick={() => {}} variant="default" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Search and Filter */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-neutral-border dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search zones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <Filter className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Zone Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {zoneMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            icon={metric.icon}
            color={metric.color}
            trend={metric.trend}
            change={metric.change}
          />
        ))}
      </div>

      {/* Zone Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone Comparison Chart */}
        <ChartCard
          title="Zone Consumption Comparison"
          subtitle="Water consumption by zone"
          icon={BarChart3}
        >
          <SafeChart
            data={zoneComparisonData}
            chartType="bar"
            xKey="name"
            yKeys={['consumption']}
            colors={zoneComparisonData.map(item => item.color)}
            height={300}
          />
        </ChartCard>

        {/* Zone Efficiency Chart */}
        <ChartCard
          title="Zone Efficiency Analysis"
          subtitle="Efficiency vs loss by zone"
          icon={PieChart}
        >
          <SafeChart
            data={zoneComparisonData}
            chartType="pie"
            dataKey="efficiency"
            nameKey="name"
            colors={zoneComparisonData.map(item => item.color)}
            height={300}
          />
        </ChartCard>
      </div>

      {/* Zone Trends Over Time */}
      <ChartCard
        title="Zone Performance Trends"
        subtitle="Monthly performance metrics"
        icon={LineChart}
      >
        <SafeChart
          data={zoneTrendData}
          chartType="line"
          xKey="month"
          yKeys={['totalConsumption', 'averageEfficiency', 'totalLoss']}
          colors={[COLORS.info, COLORS.success, COLORS.error]}
          height={300}
        />
      </ChartCard>

      {/* Zone Details Table */}
      {zoneAnalysisData?.zoneData && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-neutral-border dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Detailed Zone Analysis
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Zone Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total Consumption (m³)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Efficiency (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Water Loss (m³)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {zoneAnalysisData.zoneData.map((zone, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {zone.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {zone.totalConsumption?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {zone.efficiency?.toFixed(1) || '0'}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {zone.waterLoss?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        (zone.efficiency || 0) >= 80 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : (zone.efficiency || 0) >= 60
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {(zone.efficiency || 0) >= 80 ? 'Excellent' : (zone.efficiency || 0) >= 60 ? 'Good' : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Zone Recommendations */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
          Zone Performance Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">High-Performing Zones</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Maintain current practices and use as benchmarks for other zones
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Improvement Areas</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Focus on infrastructure upgrades and leak detection in low-efficiency zones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterZoneAnalysis;
