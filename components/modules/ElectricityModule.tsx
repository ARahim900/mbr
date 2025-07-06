import React, { useState, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Zap, Database, LayoutDashboard, Calendar, TrendingUp, Power, FileDown, RotateCw, Wallet, Tag } from 'lucide-react';

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

const COLORS = ['#f59e0b', '#facc15', '#a3e635', '#4ade80', '#2dd4bf', '#22d3ee', '#38bdf8', '#60a5fa', '##818cf8', '#a78bfa'];

const electricitySubSections = [
    { name: 'Overview', id: 'Overview', icon: LayoutDashboard, shortName: 'Over' },
    { name: 'Analysis by Type', id: 'AnalysisByType', icon: Tag, shortName: 'Type' },
    { name: 'Database', id: 'Database', icon: Database, shortName: 'Data' },
];

const ModuleNavigation = ({ sections, activeSection, onSectionChange }: { sections: any[], activeSection: string, onSectionChange: (id: string) => void }) => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-2 mb-6 border border-neutral-border dark:border-gray-700">
    <nav className="flex flex-wrap items-center justify-center gap-2">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent ${
            activeSection === section.id
              ? 'bg-accent text-white shadow-md'
              : 'text-secondary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
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
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-neutral-border dark:border-gray-700">
        <p className="label font-bold text-primary dark:text-white">{`${label}`}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.stroke || pld.fill }}>{`${pld.name}: ${pld.value.toLocaleString(undefined, { minimumFractionDigits: isCost ? 2 : 0, maximumFractionDigits: isCost ? 2 : 0 })} ${unit}`}</p>
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
      <h1 className="text-3xl font-bold text-primary dark:text-white">Electricity System Analysis</h1>
      <ModuleNavigation 
        sections={electricitySubSections}
        activeSection={activeSubSection}
        onSectionChange={setActiveSubSection}
      />
      
      {activeSubSection === 'Overview' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-neutral-border dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <MonthRangeSlider 
                  months={electricityMonthsAvailable} 
                  value={dateRange} 
                  onChange={setDateRange}
                />
              </div>
              <Button onClick={resetDateRange} className="bg-secondary hover:bg-primary-light text-white flex items-center justify-center gap-2 h-10">
                <RotateCw size={16} />
                Reset Range
              </Button>
            </div>
          </div>
          
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Consumption Overview for <span className="text-accent">{overviewCalculations.period}</span>
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
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="Total Consumption" stroke="#f59e0b" fill="url(#colorConsumption)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Consumption by Type">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={consumptionByTypeChartData} layout="vertical" margin={{ right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`} />
                    <YAxis type="category" dataKey="name" width={100} fontSize={10} interval={0} />
                    <Tooltip formatter={(value, name) => `${(value as number).toLocaleString()} ${String(name).includes('kWh') ? 'kWh' : 'OMR'}`}/>
                    <Legend/>
                    <Bar dataKey="Consumption (kWh)" barSize={20} radius={[0, 4, 4, 0]}>
                      {consumptionByTypeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                <div className="flex flex-wrap gap-2">
                    {uniqueTypes.map(type => (
                        <button key={type} onClick={() => setSelectedType(type)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 flex items-center gap-2 ${
                                selectedType === type 
                                ? 'bg-accent text-white shadow-md' 
                                : 'bg-gray-100 dark:bg-gray-700 text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            <Tag size={14} /> {type}
                        </button>
                    ))}
                </div>
            </ChartCard>

             <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Analysis for <span className="text-accent">{selectedType}</span> from <span className="text-accent">{dateRange.start}</span> to <span className="text-accent">{dateRange.end}</span>
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
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="Consumption" stroke="#818cf8" fill="url(#colorType)" />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>
            
            <ChartCard title={`Meter Details for ${selectedType}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-200">Name</th>
                            <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-200">Account #</th>
                            <th className="p-3 text-right font-semibold text-gray-700 dark:text-gray-200">Total Consumption (kWh)</th>
                            <th className="p-3 text-right font-semibold text-gray-700 dark:text-gray-200">Total Cost (OMR)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map(meter => (
                            <tr key={meter.id} className="border-b border-neutral-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{meter.name}</td>
                            <td className="p-3 text-gray-600 dark:text-gray-400">{meter.accountNumber}</td>
                            <td className="p-3 text-right font-semibold text-gray-800 dark:text-gray-200">{meter.totalConsumption.toLocaleString()}</td>
                             <td className="p-3 text-right font-semibold text-green-700 dark:text-green-400">{(meter.totalConsumption * BILLING_RATE).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                 <div className="p-4 flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                        <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
                    </div>
                </div>
            </ChartCard>
        </div>
      )}

      {activeSubSection === 'Database' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary dark:text-white">Electricity Meter Database</h2>
            <Button onClick={handleExport} className="bg-primary hover:bg-primary-dark text-white flex items-center gap-2">
              <FileDown size={16} />
              Export to CSV
            </Button>
          </div>
          <ChartCard title={`All Meters (${electricityData.length})`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-200">Name</th>
                    <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-200">Type</th>
                    <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-200">Account #</th>
                    <th className="p-3 text-right font-semibold text-gray-700 dark:text-gray-200">Total Consumption (kWh)</th>
                    <th className="p-3 text-right font-semibold text-gray-700 dark:text-gray-200">Total Cost (OMR)</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map(meter => (
                    <tr key={meter.id} className="border-b border-neutral-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{meter.name}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{meter.type}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{meter.accountNumber}</td>
                      <td className="p-3 text-right font-semibold text-gray-800 dark:text-gray-200">{meter.totalConsumption.toLocaleString()}</td>
                       <td className="p-3 text-right font-semibold text-green-700 dark:text-green-400">{(meter.totalConsumption * BILLING_RATE).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                    <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                    <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
                </div>
            </div>
          </ChartCard>
        </div>
      )}
    </div>
  );
};

export default ElectricityModule;