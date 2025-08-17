import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartTest: React.FC = () => {
  // Simple test data
  const testData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 500 },
    { name: 'Apr', value: 280 },
    { name: 'May', value: 590 },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Chart Test Component</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Test Data:</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(testData, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Chart Container:</h3>
        <div className="border-2 border-blue-500 p-4 rounded" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={testData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Environment Info:</h3>
        <div className="bg-gray-100 p-2 rounded text-sm">
          <p>React Version: {React.version}</p>
          <p>Window Width: {typeof window !== 'undefined' ? window.innerWidth : 'N/A'}px</p>
          <p>Window Height: {typeof window !== 'undefined' ? window.innerHeight : 'N/A'}px</p>
          <p>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Console Check:</h3>
        <p className="text-sm text-gray-600">
          Open browser console (F12) and check for any error messages related to charts or Recharts.
        </p>
      </div>
    </div>
  );
};

export default ChartTest;
