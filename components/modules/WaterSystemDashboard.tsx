import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LabelList,
  CartesianGrid
} from 'recharts';
import { GlassCard, GradientButton, ResponsiveGrid, ChartGradients, getChartConfig, colors } from '../ui';

// Mock data for demonstration
const flowData = [
  { time: '00:00', flow: 1800, pressure: 45 },
  { time: '04:00', flow: 1600, pressure: 42 },
  { time: '08:00', flow: 2200, pressure: 48 },
  { time: '12:00', flow: 2400, pressure: 52 },
  { time: '16:00', flow: 2300, pressure: 50 },
  { time: '20:00', flow: 2000, pressure: 46 },
  { time: '24:00', flow: 1850, pressure: 44 }
];

const zoneData = [
  { name: 'Zone 1', value: 30, color: colors.accent },
  { name: 'Zone 2', value: 25, color: colors.status.info },
  { name: 'Zone 3', value: 20, color: colors.status.warning },
  { name: 'Zone 4', value: 15, color: colors.status.success },
  { name: 'Zone 5', value: 10, color: colors.primary }
];

const qualityMetrics = [
  { parameter: 'pH Level', value: 7.2, optimal: 7.0, unit: '', status: 'good' },
  { parameter: 'Chlorine', value: 1.2, optimal: 1.0, unit: 'mg/L', status: 'good' },
  { parameter: 'Turbidity', value: 0.8, optimal: 0.5, unit: 'NTU', status: 'warning' },
  { parameter: 'Temperature', value: 23, optimal: 22, unit: '°C', status: 'good' }
];

// Custom label component with enhanced styling
const renderCustomLabel = (props: any) => {
  const { x, y, value, index } = props;
  
  // Only show labels for every other point to avoid crowding
  if (index % 2 !== 0 && index !== props.data.length - 1) return null;
  
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Background rectangle with glassmorphism effect */}
      <rect
        x={-20}
        y={-25}
        width={40}
        height={20}
        rx={4}
        fill="rgba(78, 68, 86, 0.9)"
        stroke="rgba(0, 210, 179, 0.5)"
        strokeWidth={1}
        filter="blur(0.5px)"
      />
      {/* Text label */}
      <text
        x={0}
        y={-10}
        fill="#00D2B3"
        textAnchor="middle"
        fontSize={12}
        fontWeight="600"
      >
        {value}
      </text>
    </g>
  );
};

