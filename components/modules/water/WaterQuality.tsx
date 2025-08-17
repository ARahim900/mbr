import React, { useState, useMemo } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  TrendingUp, 
  Activity,
  Target,
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import MetricCard from '../../ui/MetricCard';
import ChartCard from '../../ui/ChartCard';
import Button from '../../ui/Button';
import SafeChart from '../../ui/SafeChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

// Mock water quality data - replace with real data from database
const waterQualityData = {
  currentMonth: 'Jul-25',
  parameters: [
    { name: 'pH Level', value: 7.2, unit: '', status: 'good', range: '6.5-8.5', trend: 'stable' },
    { name: 'Turbidity', value: 2.1, unit: 'NTU', status: 'excellent', range: '<5.0', trend: 'improving' },
    { name: 'Chlorine', value: 1.8, unit: 'mg/L', status: 'good', range: '1.0-2.0', trend: 'stable' },
    { name: 'Total Dissolved Solids', value: 245, unit: 'mg/L', status: 'good', range: '<500', trend: 'stable' },
    { name: 'Hardness', value: 120, unit: 'mg/L', status: 'excellent', range: '<150', trend: 'improving' },
    { name: 'Bacteria Count', value: 0, unit: 'CFU/100mL', status: 'excellent', range: '<1', trend: 'stable' }
  ],
  monthlyTrends: [
    { month: 'Jan-25', ph: 7.1, turbidity: 3.2, chlorine: 1.9, tds: 280, hardness: 135, bacteria: 0 },
    { month: 'Feb-25', ph: 7.0, turbidity: 2.8, chlorine: 1.8, tds: 265, hardness: 128, bacteria: 0 },
    { month: 'Mar-25', ph: 7.2, turbidity: 2.5, chlorine: 1.7, tds: 250, hardness: 122, bacteria: 0 },
    { month: 'Apr-25', ph: 7.3, turbidity: 2.3, chlorine: 1.8, tds: 248, hardness: 120, bacteria: 0 },
    { month: 'May-25', ph: 7.2, turbidity: 2.2, chlorine: 1.8, tds: 245, hardness: 120, bacteria: 0 },
    { month: 'Jun-25', ph: 7.2, turbidity: 2.1, chlorine: 1.8, tds: 245, hardness: 120, bacteria: 0 },
    { month: 'Jul-25', ph: 7.2, turbidity: 2.1, chlorine: 1.8, tds: 245, hardness: 120, bacteria: 0 }
  ],
  alerts: [
    { id: 1, parameter: 'pH Level', message: 'pH slightly elevated but within acceptable range', severity: 'low', timestamp: '2025-07-15 10:30' },
    { id: 2, parameter: 'Turbidity', message: 'Turbidity levels improving due to recent system upgrades', severity: 'info', timestamp: '2025-07-10 14:15' }
  ]
};

