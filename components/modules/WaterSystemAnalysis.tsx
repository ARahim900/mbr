import React, { useState } from 'react';
import { 
  BarChart3, 
  Droplets, 
  TrendingDown, 
  Database,
  Settings,
  Calendar,
  Filter,
  ChevronDown
} from 'lucide-react';
import { NavigationTabs, SecondaryNavigation } from '../ui/NavigationTabs';

const WaterSystemAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState('zone-analysis');
  const [selectedMonth, setSelectedMonth] = useState('May-25');
  const [selectedZone, setSelectedZone] = useState('Zone 03(A)');
  const [showFilters, setShowFilters] = useState(false);

  // Main navigation tabs
  const mainTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'water-loss', label: 'Water Loss Analysis', icon: TrendingDown },
    { id: 'zone-analysis', label: 'Zone Analysis', icon: Droplets },
    { id: 'consumption-type', label: 'Consumption by Type', icon: Settings },
    { id: 'main-database', label: 'Main Database', icon: Database }
  ];

  // Secondary navigation for sub-sections
  const secondaryNavigation = [
    { id: 'overview-icon', label: 'Over', icon: BarChart3 },
    { id: 'loss-icon', label: 'Loss', icon: TrendingDown },
    { id: 'zone-icon', label: 'Zone', icon: Droplets },
    { id: 'type-icon', label: 'Type', icon: Settings },
    { id: 'data-icon', label: 'Data', icon: Database }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
            Water System Analysis
          </h1>
          
          {/* Main Navigation Tabs */}
          <NavigationTabs
            tabs={mainTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="mb-4"
          />
          
          {/* Secondary Navigation Icons */}
          <SecondaryNavigation
            items={secondaryNavigation}
            activeItem={`${activeTab.split('-')[0]}-icon`}
            onItemChange={(itemId) => {
              const tabId = itemId.replace('-icon', '');
              if (tabId === 'overview') setActiveTab('overview');
              else if (tabId === 'loss') setActiveTab('water-loss');
              else if (tabId === 'zone') setActiveTab('zone-analysis');
              else if (tabId === 'type') setActiveTab('consumption-type');
              else if (tabId === 'data') setActiveTab('main-database');
            }}
          />
        </div>

        {/* Filter Options */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col lg:flex-row gap-4 flex-1">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Filter Options</label>
                <span className="text-xs text-gray-500">Select Month</span>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-4 flex-1">
                {/* Month Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white/70 transition-all duration-300 min-w-[120px]"
                  >
                    <Calendar size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{selectedMonth}</span>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>
                </div>

                {/* Zone Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by Zone</span>
                  <div className="relative">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white/70 transition-all duration-300 min-w-[140px]">
                      <Filter size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{selectedZone}</span>
                      <ChevronDown size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Range Selection Button */}
            <button className="px-6 py-2.5 bg-gradient-to-r from-[#4E4456] to-[#5D4D67] text-white rounded-lg hover:shadow-lg hover:shadow-[#4E4456]/20 transition-all duration-300 font-medium">
              <span className="flex items-center gap-2">
                <Settings size={16} />
                Reset Filters
              </span>
            </button>
          </div>
        </div>

        {/* Zone Analysis Header */}
        <div className="text-center py-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            Zone 03(A) Analysis for May-25
          </h2>
          <p className="text-gray-600">Zone with building bulk meters and individual villas</p>
        </div>

        {/* Water Consumption Analysis Section */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Water Consumption Analysis</h3>
          
          {/* Consumption Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Zone Bulk Meter */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4 mx-auto">
                <span className="text-2xl font-bold text-white">4,898</span>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-blue-800 text-sm mb-1">Zone Bulk Meter</h4>
                <p className="text-xs text-blue-600 mb-2">Zone 03(A) Total</p>
                <div className="text-2xl font-bold text-blue-800">100%</div>
              </div>
            </div>

            {/* Individual Meters Sum */}
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-200">
              <div className="flex items-center justify-center w-16 h-16 bg-cyan-500 rounded-full mb-4 mx-auto">
                <span className="text-2xl font-bold text-white">2,054</span>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-cyan-800 text-sm mb-1">Individual Meters Sum</h4>
                <p className="text-xs text-cyan-600 mb-2">Total Consumption</p>
                <div className="text-2xl font-bold text-cyan-800">42%</div>
              </div>
            </div>

            {/* Water Loss */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <div className="flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4 mx-auto">
                <span className="text-2xl font-bold text-white">2,844</span>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-red-800 text-sm mb-1">Water Loss</h4>
                <p className="text-xs text-red-600 mb-2">Unaccounted Loss</p>
                <div className="text-2xl font-bold text-red-800">58%</div>
              </div>
            </div>
          </div>

          {/* Zone Consumption Trend */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">Zone Consumption Trend</h4>
            <p className="text-sm text-gray-600 mb-4">Monthly comparison of zone bulk meter vs individual meters total</p>
            
            {/* Placeholder for chart - in real implementation, this would be a proper chart */}
            <div className="h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center border border-purple-200">
              <div className="text-center">
                <BarChart3 size={48} className="text-purple-600 mx-auto mb-2" />
                <p className="text-purple-700 font-medium">Interactive Chart Area</p>
                <p className="text-sm text-purple-600">Consumption trend visualization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="font-bold">ZB</span>
              </div>
              <div>
                <p className="text-sm opacity-90">ZONE BULK METER</p>
                <p className="text-2xl font-bold">4,898 m³</p>
                <p className="text-xs opacity-75">Zone 03(A)</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="font-bold">IM</span>
              </div>
              <div>
                <p className="text-sm opacity-90">INDIVIDUAL METERS TOTAL</p>
                <p className="text-2xl font-bold">2,054 m³</p>
                <p className="text-xs opacity-75">Metered consumption total</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="font-bold">WL</span>
              </div>
              <div>
                <p className="text-sm opacity-90">WATER LOSS/VARIANCE</p>
                <p className="text-2xl font-bold">2844 m³</p>
                <p className="text-xs opacity-75">58.1% variance total</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="font-bold">ZE</span>
              </div>
              <div>
                <p className="text-sm opacity-90">ZONE EFFICIENCY</p>
                <p className="text-2xl font-bold">41.9%</p>
                <p className="text-xs opacity-75">Meter coverage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterSystemAnalysis;