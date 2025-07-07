'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Droplets, 
  MapPin,
  Calendar,
  Filter,
  RefreshCw,
  FileDatabase
} from 'lucide-react';
import { getZoneAnalysisData, getAllZones, getMonthlyData } from '../data/waterDatabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const WaterSystemModule = () => {
  const [activeTab, setActiveTab] = useState('zone-analysis');
  const [selectedMonth, setSelectedMonth] = useState('May-25');
  const [selectedZone, setSelectedZone] = useState('Sales Center');
  const [zoneData, setZoneData] = useState<any>(null);
  const [allZones, setAllZones] = useState<string[]>([]);

  useEffect(() => {
    // Load all zones
    const zones = getAllZones();
    setAllZones(zones);
    
    // Load zone data
    if (selectedZone && selectedMonth) {
      const data = getZoneAnalysisData(selectedZone, selectedMonth);
      setZoneData(data);
    }
  }, [selectedZone, selectedMonth]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'water-loss', label: 'Water Loss Analysis', icon: TrendingUp },
    { id: 'zone-analysis', label: 'Zone Analysis', icon: MapPin },
    { id: 'consumption-type', label: 'Consumption by Type', icon: Droplets },
    { id: 'main-database', label: 'Main Database', icon: FileDatabase },
  ];

  const months = [
    'Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25',
    'Jun-25', 'Jul-25', 'Aug-25', 'Sep-25', 'Oct-25', 'Nov-25', 'Dec-25'
  ];

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const renderZoneAnalysis = () => {
    if (!zoneData) return <div>Loading...</div>;

    const {
      zoneBulkConsumption,
      sumOfIndividualMeters,
      distributionLoss,
      efficiency,
      meters
    } = zoneData;

    const lossPercentage = zoneBulkConsumption > 0 
      ? ((distributionLoss / zoneBulkConsumption) * 100).toFixed(0)
      : '0';

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {selectedZone} Analysis for {selectedMonth}
          </h2>
          <p className="text-gray-600">
            Zone bulk vs individual meters consumption analysis
          </p>
        </div>

        {/* Consumption Analysis */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Water Consumption Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Zone Bulk Consumption */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-40 h-40">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset="0"
                    transform="rotate(-90 80 80)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">100%</span>
                </div>
              </div>
              <h4 className="text-lg font-semibold mt-4">Zone Bulk Consumption</h4>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {formatNumber(zoneBulkConsumption)} m³
              </p>
              <p className="text-sm text-gray-600">
                {selectedZone === 'Direct Connection' ? 'Main Bulk (NAMA)' : selectedZone} Total
              </p>
            </div>

            {/* Sum of Individual Meters */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-40 h-40">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 70 * (efficiency/100)}, ${2 * Math.PI * 70}`}
                    transform="rotate(-90 80 80)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{efficiency.toFixed(0)}%</span>
                </div>
              </div>
              <h4 className="text-lg font-semibold mt-4">Sum of Individual Meters</h4>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {formatNumber(sumOfIndividualMeters)} m³
              </p>
              <p className="text-sm text-gray-600">
                {selectedZone === 'Direct Connection' ? 'Total A2 Consumption' : 'Total L3 Consumption'}
              </p>
            </div>

            {/* Distribution Loss */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-40 h-40">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 70 * (Math.abs(distributionLoss)/zoneBulkConsumption)}, ${2 * Math.PI * 70}`}
                    transform="rotate(-90 80 80)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{lossPercentage}%</span>
                </div>
              </div>
              <h4 className="text-lg font-semibold mt-4">Distribution Loss</h4>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {formatNumber(Math.abs(distributionLoss))} m³
              </p>
              <p className="text-sm text-gray-600">from Zone Bulk</p>
            </div>
          </div>
        </div>

        {/* Meter Details Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {selectedZone} - Meter Details for {selectedMonth}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {meters.length} meters in this zone
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Meter Label</th>
                  <th className="text-left py-3 px-4">Account #</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-right py-3 px-4">Consumption (m³)</th>
                  <th className="text-right py-3 px-4">% of Zone Total</th>
                  <th className="text-center py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {meters.map((meter: any, index: number) => {
                  const consumption = Number(meter[selectedMonth]) || 0;
                  const percentage = zoneBulkConsumption > 0 
                    ? ((consumption / zoneBulkConsumption) * 100).toFixed(1)
                    : '0';
                  
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{meter['Meter Label']}</td>
                      <td className="py-3 px-4">{meter['Acct #']}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          meter.Type === 'Zone Bulk' ? 'bg-blue-100 text-blue-800' : 
                          meter.Type === 'A1 - NAMA' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {meter.Type}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 font-semibold">
                        {formatNumber(consumption)}
                      </td>
                      <td className="text-right py-3 px-4">{percentage}%</td>
                      <td className="text-center py-3 px-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          meter.Label.includes('L2') ? 'bg-blue-100 text-blue-800' :
                          meter.Label.includes('A1') ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {meter.Label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="mt-6 pt-4 border-t grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Zone Individual Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatNumber(sumOfIndividualMeters)} m³
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Zone Efficiency</p>
              <p className="text-2xl font-bold text-green-600">
                {efficiency.toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Zone Loss</p>
              <p className="text-2xl font-bold text-red-600">
                {formatNumber(Math.abs(distributionLoss))} m³
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Water System Analysis
          </h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex flex-wrap items-center p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 m-1 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters for Zone Analysis */}
        {activeTab === 'zone-analysis' && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Month
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Zone
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {allZones.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button className="flex items-center justify-center px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors w-full">
                  <Filter className="w-5 h-5 mr-2" />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'zone-analysis' && renderZoneAnalysis()}
          {activeTab !== 'zone-analysis' && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">
                {tabs.find(t => t.id === activeTab)?.label} - Coming Soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterSystemModule;