import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  percentage: number;
  value: number;
  title: string;
  subtitle: string;
  color: string;
  size?: number;
  unit?: string;
}

const RadialProgress: React.FC<GaugeChartProps> = ({ percentage, value, title, subtitle, color, size = 120, unit = 'm³' }) => {
  const data = [
    { name: 'value', value: isFinite(percentage) ? percentage : 0 },
    { name: 'remainder', value: isFinite(percentage) ? 100 - percentage : 100 },
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 h-full">
      <div style={{ width: size, height: size }} className="relative mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={'80%'}
              outerRadius={'100%'}
              startAngle={90}
              endAngle={450}
              dataKey="value"
              stroke="none"
              cornerRadius={50}
            >
              <Cell fill={color} />
              <Cell fill="#E5E7EB" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <span className="text-2xl font-bold text-primary dark:text-white">
            {isFinite(percentage) ? `${Math.round(percentage)}%` : 'N/A'}
          </span>
        </div>
      </div>
      <p className="text-sm font-semibold text-primary dark:text-white leading-tight">{title}</p>
      <p className="text-lg font-bold" style={{ color }}>
         {value.toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-sm font-medium text-secondary">{unit}</span>
      </p>
      <p className="text-xs text-secondary dark:text-gray-400">{subtitle}</p>
    </div>
  );
};

export default RadialProgress;