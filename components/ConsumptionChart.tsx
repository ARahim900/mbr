
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ConsumptionChartProps {
  data: any[];
}

const zoneColors: { [key: string]: string } = {
    "Zone_05": "#00D2B3",
    "Zone_03_(A)": "#3B82F6",
    "Zone_03_(B)": "#8B5CF6",
    "Zone_08": "#F59E0B",
    "Zone_01_(FM)": "#EF4444",
    "Zone_SC": "#10B981",
    "Zone_VS": "#6366F1",
};

// Modern gradient colors
const zoneGradients: { [key: string]: { start: string; end: string } } = {
    "Zone_05": { start: "#00D2B3", end: "#00A693" },
    "Zone_03_(A)": { start: "#3B82F6", end: "#2563EB" },
    "Zone_03_(B)": { start: "#8B5CF6", end: "#7C3AED" },
    "Zone_08": { start: "#F59E0B", end: "#D97706" },
    "Zone_01_(FM)": { start: "#EF4444", end: "#DC2626" },
    "Zone_SC": { start: "#10B981", end: "#059669" },
    "Zone_VS": { start: "#6366F1", end: "#4F46E5" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-2xl border border-white/20">
        <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm text-gray-600">
              {entry.name}: <span className="font-semibold text-gray-800">{entry.value.toLocaleString()} m³</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
          <div 
            className="w-3 h-3 rounded-full shadow-sm" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs font-medium text-gray-700">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No chart data available</p>
        </div>
      </div>
    );
  }

  const keys = Object.keys(data[0] || {}).filter(key => key !== 'name');

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100 h-96 hover:shadow-2xl transition-shadow duration-300">
      <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
        Monthly Consumption by Zone (m³)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 80,
          }}
        >
          <defs>
            {Object.entries(zoneGradients).map(([zone, gradient]) => (
              <linearGradient key={zone} id={`gradient-${zone}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradient.start} stopOpacity={1} />
                <stop offset="100%" stopColor={gradient.end} stopOpacity={0.8} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="0" stroke="transparent" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={60} 
            stroke="#9CA3AF"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
            tickLine={false}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
          />
          <Legend content={<CustomLegend />} />
          {keys.map(key => (
            <Bar 
              key={key} 
              dataKey={key} 
              fill={`url(#gradient-${key})`}
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumptionChart;