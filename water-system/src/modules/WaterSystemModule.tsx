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
  Database,
  Upload
} from 'lucide-react';
import { waterDataService } from '../data/waterDataService';
import { useIsMobile } from '../../../hooks/useIsMobile';
import WaterMeterCard from '../../../components/mobile/WaterMeterCard';

const WaterSystemModule = () => {
  const [activeTab, setActiveTab] = useState('zone-analysis');
  const [selectedMonth, setSelectedMonth] = useState('May-25');
  const [selectedZone, setSelectedZone] = useState('Zone 03(A)');
  const [zoneData, setZoneData] = useState<any>(null);
  const [allZones, setAllZones] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use responsive hook
  const isMobile = useIsMobile();

  useEffect(() => {
    loadZoneData();
  }, [selectedZone, selectedMonth]);

  const loadZoneData = () => {
    // Load all zones
    const zones = waterDataService.getAllZones();
    setAllZones(zones);
    
    // Load zone data
    if (selectedZone && selectedMonth) {
      const data = waterDataService.getZoneAnalysisData(selectedZone, selectedMonth);
      setZoneData(data);
      
      // Debug logging
      // console.log('Zone Data:', data);
      if (!waterDataService.hasData()) {
        // console.log('No data loaded. Please upload CSV file.');
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvContent = e.target?.result as string;
        await waterDataService.loadFromCSV(csvContent);
        waterDataService.debugZoneBulkMeters(); // Debug output
        loadZoneData();
        setIsLoading(false);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'water-loss', label: 'Water Loss Analysis', icon: TrendingUp },
    { id: 'zone-analysis', label: 'Zone Analysis', icon: MapPin },
    { id: 'consumption-type', label: 'Consumption by Type', icon: Droplets },
    { id: 'main-database', label: 'Main Database', icon: Database },
  ];

  const months = [
    'Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25',
    'Jun-25', 'Jul-25', 'Aug-25', 'Sep-25', 'Oct-25', 'Nov-25', 'Dec-25'
  ];

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const renderZoneAnalysis = () => {
    if (!zoneData) return <div>Loading... Please upload CSV data.</div>;

    const {
      zoneBulkConsumption,
      buildingBulkConsumption,
      villasConsumption,
      buildingCount,
      villaCount,
      meters
    } = zoneData;

    // Calculate percentages based on zone bulk
    const buildingPercentage = zoneBulkConsumption > 0 
      ? ((buildingBulkConsumption / zoneBulkConsumption) * 100)
      : 0;
    
    const villasPercentage = zoneBulkConsumption > 0 
      ? ((villasConsumption / zoneBulkConsumption) * 100)
      : 0;

    return (
      <div className="space-y-6">
        {/* Upload Button */}
        <div className="flex justify-end mb-4">
          <label className="cursor-pointer flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Upload className="w-5 h-5 mr-2" />
            Upload CSV Data
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {selectedZone} Analysis for {selectedMonth}
          </h2>
          <p className="text-gray-600">
            Zone bulk vs building/villas meters consumption analysis
          </p>
        </div>

        {/* Consumption Analysis */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Water Consumption Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Zone Bulk */}
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
              <h4 className="text-lg font-semibold mt-4">Zone Bulk</h4>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {formatNumber(zoneBulkConsumption)} m³
              </p>
              <p className="text-sm text-gray-600">
                {selectedZone} Total
              </p>
            </div>

            {/* Building Bulk */}
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
                    strokeDasharray={`${2 * Math.PI * 70 * (buildingPercentage/100)}, ${2 * Math.PI * 70}`}
                    transform="rotate(-90 80 80)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{buildingPercentage.toFixed(0)}%</span>
                </div>
              </div>
              <h4 className="text-lg font-semibold mt-4">Building Bulk</h4>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {formatNumber(buildingBulkConsumption)} m³
              </p>
              <p className="text-sm text-gray-600">
                {buildingCount} Buildings
              </p>
            </div>

            {/* Villas */}
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
                    strokeDasharray={`${2 * Math.PI * 70 * (villasPercentage/100)}, ${2 * Math.PI * 70}`}
                    transform="rotate(-90 80 80)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{villasPercentage.toFixed(0)}%</span>
                </div>
              </div>
              <h4 className="text-lg font-semibold mt-4">Villas</h4>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {formatNumber(villasConsumption)} m³
              </p>
              <p className="text-sm text-gray-600">
                {villaCount} Villas
              </p>
            </div>
          </div>
        </div>

        {/* Meter Details - Responsive Table/Cards */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {selectedZone} - Meter Details for {selectedMonth}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {meters.length} meters in this zone
          </p>
          
          {/* Mobile Cards View */}
          {isMobile ? (
            <div className="space-y-4">
              {meters.map((meter: any, index: number) => {
                const consumption = Number(meter[selectedMonth]) || 0;
                const percentage = zoneBulkConsumption > 0 
                  ? ((consumption / zoneBulkConsumption) * 100).toFixed(1)
                  : '0';
                
                return (
                  <WaterMeterCard
                    key={index}
                    meterLabel={meter['Meter Label']}
                    accountNumber={meter['Acct #']}
                    type={meter.Type}
                    consumption={consumption}
                    percentage={parseFloat(percentage)}
                    status={meter.Label}
                    zoneBulkTotal={zoneBulkConsumption}
                  />
                );
              })}
            </div>
          ) : (
            /* Desktop Table View */
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
                            meter.Type === 'Building Bulk' ? 'bg-purple-100 text-purple-800' :
                            meter.Type === 'Villa' ? 'bg-green-100 text-green-800' :
                            meter.Type === 'A1 - NAMA' ? 'bg-red-100 text-red-800' :
                            meter.Type === 'DC - Direct Connection' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
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
                            meter.Label.includes('L3') ? 'bg-purple-100 text-purple-800' :
                            meter.Label.includes('L4') ? 'bg-green-100 text-green-800' :
                            meter.Label.includes('L5') ? 'bg-yellow-100 text-yellow-800' :
                            meter.Label.includes('A1') ? 'bg-red-100 text-red-800' :
                            meter.Label.includes('DC') ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
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
          )}

          {/* Summary Footer - Responsive Grid */}
          <div className={`mt-6 pt-4 border-t grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
            <div className="text-center">
              <p className="text-sm text-gray-600">Zone Bulk Total</p>
              <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-blue-600`}>
                {formatNumber(zoneBulkConsumption)} m³
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Building Bulk Total</p>
              <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-purple-600`}>
                {formatNumber(buildingBulkConsumption)} m³
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Villas Total</p>
              <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-green-600`}>
                {formatNumber(villasConsumption)} m³
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Individual</p>
              <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-800`}>
                {formatNumber(zoneData.sumOfIndividualMeters)} m³
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

        {/* Tabs - Responsive with Fixed Visibility Issue */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-wrap'} items-center p-2`}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 m-1 rounded-md transition-all duration-300 ${
                    isMobile ? 'w-full justify-center' : ''
                  } ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-lg transform scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters for Zone Analysis - Responsive */}
        {activeTab === 'zone-analysis' && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-4`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Month
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {allZones.length === 0 ? (
                      <option value="">Please upload CSV data</option>
                    ) : (
                      allZones.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className={`${isMobile ? '' : 'flex items-end'}`}>
                <button 
                  onClick={() => {
                    setSelectedMonth('May-25');
                    if (allZones.length > 0) {
                      setSelectedZone(allZones[0]);
                    }
                  }}
                  className="flex items-center justify-center px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors w-full"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Loading data...</span>
            </div>
          ) : (
            <>
              {activeTab === 'zone-analysis' && renderZoneAnalysis()}
              {activeTab !== 'zone-analysis' && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">
                    {tabs.find(t => t.id === activeTab)?.label} - Coming Soon
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterSystemModule;