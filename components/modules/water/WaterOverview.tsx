import React, { useState, useMemo } from 'react';
import { 
  Droplets, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Calendar,
  RefreshCw,
  Download,
} from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { 
  waterSystemData, 
  waterMonthsAvailable, 
  calculateWaterLoss,
  calculateAggregatedDataForPeriod
} from '../../../database/waterDatabase';
import { validateWaterData, validateMonthsAvailable } from '../../../utils/dataValidation';
import GaugeChart from '../../ui/GaugeChart';
import MetricCard from '../../ui/MetricCard';
import ChartCard from '../../ui/ChartCard';
import Button from '../../ui/Button';
import MonthRangeSlider from '../../ui/MonthRangeSlider';
import VisualizationErrorBoundary from '../../ui/VisualizationErrorBoundary';
import SafeResponsiveContainer from '../../ui/SafeResponsiveContainer';
import { useIsMobile } from '../../../hooks/useIsMobile';

// Type definition for water loss calculation result
interface WaterLossData {
  A1_supply: number;
  A2_total: number;
  A3_total: number;
  A4_total: number;
  L2_total: number;
  L3_total: number;
  L4_total: number;
  DC_total: number;
  stage1Loss: number;
  stage2Loss: number;
  stage3Loss: number;
  totalLoss: number;
  stage1LossPercent: number;
  stage2LossPercent: number;
  stage3LossPercent: number;
  totalLossPercent: number;
  systemEfficiency: number;
  zoneBulkMeters: any[];
  buildingBulkMeters: any[];
  directConnections: any[];
  endUserMeters: any[];
}

// Type definition for monthly data
interface MonthlyDataItem {
  A1_supply: number;
  A2_total: number;
  A3_total: number;
  A4_total: number;
  totalLoss: number;
  systemEfficiency: number;
}

