
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ConsumptionChartProps {
  data: any[];
}

const zoneColors: { [key: string]: string } = {
    "Zone_05": "#1abc9c",
    "Zone_03_(A)": "#3498db",
    "Zone_03_(B)": "#4E4456",
    "Zone_08": "#f1c40f",
    "Zone_01_(FM)": "#e67e22",
    "Zone_SC": "#e74c3c",
    "Zone_VS": "#34495e",
};

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-4">No chart data available.</div>;
  }

  const keys = Object.keys(data[0] || {}).filter(key => key !== 'name');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-96">
        <h3 className="text-xl font-bold text-primary mb-4">Monthly Consumption by Zone (m³)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 25,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DEE2E6"/>
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} stroke="#6C757D" />
          <YAxis stroke="#6C757D"/>
          <Tooltip
            contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #DEE2E6',
                borderRadius: '0.5rem',
            }}
          />
          <Legend wrapperStyle={{paddingTop: '20px'}} />
          {keys.map(key => (
            <Bar key={key} dataKey={key} fill={zoneColors[key] || '#7DDDD3'} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumptionChart;