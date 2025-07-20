import React, { useState, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, Database, LayoutDashboard, TrendingUp, Power, FileDown, RotateCw, Wallet, Tag } from 'lucide-react';

import { 
    electricityData, 
    electricityMonthsAvailable, 
    calculateElectricityTotalsForPeriod,
    getUniqueMeterTypes,
    filterDataByType,
    BILLING_RATE
} from '../../database/electricityDatabase';

import MetricCard from '../ui/MetricCard';
import ChartCard from '../ui/ChartCard';
import MonthRangeSlider from '../ui/MonthRangeSlider';
import Button from '../ui/Button';

const COLORS = ['#00D2B3', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#6366F1', '#EC4899', '#F97316', '#14B8A6'];

const electricitySubSections = [
    { name: 'Overview', id: 'Overview', icon: LayoutDashboard, shortName: 'Over' },
    { name: 'Analysis by Type', id: 'AnalysisByType', icon: Tag, shortName: 'Type' },
    { name: 'Database', id: 'Database', icon: Database, shortName: 'Data' },
];

const ModuleNavigation = ({ sections, activeSection, onSectionChange }: { sections: any[], activeSection: string, onSectionChange: (id: string) => void }) => (
  <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-3 mb-6 border border-gray-100">
    <nav className="flex flex-wrap items-center justify-center gap-2">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
            activeSection === section.id
              ? 'bg-gradient-to-r from-accent to-accent/80 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
          }`}
        >
          <section.icon className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">{section.name}</span>
          <span className="sm:hidden">{section.shortName}</span>
        </button>
      ))}
    </nav>
  </div>
);

const CustomTooltip = ({ active, payload, label, isCost = false }: any) => {
  if (active && payload && payload.length) {
    const unit = isCost ? 'OMR' : 'kWh';
    return (
      <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-2xl border border-white/20">
        <p className="font-bold text-gray-800 mb-2">{label}</p>
        {payload.map((pld: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pld.stroke || pld.fill }} />
            <p className="text-sm text-gray-600">
              {pld.name}: <span className="font-semibold text-gray-800">
                {pld.value.toLocaleString(undefined, { 
                  minimumFractionDigits: isCost ? 2 : 0, 
                  maximumFractionDigits: isCost ? 2 : 0 
                })} {unit}
              </span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ElectricityModule: React.FC = () => {
  const [activeSubSection, setActiveSubSection] = useState('Overview');
  const [dateRange, setDateRange] = useState({
    start: electricityMonthsAvailable[0],
    end: electricityMonthsAvailable[electricityMonthsAvailable.length - 1],
  });
  const [selectedType, setSelectedType] = useState('D_Building');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const uniqueTypes = useMemo(() => getUniqueMeterTypes(electricityData), []);

  const overviewCalculations = useMemo(() => {
    return calculateElectricityTotalsForPeriod(electricityData, dateRange.start, dateRange.end);
  }, [dateRange]);

  const typeAnalysisCalculations = useMemo(() => {
    const filtered = filterDataByType(electricityData, selectedType);
    return calculateElectricityTotalsForPeriod(filtered, dateRange.start, dateRange.end);
  }, [selectedType, dateRange]);

  const monthlyTrendData = useMemo(() => {
    return electricityMonthsAvailable.map(month => {
      const total = electricityData.reduce((acc, meter) => acc + (meter.consumption[month] || 0), 0);
      return {
        name: month,
        'Total Consumption': total,
      };
    });
  }, []);

  const typeMonthlyTrendData = useMemo(() => {
      const filtered = filterDataByType(electricityData, selectedType);
      return electricityMonthsAvailable.map(month => {
          const total = filtered.reduce((acc, meter) => acc + (meter.consumption[month] || 0), 0);
          return {
              name: month,
              'Consumption': total,
          };
      });
  }, [selectedType]);
  
  const consumptionByTypeChartData = useMemo(() => {
    return Object.entries(overviewCalculations.consumptionAndCostByType)
      .map(([type, data]) => ({
        name: type,
        'Consumption (kWh)': data.consumption,
        'Cost (OMR)': data.cost,
      }))
      .sort((a,b) => b['Consumption (kWh)'] - a['Consumption (kWh)']);
  }, [overviewCalculations.consumptionAndCostByType]);

  const resetDateRange = () => {
    setDateRange({
      start: electricityMonthsAvailable[0],
      end: electricityMonthsAvailable[electricityMonthsAvailable.length - 1],
    });
  };

  const handleExport = () => {
    const headers = ['Name', 'Type', 'Account Number', ...electricityMonthsAvailable, 'Total Consumption (kWh)', 'Total Cost (OMR)'];
    const csvRows = [headers.join(',')];
    
    electricityData.forEach(meter => {
      const cost = meter.totalConsumption * BILLING_RATE;
      const row = [
        `"${meter.name.replace(/"/g, '""')}"`,
        `"${meter.type.replace(/"/g, '""')}"`,
        meter.accountNumber,
        ...electricityMonthsAvailable.map(month => meter.consumption[month] || 0),
        meter.totalConsumption,
        cost.toFixed(2)
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'electricity_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const paginatedData = useMemo(() => {
      if (activeSubSection === 'AnalysisByType') {
          return filterDataByType(electricityData, selectedType).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      }
      return electricityData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [currentPage, activeSubSection, selectedType]);
  
  const totalPages = useMemo(() => {
    if (activeSubSection === 'AnalysisByType') {
      return Math.ceil(filterDataByType(electricityData, selectedType).length / itemsPerPage);
    }
    return Math.ceil(electricityData.length / itemsPerPage);
  }, [activeSubSection, selectedType]);

  // Reset page to 1 when subsection or filter changes
  React.useEffect(() => {
      setCurrentPage(1);
  }, [activeSubSection, selectedType]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        Electricity System Analysis
      </h1>
      <ModuleNavigation 
        sections={electricitySubSections}
        activeSection={activeSubSection}
        onSectionChange={setActiveSubSection}
      />
      
      {activeSubSection === 'Overview' && (
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <MonthRangeSlider 
                  months={electricityMonthsAvailable} 
                  value={dateRange} 
                  onChange={setDateRange}
                />
              </div>
              <Button 
                onClick={resetDateRange} 
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white flex items-center justify-center gap-2 h-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <RotateCw size={16} />
                Reset Range
              </Button>
            </div>
          </div>
          
          <h2 className="text-lg font-semibold text-gray-700">
            Consumption Overview for <span className="text-accent font-bold">{overviewCalculations.period}</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Total Consumption"
              value={(overviewCalculations.totalConsumption / 1000).toFixed(1)}
              unit="MWh"
              icon={Power}
              subtitle={`${overviewCalculations.totalConsumption.toLocaleString()} kWh`}
              iconColor="text-yellow-500"
            />
            <MetricCard 
              title="Total Cost"
              value={overviewCalculations.totalCost.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
              unit="OMR"
              icon={Wallet}
              subtitle="Based on total consumption"
              iconColor="text-green-500"
            />
            <MetricCard 
              title="Total Meters"
              value={overviewCalculations.meterCount.toString()}
              unit="meters"
              icon={Zap}
              subtitle="All meter types"
              iconColor="text-blue-500"
            />
            <MetricCard 
              title="Highest Consumer"
              value={overviewCalculations.topConsumer?.name || 'N/A'}
              unit=""
              icon={TrendingUp}
              subtitle={`${(overviewCalculations.topConsumer?.totalConsumption || 0).toLocaleString()} kWh | ${(overviewCalculations.topConsumer?.cost || 0).toLocaleString()} OMR`}
              iconColor="text-red-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Monthly Consumption Trend (kWh)">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrendData}>
                    <defs>
                      <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      fontSize={12} 
                      stroke="#9CA3AF"
                      tick={{ fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                    />
                    <YAxis 
                      fontSize={12} 
                      tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`} 
                      stroke="#9CA3AF"
                      tick={{ fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="Total Consumption" 
                      stroke="#f59e0b" 
                      fill="url(#colorConsumption)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
              
              <ChartCard title="Consumption by Type">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={consumptionByTypeChartData} layout="vertical" margin={{ right: 20 }}>
                    <defs>
                      {COLORS.map((color, index) => (
                        <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={color} stopOpacity={1} />
                          <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                        </linearGradient>
                      ))}
                    </defs>
                    <XAxis 
                      type="number" 
                      tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`} 
                      stroke="#9CA3AF"
                      tick={{ fill: '#6B7280', fontSize: 11 }}
                      axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100} 
                      fontSize={11} 
                      interval={0} 
                      stroke="#9CA3AF"
                      tick={{ fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }} />
                    <Bar dataKey="Consumption (kWh)" barSize={20} radius={[0, 8, 8, 0]}>
                      {consumptionByTypeChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#gradient-${index % COLORS.length})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
          </div>
        </div>
      )}

      {activeSubSection === 'AnalysisByType' && (
        <div className="space-y-6">
            <ChartCard title="Filter by Meter Type">
                <div className="flex flex-wrap gap-3">
                    {uniqueTypes.map(type => (
                        <button 
                            key={type} 
                            onClick={() => setSelectedType(type)}
                            className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                                selectedType === type 
                                ? 'bg-gradient-to-r from-accent to-accent/80 text-white shadow-lg' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                            }`}
                        >
                            <Tag size={14} /> {type}
                        </button>
                    ))}
                </div>
            </ChartCard>

            <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2">
                        <MonthRangeSlider 
                            months={electricityMonthsAvailable} 
                            value={dateRange} 
                            onChange={setDateRange}
                        />
                    </div>
                    <Button 
                        onClick={resetDateRange} 
                        className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white flex items-center justify-center gap-2 h-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <RotateCw size={16} />
                        Reset Range
                    </Button>
                </div>
            </div>

             <h2 className="text-lg font-semibold text-gray-700">
                Analysis for <span className="text-accent font-bold">{selectedType}</span> from <span className="text-accent font-bold">{dateRange.start}</span> to <span className="text-accent font-bold">{dateRange.end}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard 
                  title="Total Consumption"
                  value={(typeAnalysisCalculations.totalConsumption / 1000).toFixed(1)}
                  unit="MWh"
                  icon={Power}
                  subtitle={`${typeAnalysisCalculations.totalConsumption.toLocaleString()} kWh`}
                  iconColor="text-yellow-500"
                />
                <MetricCard 
                  title="Total Cost"
                  value={typeAnalysisCalculations.totalCost.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                  unit="OMR"
                  icon={Wallet}
                  subtitle={`${selectedType} cost`}
                  iconColor="text-green-500"
                />
                <MetricCard 
                  title="Meter Count"
                  value={typeAnalysisCalculations.meterCount.toString()}
                  unit="meters"
                  icon={Zap}
                  subtitle={`Type: ${selectedType}`}
                  iconColor="text-blue-500"
                />
                 <MetricCard 
                  title="Top Consumer"
                  value={typeAnalysisCalculations.topConsumer?.name || 'N/A'}
                  unit=""
                  icon={TrendingUp}
                  subtitle={`${(typeAnalysisCalculations.topConsumer?.totalConsumption || 0).toLocaleString()} kWh`}
                  iconColor="text-red-500"
                />
            </div>

            <ChartCard title={`Monthly Trend for ${selectedType} (kWh)`}>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={typeMonthlyTrendData}>
                       <defs>
                        <linearGradient id="colorType" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="name" 
                        fontSize={12} 
                        stroke="#9CA3AF"
                        tick={{ fill: '#6B7280' }}
                        axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                      />
                      <YAxis 
                        fontSize={12} 
                        tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`} 
                        stroke="#9CA3AF"
                        tick={{ fill: '#6B7280' }}
                        axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="Consumption" 
                        stroke="#818cf8" 
                        fill="url(#colorType)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>
            
            <ChartCard title={`Meter Details for ${selectedType}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/50 backdrop-blur-sm">
                        <tr>
                            <th className="p-4 text-left font-semibold text-gray-700">Name</th>
                            <th className="p-4 text-left font-semibold text-gray-700">Account #</th>
                            <th className="p-4 text-right font-semibold text-gray-700">Total Consumption (kWh)</th>
                            <th className="p-4 text-right font-semibold text-gray-700">Total Cost (OMR)</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {paginatedData.map(meter => (
                            <tr key={meter.id} className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-transparent transition-all duration-200">
                            <td className="p-4 font-medium text-gray-800">{meter.name}</td>
                            <td className="p-4 text-gray-600">{meter.accountNumber}</td>
                            <td className="p-4 text-right font-semibold text-gray-800">{meter.totalConsumption.toLocaleString()}</td>
                             <td className="p-4 text-right font-semibold text-green-600">{(meter.totalConsumption * BILLING_RATE).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                 <div className="p-4 flex items-center justify-between border-t border-gray-100">
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <Button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                            disabled={currentPage === 1}
                            className="rounded-xl"
                        >Previous</Button>
                        <Button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                            disabled={currentPage === totalPages}
                            className="rounded-xl"
                        >Next</Button>
                    </div>
                </div>
            </ChartCard>
        </div>
      )}

      {activeSubSection === 'Database' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Electricity Meter Database
            </h2>
            <Button 
              onClick={handleExport} 
              className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white flex items-center gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FileDown size={16} />
              Export to CSV
            </Button>
          </div>
          
          <ChartCard title={`All Meters (${electricityData.length})`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50 backdrop-blur-sm">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-700">Name</th>
                    <th className="p-4 text-left font-semibold text-gray-700">Type</th>
                    <th className="p-4 text-left font-semibold text-gray-700">Account #</th>
                    <th className="p-4 text-right font-semibold text-gray-700">Total Consumption (kWh)</th>
                    <th className="p-4 text-right font-semibold text-gray-700">Total Cost (OMR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedData.map(meter => (
                    <tr key={meter.id} className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-transparent transition-all duration-200">
                      <td className="p-4 font-medium text-gray-800">{meter.name}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {meter.type}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{meter.accountNumber}</td>
                      <td className="p-4 text-right font-semibold text-gray-800">{meter.totalConsumption.toLocaleString()}</td>
                       <td className="p-4 text-right font-semibold text-green-600">{(meter.totalConsumption * BILLING_RATE).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 flex items-center justify-between border-t border-gray-100">
                <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                    <Button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                        disabled={currentPage === 1}
                        className="rounded-xl"
                    >Previous</Button>
                    <Button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                        disabled={currentPage === totalPages}
                        className="rounded-xl"
                    >Next</Button>
                </div>
            </div>
          </ChartCard>
        </div>
      )}
    </div>
  );
};

export default ElectricityModule;