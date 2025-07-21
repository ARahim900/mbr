import React, { useMemo, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Recycle, Droplets, Truck, Banknote, Sprout, TrendingUp, DollarSign, RotateCw } from 'lucide-react';

import { getStpData, calculateMonthlyStpData } from '../../database/stpDatabase';
import MetricCard from '../ui/MetricCard';
import ChartCard from '../ui/ChartCard';
import Button from '../ui/Button';
import MonthRangeSlider from '../ui/MonthRangeSlider';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-neutral-border dark:border-gray-700">
        <p className="label font-bold text-primary dark:text-white">{`${label}`}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.stroke || pld.fill }}>
            {`${pld.name}: ${pld.value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})} ${pld.unit || ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};


const StpPlantModule: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    const stpData = useMemo(() => getStpData(), []);
    const monthlyAggregates = useMemo(() => calculateMonthlyStpData(stpData), [stpData]);
    
    // Initialize date range for the slider
    const availableMonths = monthlyAggregates.map(m => m.monthKey);
    const [dateRange, setDateRange] = useState({
        start: availableMonths[0] || '',
        end: availableMonths[availableMonths.length - 1] || ''
    });

    // Calculate aggregated data for the selected range
    const aggregatedData = useMemo(() => {
        if (!dateRange.start || !dateRange.end) return null;
        
        const startIndex = availableMonths.indexOf(dateRange.start);
        const endIndex = availableMonths.indexOf(dateRange.end);
        
        if (startIndex === -1 || endIndex === -1) return null;
        
        const rangeData = monthlyAggregates.slice(startIndex, endIndex + 1);
        
        return rangeData.reduce((acc, month) => ({
            totalInletSewage: acc.totalInletSewage + month.totalInletSewage,
            tseOutput: acc.tseOutput + month.tseOutput,
            tankerCount: acc.tankerCount + month.tankerCount,
            income: acc.income + month.income,
            savings: acc.savings + month.savings,
            totalSavingsAndIncome: acc.totalSavingsAndIncome + month.totalSavingsAndIncome,
            period: `${rangeData[0].month} - ${rangeData[rangeData.length - 1].month}`
        }), {
            totalInletSewage: 0,
            tseOutput: 0,
            tankerCount: 0,
            income: 0,
            savings: 0,
            totalSavingsAndIncome: 0,
            period: ''
        });
    }, [dateRange, monthlyAggregates, availableMonths]);

    const [selectedMonthKey, setSelectedMonthKey] = useState(monthlyAggregates.length > 0 ? monthlyAggregates[monthlyAggregates.length - 1].monthKey : '');

    const selectedMonthData = useMemo(() => {
        return monthlyAggregates.find(m => m.monthKey === selectedMonthKey) || monthlyAggregates[monthlyAggregates.length - 1];
    }, [selectedMonthKey, monthlyAggregates]);

    const dailyLogData = useMemo(() => {
      if (!selectedMonthKey) return [];
      const [year, month] = selectedMonthKey.split('-').map(Number);
      return stpData.filter(d => d.date.getFullYear() === year && d.date.getMonth() === month - 1);
    }, [selectedMonthKey, stpData]);

    const paginatedDailyLog = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return dailyLogData.slice(startIndex, startIndex + itemsPerPage);
    }, [dailyLogData, currentPage]);
    
    const totalPages = Math.ceil(dailyLogData.length / itemsPerPage);

    const resetDateRange = () => {
        setDateRange({
            start: availableMonths[0],
            end: availableMonths[availableMonths.length - 1],
        });
    };

    if (!selectedMonthData || !aggregatedData) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-background-primary dark:bg-gray-900">
                <Recycle className="w-24 h-24 text-accent mb-6 animate-spin" />
                <h1 className="text-4xl font-bold text-primary dark:text-white mb-2">STP Plant</h1>
                <p className="text-lg text-secondary dark:text-gray-400">
                    Loading data or no data available.
                </p>
            </div>
        );
    }
    
  return (
    <div className="space-y-6 p-4 sm:p-6">
        <h2 className="text-3xl font-bold text-primary dark:text-white">STP Plant Operations</h2>
        
        {/* Period Selector with Slider */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6 border border-neutral-border dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                        Select Period Range
                    </h3>
                    <MonthRangeSlider 
                        months={availableMonths} 
                        value={dateRange} 
                        onChange={setDateRange}
                    />
                </div>
                <div className="md:col-span-1 flex flex-col gap-4">
                    <Button 
                        onClick={resetDateRange} 
                        className="bg-secondary hover:bg-primary-light text-white flex items-center justify-center gap-2 h-10"
                    >
                        <RotateCw size={16} />
                        Reset Range
                    </Button>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Selected Period:</p>
                        <p className="text-lg font-semibold text-primary dark:text-white">{aggregatedData.period}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* KPI Cards - Split into two rows: 3 + 3 */}
        <div className="space-y-6">
            {/* First row of KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard 
                    title="Inlet Sewage"
                    value={aggregatedData.totalInletSewage.toLocaleString()}
                    unit="m³"
                    icon={Droplets}
                    subtitle={`For ${aggregatedData.period}`}
                    iconColor="text-blue-500"
                />
                <MetricCard 
                    title="TSE for Irrigation"
                    value={aggregatedData.tseOutput.toLocaleString()}
                    unit="m³"
                    icon={Sprout}
                    subtitle="Recycled water"
                    iconColor="text-green-500"
                />
                <MetricCard 
                    title="Tanker Trips"
                    value={aggregatedData.tankerCount.toLocaleString()}
                    unit="trips"
                    icon={Truck}
                    subtitle="Total discharges"
                    iconColor="text-orange-500"
                />
            </div>
            
            {/* Second row of KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard 
                    title="Generated Income"
                    value={aggregatedData.income.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    unit="OMR"
                    icon={Banknote}
                    subtitle="From tanker fees"
                    iconColor="text-emerald-500"
                />
                <MetricCard 
                    title="Water Savings"
                    value={aggregatedData.savings.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    unit="OMR"
                    icon={TrendingUp}
                    subtitle="By using TSE water"
                    iconColor="text-iceMint"
                />
                <MetricCard 
                    title="Total Impact"
                    value={aggregatedData.totalSavingsAndIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    unit="OMR"
                    icon={DollarSign}
                    subtitle="Savings + Income"
                    iconColor="text-iceMint"
                />
            </div>
        </div>

        {/* Charts */}
         <div className="grid grid-cols-1 gap-6">
            <ChartCard title="Monthly Water Volumes (m³)">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyAggregates} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorInlet" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorTse" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} fontSize={12} tickLine={false} axisLine={false}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area type="monotone" dataKey="totalInletSewage" name="Sewage Input" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInlet)" strokeWidth={2} unit=" m³" />
                        <Area type="monotone" dataKey="tseOutput" name="TSE Output" stroke="#10b981" fillOpacity={1} fill="url(#colorTse)" strokeWidth={2} unit=" m³" />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Monthly Financials (OMR)">
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyAggregates} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis label={{ value: 'OMR', angle: -90, position: 'insideLeft' }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} fontSize={12} tickLine={false} axisLine={false}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="savings" name="Savings" stackId="a" fill="#14b8a6" radius={[4, 4, 0, 0]} unit=" OMR" />
                        <Bar dataKey="income" name="Income" stackId="a" fill="#65a30d" radius={[4, 4, 0, 0]} unit=" OMR" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
            
            <ChartCard title="Monthly Operations (Tanker Trips)">
                <ResponsiveContainer width="100%" height={300}>
                     <LineChart data={monthlyAggregates} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis label={{ value: 'Trips', angle: -90, position: 'insideLeft' }} fontSize={12} tickLine={false} axisLine={false}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="tankerCount" name="Tanker Trips" stroke="#f97316" strokeWidth={2} dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 8 }} unit=" trips" />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
         </div>

         {/* Daily Log Table with Month Selector */}
         <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Daily Operations Log
                </h3>
                <div className="w-full sm:w-auto">
                    <label htmlFor="month-select" className="sr-only">Select Month for Daily Log</label>
                    <select 
                        id="month-select"
                        value={selectedMonthKey}
                        onChange={(e) => {
                            setSelectedMonthKey(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full p-2 border border-neutral-border dark:border-gray-600 rounded-lg text-primary dark:text-gray-200 bg-white dark:bg-gray-800"
                    >
                        {monthlyAggregates.map(m => <option key={m.monthKey} value={m.monthKey}>{m.month}</option>)}
                    </select>
                </div>
            </div>

            <ChartCard title={`Daily Operations for ${selectedMonthData.month}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-xs text-secondary uppercase">
                            <tr>
                                <th className="p-3 font-semibold">Date</th>
                                <th className="p-3 font-semibold text-right">Inlet (m³)</th>
                                <th className="p-3 font-semibold text-right">TSE (m³)</th>
                                <th className="p-3 font-semibold text-right">Tankers</th>
                                <th className="p-3 font-semibold text-right">Income (OMR)</th>
                                <th className="p-3 font-semibold text-right">Savings (OMR)</th>
                                <th className="p-3 font-semibold text-right">Total (OMR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDailyLog.map(log => (
                                <tr key={log.id} className="border-b border-neutral-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 text-primary dark:text-gray-200">{log.date.toLocaleDateString('en-GB')}</td>
                                    <td className="p-3 text-right text-secondary dark:text-gray-300">{log.totalInletSewage.toLocaleString()}</td>
                                    <td className="p-3 text-right text-secondary dark:text-gray-300">{log.tseOutput.toLocaleString()}</td>
                                    <td className="p-3 text-right text-secondary dark:text-gray-300">{log.tankerCount}</td>
                                    <td className="p-3 text-right text-green-700 dark:text-green-400">{log.income.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                    <td className="p-3 text-right text-teal-700 dark:text-teal-400">{log.savings.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                    <td className="p-3 text-right font-semibold text-purple-700 dark:text-purple-400">{log.totalSavingsAndIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                     <div className="p-4 flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="bg-white dark:bg-gray-700 border border-neutral-border dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">Previous</Button>
                            <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="bg-white dark:bg-gray-700 border border-neutral-border dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">Next</Button>
                        </div>
                    </div>
                )}
            </ChartCard>
         </div>
    </div>
  );
};

export default StpPlantModule;