const WaterQuality: React.FC = () => {
  const isMobile = useIsMobile(1024);
  
  const [selectedParameter, setSelectedParameter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter parameters based on search term
  const filteredParameters = useMemo(() => {
    if (!searchTerm) return waterQualityData.parameters;
    return waterQualityData.parameters.filter((param: any) => 
      param.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Generate quality metrics
  const qualityMetrics = useMemo(() => {
    const excellentCount = waterQualityData.parameters.filter((p: any) => p.status === 'excellent').length;
    const goodCount = waterQualityData.parameters.filter((p: any) => p.status === 'good').length;
    const warningCount = waterQualityData.parameters.filter((p: any) => p.status === 'warning').length;
    const criticalCount = waterQualityData.parameters.filter((p: any) => p.status === 'critical').length;
    
    return [
      {
        title: 'Excellent Parameters',
        value: excellentCount.toString(),
        unit: '',
        icon: CheckCircle,
        iconColor: 'text-green-500',
        subtitle: 'Parameters in excellent status'
      },
      {
        title: 'Good Parameters',
        value: goodCount.toString(),
        unit: '',
        icon: CheckCircle,
        iconColor: 'text-blue-500',
        subtitle: 'Parameters in good status'
      },
      {
        title: 'Warning Parameters',
        value: warningCount.toString(),
        unit: '',
        icon: AlertCircle,
        iconColor: 'text-yellow-500',
        subtitle: 'Parameters needing attention'
      },
      {
        title: 'Critical Parameters',
        value: criticalCount.toString(),
        unit: '',
        icon: AlertCircle,
        iconColor: 'text-red-500',
        subtitle: 'Parameters requiring immediate action'
      }
    ];
  }, []);

  // Generate trend data for selected parameter
  const parameterTrendData = useMemo(() => {
    if (selectedParameter === 'all') {
      return waterQualityData.monthlyTrends.map((month: any) => ({
        month,
        ph: month.ph,
        turbidity: month.turbidity,
        chlorine: month.chlorine,
        tds: month.tds,
        hardness: month.hardness,
        bacteria: month.bacteria
      }));
    }
    
    const paramKey = selectedParameter.toLowerCase().replace(/\s+/g, '');
    return waterQualityData.monthlyTrends.map((month: any) => ({
      month,
      value: month[paramKey as keyof typeof month] || 0
    }));
  }, [selectedParameter]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'good': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'stable': return <Activity className="w-4 h-4 text-blue-500" />;
      case 'declining': return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`space-y-6 ${isMobile ? 'p-3' : 'p-4 sm:p-6'}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6 border border-neutral-border dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Water Quality Monitoring
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Current Month: {waterQualityData.currentMonth}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => {}} variant="secondary" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button onClick={() => {}} variant="primary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {qualityMetrics.map((metric: any, index: number) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            icon={metric.icon}
            iconColor={metric.iconColor}
            subtitle={metric.subtitle}
          />
        ))}
      </div>

      {/* Parameter Selection and Search */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-neutral-border dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Parameter Selection
            </label>
            <select
              value={selectedParameter}
              onChange={(e) => setSelectedParameter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Parameters</option>
              {waterQualityData.parameters.map((param: any) => (
                <option key={param.name} value={param.name}>{param.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Parameters
            </label>
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search parameters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quality Parameters Table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-neutral-border dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Water Quality Parameters
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Parameter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acceptable Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredParameters.map((param: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {param.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {param.value} {param.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {param.range}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(param.status)}`}>
                      {param.status.charAt(0).toUpperCase() + param.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTrendIcon(param.trend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quality Trends Chart */}
      <ChartCard
        title="Water Quality Trends"
        subtitle="Parameter values over time"
        
      >
        <SafeChart
          data={parameterTrendData}
          title="Water Quality Trends"
          fallbackMessage="Unable to load quality trend data"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={parameterTrendData}>
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
              {selectedParameter === 'all' ? (
                <>
                  <Line type="monotone" dataKey="ph" stroke={COLORS.chart[0]} strokeWidth={2} name="pH Level" />
                  <Line type="monotone" dataKey="turbidity" stroke={COLORS.chart[1]} strokeWidth={2} name="Turbidity" />
                  <Line type="monotone" dataKey="chlorine" stroke={COLORS.chart[2]} strokeWidth={2} name="Chlorine" />
                  <Line type="monotone" dataKey="tds" stroke={COLORS.chart[3]} strokeWidth={2} name="TDS" />
                  <Line type="monotone" dataKey="hardness" stroke={COLORS.chart[4]} strokeWidth={2} name="Hardness" />
                  <Line type="monotone" dataKey="bacteria" stroke={COLORS.chart[5]} strokeWidth={2} name="Bacteria" />
                </>
              ) : (
                <Line type="monotone" dataKey="value" stroke={COLORS.accent} strokeWidth={2} name={selectedParameter} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </SafeChart>
      </ChartCard>

      {/* Quality Alerts */}
      {waterQualityData.alerts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-neutral-border dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quality Alerts & Notifications
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {waterQualityData.alerts.map((alert: any) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${
                alert.severity === 'critical' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
                alert.severity === 'info' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' :
                'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-5 h-5 mt-1 ${
                    alert.severity === 'critical' ? 'text-red-500' :
                    alert.severity === 'warning' ? 'text-yellow-500' :
                    alert.severity === 'info' ? 'text-blue-500' :
                    'text-gray-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {alert.parameter}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quality Recommendations */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
          Water Quality Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Current Status</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                All parameters are within acceptable ranges. Continue monitoring and maintain current treatment protocols.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Continuous Improvement</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Consider implementing advanced monitoring systems for real-time quality tracking and early warning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterQuality;
