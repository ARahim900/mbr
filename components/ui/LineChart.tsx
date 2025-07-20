
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface LineChartProps {
  data: any[];
  lines: {
    key: string;
    color: string;
    name: string;
  }[];
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showArea?: boolean;
  yAxisDomain?: [number | 'auto', number | 'auto'];
}

export default function LineChart({
  data,
  lines,
  xAxisKey,
  height = 300,
  showGrid = false,
  showArea = false,
  yAxisDomain = ['auto', 'auto']
}: LineChartProps) {
  const Chart = showArea ? AreaChart : RechartsLineChart;
  
  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {lines.map((line) => (
              <linearGradient key={line.key} id={`gradient-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={line.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={line.color} stopOpacity={0.2}/>
              </linearGradient>
            ))}
          </defs>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          )}
          <XAxis 
            dataKey={xAxisKey} 
            stroke="rgba(255,255,255,0.6)"
            tick={{ fill: 'rgba(255,255,255,0.6)' }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.6)"
            tick={{ fill: 'rgba(255,255,255,0.6)' }}
            domain={yAxisDomain}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(78, 68, 86, 0.9)', 
              border: 'none',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              color: 'rgba(255,255,255,0.8)'
            }}
          />
          {showArea ? (
            lines.map(line => (
              <Area
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={2}
                fill={`url(#gradient-${line.key})`}
                name={line.name}
              />
            ))
          ) : (
            lines.map(line => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={3}
                dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name={line.name}
              />
            ))
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}