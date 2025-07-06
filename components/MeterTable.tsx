
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
  let lossColorClass = 'text-neutral-medium';
  if (lossPercentage > 10) lossColorClass = 'text-red-500 font-bold';
  else if (lossPercentage > 0) lossColorClass = 'text-yellow-500';
  else if (lossPercentage < -5) lossColorClass = 'text-blue-500';


  return (
    <>
      <tr className="border-b border-neutral-border hover:bg-neutral-light/50">
        <td className="py-3 px-4">
          <div className="flex items-center" style={{ paddingLeft: `${level * 1.5}rem` }}>
            {hasChildren && (
              <button onClick={() => setIsExpanded(!isExpanded)} className="mr-2 text-neutral-medium hover:text-primary">
                <ChevronRightIcon className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            )}
            <span className="font-medium text-primary">{meter.meterLabel}</span>
          </div>
        </td>
        <td className="py-3 px-4 text-neutral-medium">{meter.accountNumber}</td>
        <td className="py-3 px-4 text-neutral-medium">{meter.type}</td>
        <td className="py-3 px-4 text-neutral-medium font-semibold text-right">{meter.totalConsumption.toLocaleString()} m³</td>
        <td className={`py-3 px-4 text-right font-semibold ${lossColorClass}`}>
          {meter.waterLoss.toLocaleString()} m³ 
          {meter.totalConsumption > 0 && ` (${lossPercentage.toFixed(1)}%)`}
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xl font-bold text-primary p-4 border-b border-neutral-border">Water Distribution Network</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-light text-xs text-neutral-medium uppercase">
            <tr>
              <th className="py-3 px-4 font-semibold">Meter Label</th>
              <th className="py-3 px-4 font-semibold">Account #</th>
              <th className="py-3 px-4 font-semibold">Type</th>
              <th className="py-3 px-4 font-semibold text-right">Total Consumption</th>
              <th className="py-3 px-4 font-semibold text-right">Water Loss/Gain</th>
            </tr>
          </thead>
          <tbody>
            {data.map(meter => (
              <MeterRow key={meter.id} meter={meter} level={0} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeterTable;