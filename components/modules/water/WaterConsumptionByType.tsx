import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  TrendingUp,
  Activity,
  Target,
  Zap,
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  waterSystemData, 
  waterMonthsAvailable, 
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

// Data for "By Type" Analysis (updated with July 2025 data)
const byTypeData = {
  table: [
    { type: 'Commercial', 'Jan-25': 19590, 'Feb-25': 20970, 'Mar-25': 22151, 'Apr-25': 28676, 'May-25': 27963, 'Jun-25': 18379, 'Jul-25': 15713, total: 153442, percentL1: 52.8 },
    { type: 'Residential', 'Jan-25': 7277, 'Feb-25': 6849, 'Mar-25': 5783, 'Apr-25': 7250, 'May-25': 8420, 'Jun-25': 7850, 'Jul-25': 8120, total: 51549, percentL1: 17.7 },
    { type: 'Irrigation', 'Jan-25': 2159, 'Feb-25': 2729, 'Mar-25': 326, 'Apr-25': 1950, 'May-25': 3221, 'Jun-25': 1655, 'Jul-25': 1975, total: 14015, percentL1: 4.8 },
    { type: 'Common', 'Jan-25': 800, 'Feb-25': 780, 'Mar-25': 751, 'Apr-25': 820, 'May-25': 890, 'Jun-25': 785, 'Jul-25': 835, total: 5661, percentL1: 1.9 },
  ],
  months: ['Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25', 'Jun-25', 'Jul-25'],
  barChart: [
    { name: 'Commercial', 'Total Consumption': 153442, fill: '#27AE60' },
    { name: 'Residential', 'Total Consumption': 51549, fill: '#4E4456' },
    { name: 'Irrigation', 'Total Consumption': 14015, fill: '#F1C40F' },
    { name: 'Common', 'Total Consumption': 5661, fill: '#E74C3C' },
  ],
  donutChart: [
    { name: 'Commercial', value: 68.4, color: '#27AE60' },
    { name: 'Residential', value: 23.0, color: '#4E4456' },
    { name: 'Irrigation', value: 6.2, color: '#F39C12' },
    { name: 'Common', value: 2.5, color: '#E74C3C' },
  ],
};

