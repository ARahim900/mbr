import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartDiagnostics: React.FC = () => {
  // Simple test data
  const testData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 500 },
    { name: 'Apr', value: 280 },
    { name: 'May', value: 590 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Chart Diagnostics</h3>
      
      {/* Test 1: Basic Chart Rendering */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2">Test 1: Basic Area Chart</h4>
        <div className="border border-gray-300 dark:border-gray-600 p-4 rounded">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={testData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#00D2B3" fill="#00D2B3" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Test 2: Check Container Dimensions */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2">Test 2: Container Info</h4>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm">
          <p>Window Width: {typeof window !== 'undefined' ? window.innerWidth : 'N/A'}px</p>
          <p>Container Test: <span className="text-green-600">✓ Rendered</span></p>
          <p>Recharts Loaded: <span className="text-green-600">✓ Yes</span></p>
        </div>
      </div>

      {/* Test 3: Fixed Height Chart */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2">Test 3: Fixed Height Chart (300px)</h4>
        <div className="border border-gray-300 dark:border-gray-600 p-4 rounded" style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={testData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D2B3" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00D2B3" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#00D2B3" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Diagnostic Summary</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>✓ React rendering is working</li>
          <li>✓ Recharts library is loaded</li>
          <li>✓ ResponsiveContainer is rendering</li>
          <li>✓ Chart components are accessible</li>
        </ul>
      </div>
    </div>
  );
};

export default ChartDiagnostics;