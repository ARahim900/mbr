
import React, { useState } from 'react';
import { MeterReading } from '../types';

const ChevronRightIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

interface MeterRowProps {
  meter: MeterReading;
  level: number;
}

const MeterRow: React.FC<MeterRowProps> = ({ meter, level }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = meter.children && meter.children.length > 0;

  const lossPercentage = meter.totalConsumption > 0 ? (meter.waterLoss / meter.totalConsumption) * 100 : 0;
  
  const getLossIndicator = () => {
    if (lossPercentage > 10) return { color: '#EF4444', bgColor: '#FEE2E2', label: 'High Loss' };
    if (lossPercentage > 0) return { color: '#F59E0B', bgColor: '#FEF3C7', label: 'Warning' };
    if (lossPercentage < -5) return { color: '#3B82F6', bgColor: '#DBEAFE', label: 'Gain' };
    return { color: '#10B981', bgColor: '#D1FAE5', label: 'Normal' };
  };

  const indicator = getLossIndicator();

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-transparent transition-all duration-200">
        <td className="py-4 px-2 sm:px-4">
          <div className="flex items-center" style={{ paddingLeft: `${level * 1}rem` }}>
            {hasChildren && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="mr-2 p-1 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <ChevronRightIcon className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${level === 0 ? 'bg-accent' : level === 1 ? 'bg-blue-400' : 'bg-gray-400'}`} />
              <span className="font-medium text-gray-800 text-sm sm:text-base">{meter.meterLabel}</span>
            </div>
          </div>
        </td>
        <td className="py-4 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">{meter.accountNumber}</td>
        <td className="py-4 px-2 sm:px-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {meter.type}
          </span>
        </td>
        <td className="py-4 px-2 sm:px-4 text-right">
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 text-sm sm:text-base">{meter.totalConsumption.toLocaleString()}</span>
            <span className="text-xs text-gray-500">m³</span>
          </div>
        </td>
        <td className="py-4 px-2 sm:px-4 text-right">
          <div className="flex flex-col items-end gap-1">
            <span className="font-semibold text-sm sm:text-base" style={{ color: indicator.color }}>
              {meter.waterLoss > 0 ? '+' : ''}{meter.waterLoss.toLocaleString()} m³
            </span>
            {meter.totalConsumption > 0 && (
              <span 
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: indicator.bgColor, color: indicator.color }}
              >
                {Math.abs(lossPercentage).toFixed(1)}%
              </span>
            )}
          </div>
        </td>
      </tr>
      {isExpanded && hasChildren && meter.children.map(child => (
        <MeterRow key={child.id} meter={child} level={level + 1} />
      ))}
    </>
  );
};

interface MeterTableProps {
  data: MeterReading[];
}

const MeterTable: React.FC<MeterTableProps> = ({ data }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Water Distribution Network
        </h3>
        <p className="text-sm text-gray-500 mt-1">Real-time monitoring of water consumption and losses</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="py-4 px-2 sm:px-4 text-left font-semibold text-gray-700 text-xs sm:text-sm">Meter Label</th>
              <th className="py-4 px-2 sm:px-4 text-left font-semibold text-gray-700 text-xs sm:text-sm hidden sm:table-cell">Account #</th>
              <th className="py-4 px-2 sm:px-4 text-left font-semibold text-gray-700 text-xs sm:text-sm">Type</th>
              <th className="py-4 px-2 sm:px-4 text-right font-semibold text-gray-700 text-xs sm:text-sm">Consumption</th>
              <th className="py-4 px-2 sm:px-4 text-right font-semibold text-gray-700 text-xs sm:text-sm">Loss/Gain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map(meter => (
              <MeterRow key={meter.id} meter={meter} level={0} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-gray-50/30 border-t border-gray-100">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Normal (&lt;5% loss)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>Warning (5-10% loss)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>High Loss (&gt;10%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Gain</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeterTable;