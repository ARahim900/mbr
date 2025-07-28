// Visualization Fixes Implementation
// This file implements all the fixes mentioned for visualization issues

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Enhanced Chart Container with Mobile Fixes
export const EnhancedChartContainer: React.FC<{ children: React.ReactNode; height?: number }> = ({ children, height = 400 }) => {
  return (
    <div className="chart-container" style={{
      width: '100%',
      height: `${height}px`,
      position: 'relative',
      marginBottom: '20px'
    }}>
      <style>{`
        @media (max-width: 768px) {
          .chart-container {
            height: 300px !important;
            padding: 10px;
          }
          
          .recharts-responsive-container {
            width: 100% !important;
            height: 100% !important;
          }
          
          .recharts-surface {
            overflow: visible !important;
          }
          
          .recharts-cartesian-axis-tick-value {
            font-size: 10px !important;
          }
          
          .recharts-legend-wrapper {
            bottom: -10px !important;
          }
        }
      `}</style>
      {children}
    </div>
  );
};

// Enhanced Tooltip with Glassmorphism
export const EnhancedTooltip: React.FC<{ active?: boolean; payload?: any; label?: string }> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      minWidth: '150px'
    }}>
      <p style={{
        margin: '0 0 8px 0',
        fontWeight: '600',
        fontSize: '14px',
        color: '#1a1a1a'
      }}>
        {label}
      </p>
      {payload.map((entry: any, index: number) => (
        <p key={index} style={{
          margin: '4px 0',
          fontSize: '13px',
          color: entry.color,
          fontWeight: '500'
        }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

// Fixed Chart Component with All Enhancements
export const FixedLineChart: React.FC<{ data: any[]; dataKeys: string[]; colors: string[] }> = ({ data, dataKeys, colors }) => {
  return (
    <EnhancedChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(0, 0, 0, 0.1)"
            vertical={false}
          />
          <XAxis 
            dataKey="name"
            tick={{ fontSize: 12, fill: '#666' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#666' }}
            width={60}
          />
          <Tooltip content={<EnhancedTooltip />} />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '14px'
            }}
            iconType="line"
          />
          {dataKeys.map((key: string, index: number) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index] || '#3b82f6'}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </EnhancedChartContainer>
  );
};

// Mobile Viewport Fix Hook
export const useMobileViewportFix = () => {
  React.useEffect(() => {
    // Fix viewport height on mobile
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);
};

// Export all fixes
export default {
  EnhancedChartContainer,
  EnhancedTooltip,
  FixedLineChart,
  useMobileViewportFix
};