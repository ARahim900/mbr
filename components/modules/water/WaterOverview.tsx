import React, { useState, useMemo } from 'react';
import { 
  Droplets, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Calendar,
  RefreshCw,
  Download,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { 
  waterSystemData, 
  waterMonthsAvailable, 
  calculateWaterLoss,
  calculateAggregatedDataForPeriod
} from '../../database/waterDatabase';
import { validateWaterData, validateMonthsAvailable } from '../../utils/dataValidation';
import SafeChart from '../ui/SafeChart';
import GaugeChart from '../ui/GaugeChart';
import MetricCard from '../ui/MetricCard';
import ChartCard from '../ui/ChartCard';
import Button from '../ui/Button';
import MonthRangeSlider from '../ui/MonthRangeSlider';
import { useIsMobile } from '../../hooks/useIsMobile';

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

const WaterOverview: React.FC = () => {
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
  
  // State for date range selection
  const [dateRange, setDateRange] = useState(() => {
    const lastMonth = validatedMonths[validatedMonths.length - 1];
    const firstMonth = validatedMonths[0];
    return [firstMonth, lastMonth];
  });

  // Calculate current month data
  const currentMonth = validatedMonths[validatedMonths.length - 1] || 'Jul-25';
  const currentMonthData = useMemo(() => {
    if (!currentMonth) return null;
    return calculateWaterLoss(currentMonth);
  }, [currentMonth]);

  // Calculate aggregated data for selected range
  const aggregatedData = useMemo(() => {
    if (dateRange.length !== 2) return null;
    return calculateAggregatedDataForPeriod(dateRange[0], dateRange[1]);
  }, [dateRange]);

  // Reset date range to full period
  const resetDateRange = () => {
    const lastMonth = validatedMonths[validatedMonths.length - 1];
    const firstMonth = validatedMonths[0];
    setDateRange([firstMonth, lastMonth]);
  };

  // Generate overview metrics
  const overviewMetrics = useMemo(() => {
    if (!currentMonthData) return [];
    
    return [
      {
        title: 'Total Supply',
        value: currentMonthData.A1_supply?.toLocaleString() || '0',
        unit: 'm³',
        icon: Droplets,
        color: 'blue',
        trend: 'up',
        change: '+12.5%'
      },
      {
        title: 'System Efficiency',
        value: currentMonthData.systemEfficiency?.toFixed(1) || '0',
        unit: '%',
        icon: CheckCircle,
        color: 'green',
        trend: 'up',
        change: '+2.1%'
      },
      {
        title: 'Total Water Loss',
        value: currentMonthData.totalLoss?.toLocaleString() || '0',
        unit: 'm³',
        icon: AlertTriangle,
        color: 'red',
        trend: 'down',
        change: '-8.3%'
      },
      {
        title: 'End User Consumption',
        value: currentMonthData.A4_total?.toLocaleString() || '0',
        unit: 'm³',
        icon: Activity,
        color: 'purple',
        trend: 'up',
        change: '+5.7%'
      }
    ];
  }, [currentMonthData]);

  // Generate consumption trend data
  const consumptionTrendData = useMemo(() => {
    if (!aggregatedData) return [];
    
    return validatedMonths.map(month => ({
      month,
      supply: (aggregatedData as any).monthlyData?.[month]?.A1_supply || 0,
      consumption: (aggregatedData as any).monthlyData?.[month]?.A4_total || 0,
      loss: (aggregatedData as any).monthlyData?.[month]?.totalLoss || 0
    }));
  }, [aggregatedData, validatedMonths]);

  // Generate zone distribution data
  const zoneDistributionData = useMemo(() => {
    if (!currentMonthData?.zoneBulkMeters) return [];
    
    return currentMonthData.zoneBulkMeters.map(meter => ({
      name: meter.zone,
      value: meter.consumption[currentMonth] || 0,
      color: COLORS.chart[Math.floor(Math.random() * COLORS.chart.length)]
    }));
  }, [currentMonthData, currentMonth]);

  if (dataValidation.hasErrors) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
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
      {/* Header with Date Range Selector */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6 border border-neutral-border dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Date Range Selection
            </h3>
            <MonthRangeSlider 
              months={validatedMonths} 
              value={dateRange as any} 
              onChange={setDateRange as any}
            />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-3 sm:gap-4">
            <Button onClick={resetDateRange} variant="secondary" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Range
            </Button>
            <Button onClick={() => {}} variant="primary" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              AI Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            
            color={metric.color}
            trend={metric.trend}
            change={metric.change}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumption Trend Chart */}
        <ChartCard
          title="Water Consumption Trend"
          subtitle="Monthly supply vs consumption vs loss"
          
        >
          <SafeChart
            data={consumptionTrendData}
            
            xKey="month"
            yKeys={['supply', 'consumption', 'loss']}
            colors={[COLORS.info, COLORS.success, COLORS.error]}
            height={300}
          />
        </ChartCard>

        {/* Zone Distribution Chart */}
        <ChartCard
          title="Zone Distribution"
          subtitle="Water consumption by zone"
          
        >
          <SafeChart
            data={zoneDistributionData}
            
            dataKey="value"
            nameKey="name"
            colors={zoneDistributionData.map(item => item.color)}
            height={300}
          />
        </ChartCard>
      </div>

      {/* System Efficiency Gauge */}
      <ChartCard
        title="System Efficiency Overview"
        subtitle="Current month system performance"
        
      >
        <div className="flex justify-center items-center py-8">
          <GaugeChart
            value={currentMonthData?.systemEfficiency || 0}
            percentage={currentMonthData?.systemEfficiency || 0}
            title="Efficiency %"
            subtitle="System Performance"
            color={COLORS.success}
            size={200}
          />
        </div>
      </ChartCard>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-neutral-border dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button onClick={() => {}} variant="secondary" className="h-12">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => {}} variant="secondary" className="h-12">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button onClick={() => {}} variant="secondary" className="h-12">
            <AlertTriangle className="w-4 h-4 mr-2" />
            View Alerts
          </Button>
          <Button onClick={() => {}} variant="secondary" className="h-12">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Maintenance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WaterOverview;
