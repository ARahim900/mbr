// Mobile-responsive card component specifically for Water System
import React from 'react';
import { Droplets } from 'lucide-react';

interface WaterMeterCardProps {
  meterLabel: string;
  accountNumber: string;
  type: string;
  consumption: number;
  percentage: number;
  status: string;
}

const WaterMeterCard: React.FC<WaterMeterCardProps> = ({
  meterLabel,
  accountNumber,
  type,
  consumption,
  percentage,
  status
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Zone Bulk': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Building Bulk': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Villa': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'A1 - NAMA': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'DC - Direct Connection': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes('L2')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (status.includes('L3')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    if (status.includes('L4')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (status.includes('L5')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (status.includes('A1')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (status.includes('DC')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            {meterLabel}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            #{accountNumber}
          </p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(type)}`}>
          {type}
        </span>
      </div>

      <div className="space-y-3">
        {/* Consumption Bar */}
        <div className="relative">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              Consumption
            </span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white">
              {consumption.toLocaleString()} m³
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: percentage > 10 ? '#3B82F6' : '#10B981'
              }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {percentage.toFixed(1)}% of zone total
          </p>
        </div>

        {/* Status */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600 dark:text-gray-400">Status</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WaterMeterCard;