// Enhanced custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 min-w-[150px]">
        <p className="text-white/80 text-sm font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between items-center space-x-4">
            <span className="text-white/60 text-xs capitalize">{entry.name}:</span>
            <span className="text-white font-semibold text-sm">
              {entry.value} {entry.name === 'flow' ? 'L/min' : 'PSI'}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const WaterSystemDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showDataLabels, setShowDataLabels] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg p-4 md:p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-white/10 rounded-lg w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-white/10 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-6 lg:p-8 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Water System Dashboard
          </h1>
          <p className="text-white/60">Real-time monitoring and analytics</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <GradientButton 
            variant="outline" 
            size="sm" 
            icon={RefreshCw}
            onClick={handleRefresh}
            className={refreshing ? 'animate-spin' : ''}
          >
            Refresh
          </GradientButton>
          <GradientButton 
            variant="primary" 
            size="sm" 
            icon={Download}
          >
            Export Report
          </GradientButton>
        </div>
      </div>

      {/* Key Metrics */}
      <ResponsiveGrid 
        cols={{ mobile: 1, tablet: 2, desktop: 4 }}
        className="mb-6"
      >
        <MetricCard
          label="Total Flow Rate"
          value="2,345"
          unit="L/min"
          trend="+12%"
          icon={Droplet}
          color={colors.accent}
        />
        <MetricCard
          label="System Pressure"
          value="48.5"
          unit="PSI"
          trend="+2%"
          icon={Activity}
          color={colors.status.info}
        />
        <MetricCard
          label="Daily Consumption"
          value="156.8"
          unit="m³"
          trend="-5%"
          icon={TrendingUp}
          color={colors.status.warning}
        />
        <MetricCard
          label="Active Zones"
          value="5/5"
          trend="100%"
          icon={Activity}
          color={colors.status.success}
        />
      </ResponsiveGrid>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {/* Enhanced Flow Trends Chart */}
        <GlassCard className="p-4 md:p-6 lg:col-span-2 xl:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">24h Flow Trends</h3>
            <button
              onClick={() => setShowDataLabels(!showDataLabels)}
              className="text-xs text-white/60 hover:text-white transition-colors px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
            >
              {showDataLabels ? 'Hide' : 'Show'} Labels
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={flowData} margin={{ top: 30, right: 10, left: 10, bottom: 0 }}>
              <ChartGradients />
              {/* Subtle grid for better readability */}
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.05)" 
                vertical={false}
              />
              <XAxis 
                dataKey="time" 
                stroke={colors.text.muted}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke={colors.text.muted}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                domain={['dataMin - 100', 'dataMax + 100']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="flow" 
                stroke={colors.accent}
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorGradient)"
                animationDuration={1000}
              >
                {showDataLabels && (
                  <LabelList 
                    dataKey="flow" 
                    position="top" 
                    content={renderCustomLabel}
                  />
                )}
              </Area>
            </AreaChart>
          </ResponsiveContainer>
          
          {/* Chart Legend */}
          <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#00D2B3]" />
              <span className="text-white/60">Flow Rate (L/min)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#6C63FF]" />
              <span className="text-white/60">Pressure (PSI)</span>
            </div>
          </div>
        </GlassCard>

        {/* Zone Distribution */}
        <GlassCard className="p-4 md:p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Zone Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={zoneData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {zoneData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...getChartConfig().tooltip} />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Water Quality */}
        <GlassCard className="p-4 md:p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Water Quality</h3>
          <div className="space-y-4">
            {qualityMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">{metric.parameter}</span>
                  <div className="flex items-baseline space-x-1">
                    <span className={`font-semibold ${
                      metric.status === 'good' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {metric.value}
                    </span>
                    <span className="text-white/60 text-xs">{metric.unit}</span>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      metric.status === 'good' 
                        ? 'bg-gradient-to-r from-green-400 to-green-600' 
                        : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    }`}
                    style={{ 
                      width: `${Math.min((metric.value / (metric.optimal * 1.5)) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Alerts Section */}
      <GlassCard variant="warning" className="p-4 md:p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="text-yellow-500 flex-shrink-0 animate-pulse" size={24} />
          <div className="flex-1">
            <h4 className="text-yellow-500 font-semibold mb-1">Maintenance Alert</h4>
            <p className="text-white/80 text-sm">
              Zone 3 pump efficiency has dropped below 85%. Scheduled maintenance recommended within 48 hours.
            </p>
          </div>
          <GradientButton variant="outline" size="sm">
            Schedule
          </GradientButton>
        </div>
      </GlassCard>
    </div>
  );
};

// Metric Card Component
const MetricCard: React.FC<{
  label: string;
  value: string;
  unit?: string;
  trend?: string;
  icon: any;
  color: string;
}> = ({ label, value, unit, trend, icon: Icon, color }) => {
  const isPositiveTrend = trend?.startsWith('+');
  
  return (
    <GlassCard className="p-4 md:p-6 hover:scale-105 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-white/60 text-sm">{label}</p>
          <div className="flex items-baseline space-x-1 mt-2">
            <p className="text-2xl md:text-3xl font-bold text-white">
              {value}
            </p>
            {unit && (
              <span className="text-lg text-white/80">{unit}</span>
            )}
          </div>
          {trend && (
            <div className="flex items-center mt-2 space-x-1">
              <TrendingUp 
                size={16} 
                className={isPositiveTrend ? 'text-green-400' : 'text-red-400'}
              />
              <span className={`text-sm ${
                isPositiveTrend ? 'text-green-400' : 'text-red-400'
              }`}>
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-white/10 rounded-lg">
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </GlassCard>
  );
};

export default WaterSystemDashboard;