const WaterConsumptionByType: React.FC = () => {
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
  
  // State for date range and type selection
  const [dateRange, setDateRange] = useState(() => {
    const lastMonth = validatedMonths[validatedMonths.length - 1];
    const firstMonth = validatedMonths[0];
    return [firstMonth, lastMonth];
  });
  
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate current month data
  const currentMonth = validatedMonths[validatedMonths.length - 1] || 'Jul-25';
  const currentMonthData = useMemo(() => {
    if (!currentMonth) return null;
    return calculateWaterLoss(currentMonth);
  }, [currentMonth]);

  // Reset date range to full period
  const resetDateRange = () => {
    const lastMonth = validatedMonths[validatedMonths.length - 1];
    const firstMonth = validatedMonths[0];
    setDateRange([firstMonth, lastMonth]);
  };

  // Filter types based on search term
  const filteredTypes = useMemo(() => {
    if (!searchTerm) return byTypeData.table;
    return byTypeData.table.filter(type => 
      type.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Generate consumption type metrics
  const consumptionMetrics = useMemo(() => {
    if (!currentMonthData) return [];
    
    return [
      {
        title: 'Commercial Consumption',
        value: byTypeData.table[0]['Jul-25']?.toLocaleString() || '0',
        unit: 'm³',
        icon: Building2,
        iconColor: 'text-green-500',
        subtitle: 'Current month consumption',
        trend: {
          value: 15.2,
          isPositive: true
        }
      },
      {
        title: 'Residential Consumption',
        value: byTypeData.table[1]['Jul-25']?.toLocaleString() || '0',
        unit: 'm³',
        icon: Activity,
        iconColor: 'text-blue-500',
        subtitle: 'Current month consumption',
        trend: {
          value: 8.7,
          isPositive: true
        }
      },
      {
        title: 'Irrigation Consumption',
        value: byTypeData.table[2]['Jul-25']?.toLocaleString() || '0',
        unit: 'm³',
        icon: Target,
        iconColor: 'text-yellow-500',
        subtitle: 'Current month consumption',
        trend: {
          value: 12.3,
          isPositive: false
        }
      },
      {
        title: 'Common Areas',
        value: byTypeData.table[3]['Jul-25']?.toLocaleString() || '0',
        unit: 'm³',
        icon: Zap,
        iconColor: 'text-purple-500',
        subtitle: 'Current month consumption',
        trend: {
          value: 5.6,
          isPositive: true
        }
      }
    ];
  }, [currentMonthData]);

  // Generate trend data for selected type
  const typeTrendData = useMemo(() => {
    if (selectedType === 'all') {
      return byTypeData.months.map(month => ({
        month,
        commercial: (byTypeData.table[0] as any)[month] || 0,
        residential: (byTypeData.table[1] as any)[month] || 0,
        irrigation: (byTypeData.table[2] as any)[month] || 0,
        common: (byTypeData.table[3] as any)[month] || 0
      }));
    }
    
    const selectedTypeData = byTypeData.table.find(t => t.type === selectedType);
    if (!selectedTypeData) return [];
    
    return byTypeData.months.map(month => ({
      month,
      consumption: (selectedTypeData as any)[month] || 0
    }));
  }, [selectedType]);

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
              Consumption Analysis Period
            </h3>
            <MonthRangeSlider 
              months={validatedMonths} 
              value={dateRange as any} 
              onChange={setDateRange as any}
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type Selection
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                {byTypeData.table.map(type => (
                  <option key={type.type} value={type.type}>{type.type}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={resetDateRange} variant="secondary" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Range
              </Button>
              <Button onClick={() => {}} variant="primary" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Type Search and Filter */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-neutral-border dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search consumption types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <Filter className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Consumption Type Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {consumptionMetrics.map((metric, index) => (
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

      {/* Consumption Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumption by Type Bar Chart */}
        <ChartCard
          title="Total Consumption by Type"
          subtitle="Annual consumption breakdown"
        >
          <SafeChart
            data={byTypeData.barChart}
            title="Consumption by Type"
            fallbackMessage="Unable to load consumption data"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byTypeData.barChart}>
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
                <Bar dataKey="Total Consumption" fill={(entry: any, index: number) => byTypeData.barChart[index]?.fill} />
              </BarChart>
            </ResponsiveContainer>
          </SafeChart>
        </ChartCard>

        {/* Consumption Distribution Pie Chart */}
        <ChartCard
          title="Consumption Distribution"
          subtitle="Percentage breakdown by type"
        >
          <SafeChart
            data={byTypeData.donutChart}
            title="Consumption Distribution"
            fallbackMessage="Unable to load distribution data"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={byTypeData.donutChart}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={30}
                >
                  {byTypeData.donutChart.map((entry, index) => (
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

      {/* Consumption Trends Over Time */}
      <ChartCard
        title="Consumption Trends by Type"
        subtitle="Monthly consumption patterns"
      >
        <SafeChart
          data={typeTrendData}
          title="Consumption Trends"
          fallbackMessage="Unable to load trend data"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={typeTrendData}>
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
              {selectedType === 'all' ? (
                <>
                  <Line type="monotone" dataKey="commercial" stroke={COLORS.success} strokeWidth={2} />
                  <Line type="monotone" dataKey="residential" stroke={COLORS.info} strokeWidth={2} />
                  <Line type="monotone" dataKey="irrigation" stroke={COLORS.warning} strokeWidth={2} />
                  <Line type="monotone" dataKey="common" stroke={COLORS.error} strokeWidth={2} />
                </>
              ) : (
                <Line type="monotone" dataKey="consumption" stroke={COLORS.accent} strokeWidth={2} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </SafeChart>
      </ChartCard>

      {/* Detailed Consumption Table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-neutral-border dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detailed Consumption Analysis
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                {byTypeData.months.map(month => (
                  <th key={month} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {month}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  % of L1
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTypes.map((type, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {type.type}
                  </td>
                  {byTypeData.months.map(month => (
                    <td key={month} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {(type as any)[month]?.toLocaleString() || '0'}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                    {type.total?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {type.percentL1?.toFixed(1) || '0'}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consumption Insights */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
          Consumption Insights & Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Commercial Usage</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Highest consumer at 68.4%. Consider implementing water-saving technologies and monitoring systems.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Irrigation Optimization</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Seasonal variations detected. Implement smart irrigation systems for better efficiency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterConsumptionByType;
