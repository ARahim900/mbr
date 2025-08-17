import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

// Chart Fix Component - Addresses common chart rendering issues
const ChartFix: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);

  // Ensure component runs on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Test data
  const testData = [
    { name: 'Jan', value: 400, area: 300, bar: 200 },
    { name: 'Feb', value: 300, area: 400, bar: 300 },
    { name: 'Mar', value: 500, area: 200, bar: 400 },
    { name: 'Apr', value: 280, area: 500, bar: 100 },
    { name: 'May', value: 590, area: 100, bar: 500 },
  ];

  // Error boundary for charts
  const ChartWrapper: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
    try {
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <div className="border-2 border-blue-500 p-4 rounded" style={{ height: '300px' }}>
            {children}
          </div>
        </div>
      );
    } catch (error) {
      console.error(`Chart error in ${title}:`, error);
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <div className="border-2 border-red-500 p-4 rounded bg-red-50">
            <p className="text-red-600">Chart failed to render: {error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        </div>
      );
    }
  };

  if (!isClient) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Chart Fix Component</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Chart Fix Component</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Environment Check:</h3>
        <div className="bg-gray-100 p-2 rounded text-sm">
          <p>React Version: {React.version}</p>
          <p>Window Width: {window.innerWidth}px</p>
          <p>Window Height: {window.innerHeight}px</p>
          <p>User Agent: {navigator.userAgent}</p>
          <p>Recharts Available: {typeof LineChart !== 'undefined' ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Test Data:</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(testData, null, 2)}
        </pre>
      </div>

      {/* Test 1: Basic Line Chart */}
      <ChartWrapper title="Test 1: Basic Line Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={testData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Test 2: Area Chart */}
      <ChartWrapper title="Test 2: Area Chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={testData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="area" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Test 3: Bar Chart */}
      <ChartWrapper title="Test 3: Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={testData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bar" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Test 4: Complex Chart with Multiple Lines */}
      <ChartWrapper title="Test 4: Multiple Lines Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={testData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} name="Value" />
            <Line type="monotone" dataKey="area" stroke="#82ca9d" strokeWidth={2} name="Area" />
            <Line type="monotone" dataKey="bar" stroke="#ffc658" strokeWidth={2} name="Bar" />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Troubleshooting:</h3>
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
          <p className="text-yellow-800 text-sm">
            <strong>If charts are not visible:</strong>
          </p>
          <ul className="text-yellow-700 text-sm mt-2 list-disc list-inside">
            <li>Check browser console (F12) for JavaScript errors</li>
            <li>Ensure Recharts library is properly loaded</li>
            <li>Verify CSS is not hiding chart elements</li>
            <li>Check if there are any CSS conflicts</li>
            <li>Ensure container has proper dimensions</li>
          </ul>
        </div>
      </div>

      {chartError && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-red-600">Chart Error:</h3>
          <div className="bg-red-50 p-3 rounded border border-red-200">
            <p className="text-red-800">{chartError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartFix;
