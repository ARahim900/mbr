// src/components/Charts/OptimizedChart.tsx
import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { decimateData } from '../../utils/performance';
import { GlassmorphicCard } from '../UI/EnhancedGlassmorphism';

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface OptimizedChartProps {
  data: ChartDataPoint[];
  type: 'line' | 'area' | 'bar';
  title: string;
  dataKey?: string;
  color?: string;
  height?: number;
  enableAnimation?: boolean;
  maxDataPoints?: number;
  showGrid?: boolean;
}

export const OptimizedChart: React.FC<OptimizedChartProps> = ({
  data,
  type = 'line',
  title,
  dataKey = 'value',
  color = '#3b82f6',
  height = 300,
  enableAnimation = true,
  maxDataPoints = 500,
  showGrid = true
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Optimize data for performance
  const optimizedData = useMemo(() => {
    return decimateData(data, maxDataPoints, (item) => item.value);
  }, [data, maxDataPoints]);

  // Custom tooltip with glassmorphism
  const CustomTooltip = useCallback(({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="p-3 rounded-lg"
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.3)',
        }}
      >
        <p className="text-white/80 text-sm font-medium">{label}</p>
        <p className="text-white text-lg font-bold">
          {payload[0].value?.toLocaleString()}
        </p>
      </motion.div>
    );
  }, []);

  // Chart components based on type
  const ChartComponent = useMemo(() => {
    const commonProps = {
      data: optimizedData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const gridProps = {
      strokeDasharray: "3 3",
      stroke: "rgba(255, 255, 255, 0.05)"
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis 
              dataKey="name" 
              stroke="rgba(255, 255, 255, 0.5)"
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.5)"
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id={`colorGradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#colorGradient-${dataKey})`}
              animationDuration={enableAnimation ? 1500 : 0}
            />
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis 
              dataKey="name" 
              stroke="rgba(255, 255, 255, 0.5)"
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.5)"
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey={dataKey} 
              fill={color}
              radius={[8, 8, 0, 0]}
              animationDuration={enableAnimation ? 1500 : 0}
            />
          </BarChart>
        );
      
      default:
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis 
              dataKey="name" 
              stroke="rgba(255, 255, 255, 0.5)"
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.5)"
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              animationDuration={enableAnimation ? 1500 : 0}
            />
          </LineChart>
        );
    }
  }, [type, optimizedData, showGrid, dataKey, color, enableAnimation, CustomTooltip]);

  // Intersection Observer for lazy rendering
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Chart is visible, trigger any lazy loading
            entry.target.classList.add('chart-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <GlassmorphicCard variant="deep" className="p-6">
      <h3 className="text-lg font-semibold text-white/90 mb-4">{title}</h3>
      <div 
        ref={chartRef}
        className="relative"
        style={{ height }}
      >
        <ResponsiveContainer width="100%" height="100%">
          {ChartComponent}
        </ResponsiveContainer>
        
        {/* Performance indicator */}
        {data.length > maxDataPoints && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
            <p className="text-xs text-yellow-300">
              Showing {optimizedData.length} of {data.length} points
            </p>
          </div>
        )}
      </div>
    </GlassmorphicCard>
  );
};

export default OptimizedChart;