import React, { useState, useMemo } from 'react';
import { 
  TrendingDown, 
  AlertTriangle, 
  Activity,
  Target,
  Zap,
  RefreshCw,
  Download
} from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  waterSystemData, 
  waterMonthsAvailable, 
  calculateWaterLoss,
  calculateAggregatedDataForPeriod
} from '../../../database/waterDatabase';
import { validateWaterData, validateMonthsAvailable } from '../../../utils/dataValidation';
import SafeChart from '../../ui/SafeChart';
import GaugeChart from '../../ui/GaugeChart';
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

const WaterLossAnalysis: React.FC = () => {
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

  // Generate loss analysis metrics
  const lossMetrics = useMemo(() => {
    if (!currentMonthData) return [];
    
    return [
      {
        title: 'Total Water Loss',
        value: currentMonthData.totalLoss?.toLocaleString() || '0',
        unit: 'm³',
        icon: TrendingDown,
        iconColor: 'text-red-500',
        subtitle: 'Current month water loss',
        trend: {
          value: 8.3,
          isPositive: false
        }
      },
      {
        title: 'Loss Percentage',
        value: currentMonthData.totalLossPercent?.toFixed(1) || '0',
        unit: '%',
        icon: Target,
        iconColor: 'text-orange-600',
        subtitle: 'Percentage of total supply',
        trend: {
          value: 1.2,
          isPositive: false
        }
      },
      {
        title: 'System Efficiency',
        value: currentMonthData.systemEfficiency?.toFixed(1) || '0',
        unit: '%',
        icon: Activity,
        iconColor: 'text-green-500',
        subtitle: 'System performance efficiency',
        trend: {
          value: 2.1,
          isPositive: true
        }
      },
      {
        title: 'Stage 1 Loss',
        value: currentMonthData.stage1Loss?.toLocaleString() || '0',
        unit: 'm³',
        icon: AlertTriangle,
        iconColor: 'text-yellow-500',
        subtitle: 'Primary stage water loss',
        trend: {
          value: 5.7,
          isPositive: false
        }
      }
    ];
  }, [currentMonthData]);

  // Generate loss trend data
  const lossTrendData = useMemo(() => {
    if (!aggregatedData) return [];
    
    return validatedMonths.map((month: string) => ({
      month,
      totalLoss: aggregatedData.monthlyData[month]?.totalLoss || 0,
      stage1Loss: aggregatedData.monthlyData[month]?.stage1Loss || 0,
      stage2Loss: aggregatedData.monthlyData[month]?.stage2Loss || 0,
      stage3Loss: aggregatedData.monthlyData[month]?.stage3Loss || 0
    }));
  }, [aggregatedData, validatedMonths]);

  // Generate loss breakdown data
  const lossBreakdownData = useMemo(() => {
    if (!currentMonthData) return [];
    
    return [
      { name: 'Stage 1 Loss', value: currentMonthData.stage1Loss || 0, color: COLORS.warning },
      { name: 'Stage 2 Loss', value: currentMonthData.stage2Loss || 0, color: COLORS.error },
      { name: 'Stage 3 Loss', value: currentMonthData.stage3Loss || 0, color: COLORS.info }
    ].filter((item: any) => item.value > 0);
  }, [currentMonthData]);

  // Generate zone loss comparison data
  const zoneLossData = useMemo(() => {
    if (!currentMonthData?.zoneBulkMeters) return [];
    
    return currentMonthData.zoneBulkMeters.map((meter: any) => {
      const zoneConsumption = meter.consumption[currentMonth] || 0;
      const zoneLoss = zoneConsumption * 0.15; // Estimated 15% loss per zone
      
      return {
        name: meter.zone,
        consumption: zoneConsumption,
        loss: zoneLoss,
        efficiency: ((zoneConsumption - zoneLoss) / zoneConsumption * 100) || 0
      };
    });
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
              Water Loss Analysis Period
            </h3>
            <MonthRangeSlider 
              months={validatedMonths} 
              value={dateRange} 
              onChange={setDateRange}
            />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-3 sm:gap-4">
            <Button onClick={resetDateRange} variant="secondary" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Range
            </Button>
            <Button onClick={() => {}} variant="primary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Loss Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {lossMetrics.map((metric: any, index: number) => (
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

      {/* Loss Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loss Trend Chart */}
        <ChartCard
          title="Water Loss Trends"
          subtitle="Monthly loss breakdown by stage"
          
        >
          <SafeChart
            data={lossTrendData}
            title="Water Loss Trends"
            fallbackMessage="Unable to load loss trend data"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={lossTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="month" 
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: 'rgba(255,255,255,0.6)' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: 'rgba(255,255,255,0.6)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(78, 68, 86, 0.9)', 
                    border: 'none',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="totalLoss" stackId="1" stroke={COLORS.error} fill={COLORS.error} fillOpacity={0.6} />
                <Area type="monotone" dataKey="stage1Loss" stackId="2" stroke={COLORS.warning} fill={COLORS.warning} fillOpacity={0.6} />
                <Area type="monotone" dataKey="stage2Loss" stackId="3" stroke={COLORS.info} fill={COLORS.info} fillOpacity={0.6} />
                <Area type="monotone" dataKey="stage3Loss" stackId="4" stroke={COLORS.accent} fill={COLORS.accent} fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </SafeChart>
        </ChartCard>

        {/* Loss Breakdown Chart */}
        <ChartCard
          title="Current Month Loss Breakdown"
          subtitle="Loss distribution by stage"
          
        >
          <SafeChart
            data={lossBreakdownData}
            title="Loss Breakdown"
            fallbackMessage="Unable to load loss breakdown data"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={lossBreakdownData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={30}
                >
                  {lossBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(78, 68, 86, 0.9)', 
                    border: 'none',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </SafeChart>
        </ChartCard>
      </div>

      {/* System Efficiency Gauge */}
      <ChartCard
        title="System Efficiency vs Loss"
        subtitle="Current month performance"
        
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

      {/* Zone Loss Comparison */}
      <ChartCard
        title="Zone Loss Comparison"
        subtitle="Loss analysis by distribution zone"
        
      >
        <SafeChart
          data={zoneLossData}
          title="Zone Loss Comparison"
          fallbackMessage="Unable to load zone loss data"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={zoneLossData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.6)"
                tick={{ fill: 'rgba(255,255,255,0.6)' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)"
                tick={{ fill: 'rgba(255,255,255,0.6)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(78, 68, 86, 0.9)', 
                  border: 'none',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="consumption" stroke={COLORS.info} strokeWidth={2} />
              <Line type="monotone" dataKey="loss" stroke={COLORS.error} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </SafeChart>
      </ChartCard>

      {/* Loss Analysis Summary */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-neutral-border dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Loss Analysis Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {currentMonthData?.totalLoss?.toLocaleString() || '0'} m³
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Water Loss
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {currentMonthData?.totalLossPercent?.toFixed(1) || '0'}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Loss Percentage
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {currentMonthData?.systemEfficiency?.toFixed(1) || '0'}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              System Efficiency
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
          Loss Reduction Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Immediate Actions</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Check for leaks in high-loss zones and repair damaged meters
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Long-term Strategy</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Implement pressure management and upgrade aging infrastructure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterLossAnalysis;