interface AggregatedData {
  A1_supply: number;
  A2_total: number;
  A3_total: number;
  A4_total: number;
  L2_total: number;
  L3_total: number;
  L4_total: number;
  DC_total: number;
  stage1Loss: number;
  stage2Loss: number;
  stage3Loss: number;
  totalLoss: number;
  stage1LossPercent: number;
  stage2LossPercent: number;
  stage3LossPercent: number;
  totalLossPercent: number;
  systemEfficiency: number;
  period: string;
  monthlyData: { [key: string]: MonthlyDataItem };
}

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
  const currentMonthData = useMemo((): WaterLossData | null => {
    if (!currentMonth) return null;
    return calculateWaterLoss(currentMonth) as WaterLossData;
  }, [currentMonth]);

  // Calculate aggregated data for selected range
  const aggregatedData = useMemo((): AggregatedData | null => {
    if (dateRange.length !== 2) return null;
    return calculateAggregatedDataForPeriod(dateRange[0], dateRange[1]) as AggregatedData;
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
        iconColor: 'text-blue-500',
        subtitle: 'Total water supply',
        trend: {
          value: 12.5,
          isPositive: true
        }
      },
      {
        title: 'System Efficiency',
        value: currentMonthData.systemEfficiency?.toFixed(1) || '0',
        unit: '%',
        icon: CheckCircle,
        iconColor: 'text-green-500',
        subtitle: 'System performance',
        trend: {
          value: 2.1,
          isPositive: true
        }
      },
      {
        title: 'Total Water Loss',
        value: currentMonthData.totalLoss?.toLocaleString() || '0',
        unit: 'm³',
        icon: AlertTriangle,
        iconColor: 'text-red-500',
        subtitle: 'Total water loss',
        trend: {
          value: 8.3,
          isPositive: false
        }
      },
      {
        title: 'End User Consumption',
        value: currentMonthData.A4_total?.toLocaleString() || '0',
        unit: 'm³',
        icon: Activity,
        iconColor: 'text-purple-500',
        subtitle: 'End user consumption',
        trend: {
          value: 5.7,
          isPositive: true
        }
      }
    ];
  }, [currentMonthData]);

  // Generate consumption trend data
  const consumptionTrendData = useMemo(() => {
    if (!aggregatedData || !aggregatedData.monthlyData) {
      // Return fallback data to ensure charts render
      return validatedMonths.map((month: string) => ({
        month,
        supply: 0,
        consumption: 0,
        loss: 0
      }));
    }
    
    const chartData = validatedMonths.map((month: string) => {
      const monthData = aggregatedData.monthlyData[month];
      return {
        month,
        supply: monthData?.A1_supply || 0,
        consumption: monthData?.A4_total || 0,
        loss: monthData?.totalLoss || 0
      };
    });
    
    // Ensure we have at least some data for rendering
    const hasData = chartData.some(item => item.supply > 0 || item.consumption > 0 || item.loss > 0);
    if (!hasData && chartData.length > 0) {
      // Add minimal sample data to show chart structure
      chartData[0] = { ...chartData[0], supply: 1, consumption: 1, loss: 0.1 };
    }
    
    return chartData;
  }, [aggregatedData, validatedMonths]);

  // Generate zone distribution data
  const zoneDistributionData = useMemo(() => {
    if (!currentMonthData?.zoneBulkMeters) {
      // Return fallback data for visualization
      return [
        { name: 'Zone 1', value: 100, color: COLORS.chart[0] },
        { name: 'Zone 2', value: 150, color: COLORS.chart[1] },
        { name: 'Zone 3', value: 200, color: COLORS.chart[2] }
      ];
    }
    
    const pieData = currentMonthData.zoneBulkMeters.map((meter: any, index: number) => ({
      name: meter.zone,
      value: meter.consumption[currentMonth] || 0,
      color: COLORS.chart[index % COLORS.chart.length]
    }));
    
    // Filter out zones with zero consumption for cleaner visualization
    const filteredData = pieData.filter(item => item.value > 0);
    
    // If no data, return sample data
    if (filteredData.length === 0) {
      return [
        { name: 'No Data', value: 1, color: COLORS.chart[0] }
      ];
    }
    
    return filteredData;
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
              <Activity className="w-4 h-4 mr-2" />
              AI Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewMetrics.map((metric: any, index: number) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            icon={metric.icon}
            iconColor={metric.iconColor}
            subtitle={metric.subtitle}
            trend={metric.trend}
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
          <VisualizationErrorBoundary>
            <div className="recharts-chart-container">
              <SafeResponsiveContainer height={350}>
                <AreaChart data={consumptionTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: '#666' }}
                    tickLine={{ stroke: '#ccc' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#666' }}
                    tickLine={{ stroke: '#ccc' }}
                    axisLine={{ stroke: '#ccc' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ color: '#333', fontWeight: '600' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="rect"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="supply" 
                    stackId="1" 
                    stroke={COLORS.info} 
                    fill={COLORS.info} 
                    fillOpacity={0.6} 
                    name="Supply (m³)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="consumption" 
                    stackId="2" 
                    stroke={COLORS.success} 
                    fill={COLORS.success} 
                    fillOpacity={0.6} 
                    name="Consumption (m³)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="loss" 
                    stackId="3" 
                    stroke={COLORS.error} 
                    fill={COLORS.error} 
                    fillOpacity={0.6} 
                    name="Loss (m³)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </SafeResponsiveContainer>
            </div>
          </VisualizationErrorBoundary>
        </ChartCard>

        {/* Zone Distribution Chart */}
        <ChartCard
          title="Zone Distribution"
          subtitle="Water consumption by zone"
        >
          <VisualizationErrorBoundary>
            <div className="recharts-chart-container">
              <SafeResponsiveContainer height={350}>
                <PieChart>
                  <Pie
                    data={zoneDistributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    paddingAngle={2}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {zoneDistributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke={"#fff"}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} m³`, 'Consumption']}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                </PieChart>
              </SafeResponsiveContainer>
            </div>
          </VisualizationErrorBoundary>
        </ChartCard>
      </div>

      {/* System Efficiency Gauge */}
      <ChartCard
        title="System Efficiency Overview"
        subtitle="Current month system performance"
      >
        <VisualizationErrorBoundary>
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
        </VisualizationErrorBoundary>
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
            <Activity className="w-4 h-4 mr-2" />
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
