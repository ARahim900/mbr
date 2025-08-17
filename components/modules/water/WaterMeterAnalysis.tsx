import React, { useState, useMemo } from 'react';
import { 
  Gauge, 
  BarChart3, 
  TrendingUp, 
  Activity,
  Target,
  Zap,
  RefreshCw,
  Download,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  waterSystemData, 
  waterMonthsAvailable 
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

const WaterMeterAnalysis: React.FC = () => {
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
  
  // State for date range and meter selection
  const [dateRange, setDateRange] = useState(() => {
    const lastMonth = validatedMonths[validatedMonths.length - 1];
    const firstMonth = validatedMonths[0];
    return [firstMonth, lastMonth];
  });
  
  const [selectedMeter, setSelectedMeter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [meterType, setMeterType] = useState('all');

  // Calculate current month data
  const currentMonth = validatedMonths[validatedMonths.length - 1] || 'Jul-25';

  // Reset date range to full period
  const resetDateRange = () => {
    const lastMonth = validatedMonths[validatedMonths.length - 1];
    const firstMonth = validatedMonths[0];
    setDateRange([firstMonth, lastMonth]);
  };

  // Filter meters based on search term and type
  const filteredMeters = useMemo(() => {
    let meters = dataValidation.safeWaterData;
    
    if (meterType !== 'all') {
      meters = meters.filter(meter => meter.type === meterType);
    }
    
    if (searchTerm) {
      meters = meters.filter(meter => 
        meter.meterLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meter.zone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return meters;
  }, [dataValidation.safeWaterData, searchTerm, meterType]);

  // Generate meter performance metrics
  const meterMetrics = useMemo(() => {
    if (!filteredMeters.length) return [];
    
    const totalMeters = filteredMeters.length;
    const activeMeters = filteredMeters.filter(meter => 
      (meter.consumption[currentMonth] || 0) > 0
    ).length;
    const highConsumptionMeters = filteredMeters.filter(meter => 
      (meter.consumption[currentMonth] || 0) > 100
    ).length;
    const averageConsumption = filteredMeters.reduce((sum, meter) => 
      sum + (meter.consumption[currentMonth] || 0), 0
    ) / totalMeters;
    
    return [
      {
        title: 'Total Meters',
        value: totalMeters.toString(),
        unit: '',
        icon: Gauge,
        color: 'blue',
        trend: 'neutral',
        change: ''
      },
      {
        title: 'Active Meters',
        value: activeMeters.toString(),
        unit: '',
        icon: CheckCircle,
        color: 'green',
        trend: 'up',
        change: '+5.2%'
      },
      {
        title: 'High Consumption',
        value: highConsumptionMeters.toString(),
        unit: '',
        icon: AlertTriangle,
        color: 'orange',
        trend: 'down',
        change: '-2.1%'
      },
      {
        title: 'Avg Consumption',
        value: averageConsumption.toFixed(1),
        unit: 'm³',
        icon: Activity,
        color: 'purple',
        trend: 'up',
        change: '+8.7%'
      }
    ];
  }, [filteredMeters, currentMonth]);

  // Generate meter consumption data for charts
  const meterConsumptionData = useMemo(() => {
    if (!filteredMeters.length) return [];
    
    return filteredMeters
      .sort((a, b) => (b.consumption[currentMonth] || 0) - (a.consumption[currentMonth] || 0))
      .slice(0, 20)
      .map(meter => ({
        name: meter.meterLabel,
        consumption: meter.consumption[currentMonth] || 0,
        zone: meter.zone,
        type: meter.type,
        color: COLORS.chart[Math.floor(Math.random() * COLORS.chart.length)]
      }));
  }, [filteredMeters, currentMonth]);

  // Generate meter trend data
  const meterTrendData = useMemo(() => {
    if (!filteredMeters.length) return [];
    
    return validatedMonths.map(month => ({
      month,
      totalConsumption: filteredMeters.reduce((sum, meter) => 
        sum + (meter.consumption[month] || 0), 0
      ),
      averageConsumption: filteredMeters.reduce((sum, meter) => 
        sum + (meter.consumption[month] || 0), 0
      ) / filteredMeters.length,
      activeMeters: filteredMeters.filter(meter => 
        (meter.consumption[month] || 0) > 0
      ).length
    }));
  }, [filteredMeters, validatedMonths]);

  // Get meter types for filtering
  const meterTypes = useMemo(() => {
    const types = [...new Set(dataValidation.safeWaterData.map(meter => meter.type))];
    return types.sort();
  }, [dataValidation.safeWaterData]);

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
              Meter Analysis Period
            </h3>
            <MonthRangeSlider 
              months={validatedMonths} 
              value={dateRange} 
              onChange={setDateRange}
            />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meter Type
                </label>
                <select
                  value={meterType}
                  onChange={(e) => setMeterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Types</option>
                  {meterTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Selected Meter
                </label>
                <select
                  value={selectedMeter}
                  onChange={(e) => setSelectedMeter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Meters</option>
                  {filteredMeters.slice(0, 50).map(meter => (
                    <option key={meter.id} value={meter.id}>{meter.meterLabel}</option>
                  ))}
                </select>
              </div>
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

      {/* Meter Search and Filter */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-neutral-border dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search meters by label or zone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <Filter className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Meter Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {meterMetrics.map((metric, index) => (
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

      {/* Meter Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Meters Consumption Chart */}
        <ChartCard
          title="Top 20 Meters by Consumption"
          subtitle="Current month consumption ranking"
          icon={BarChart3}
        >
          <SafeChart
            data={meterConsumptionData}
            chartType="bar"
            xKey="name"
            yKeys={['consumption']}
            colors={meterConsumptionData.map(item => item.color)}
            height={300}
          />
        </ChartCard>

        {/* Meter Type Distribution Chart */}
        <ChartCard
          title="Meter Type Distribution"
          subtitle="Meters by type and consumption"
          icon={Gauge}
        >
          <SafeChart
            data={meterTypes.map(type => ({
              name: type,
              count: filteredMeters.filter(m => m.type === type).length,
              consumption: filteredMeters
                .filter(m => m.type === type)
                .reduce((sum, m) => sum + (m.consumption[currentMonth] || 0), 0)
            }))}
            chartType="bar"
            xKey="name"
            yKeys={['count', 'consumption']}
            colors={[COLORS.info, COLORS.success]}
            height={300}
          />
        </ChartCard>
      </div>

      {/* Meter Trends Over Time */}
      <ChartCard
        title="Meter Performance Trends"
        subtitle="Monthly performance metrics"
        icon={TrendingUp}
      >
        <SafeChart
          data={meterTrendData}
          chartType="line"
          xKey="month"
          yKeys={['totalConsumption', 'averageConsumption', 'activeMeters']}
          colors={[COLORS.info, COLORS.success, COLORS.warning]}
          height={300}
        />
      </ChartCard>

      {/* Detailed Meter Table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-neutral-border dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detailed Meter Analysis
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Meter Label
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Current Consumption (m³)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Consumption (m³)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMeters.slice(0, 100).map((meter, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {meter.meterLabel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {meter.zone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {meter.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {meter.consumption[currentMonth]?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {meter.totalConsumption?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      (meter.consumption[currentMonth] || 0) > 100 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : (meter.consumption[currentMonth] || 0) > 50
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {(meter.consumption[currentMonth] || 0) > 100 ? 'High' : (meter.consumption[currentMonth] || 0) > 50 ? 'Medium' : 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Meter Analysis Insights */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
          Meter Analysis Insights & Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">High Consumption Meters</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Identify meters with unusually high consumption for investigation and potential leak detection.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Performance Optimization</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Regular meter calibration and maintenance to ensure accurate readings and optimal performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterMeterAnalysis;
