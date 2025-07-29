import React from 'react';
import { Droplets } from 'lucide-react';
import { getStatusColor } from '../../utils/colorUtils';
import MobileDataCard from '../ui/MobileDataCard';

interface WaterMeterCardProps {
  // Support both data formats for backward compatibility
  meterData?: {
    label: string;
    account: string;
    type: string;
    consumption: Record<string, number>;
    totalConsumption?: number;
    currentMonthConsumption?: number;
    percentage?: number;
    isBuilding?: boolean;
    isApartment?: boolean;
  };
  // Alternative format
  meterLabel?: string;
  accountNumber?: string;
  type?: string;
  consumption?: number;
  percentage?: number;
  status?: string;
  selectedMonth?: string;
  onClick?: () => void;
  variant?: 'detailed' | 'compact';
}

const WaterMeterCard: React.FC<WaterMeterCardProps> = ({ 
  meterData,
  meterLabel,
  accountNumber,
  type,
  consumption,
  percentage,
  status,
  selectedMonth,
  onClick,
  variant = 'detailed'
}) => {
  // Determine which props to use
  const label = meterData?.label || meterLabel || 'Unknown Meter';
  const account = meterData?.account || accountNumber || 'N/A';
  const meterType = meterData?.type || type || 'Unknown';
  const currentConsumption = meterData?.consumption?.[selectedMonth!] || consumption || 0;
  const zonePercentage = meterData?.percentage || percentage || 0;
  
  // Determine status based on consumption or provided status
  const getStatus = () => {
    if (status) {
      return { label: status, color: getStatusColor(status) };
    }
    
    if (meterData?.isBuilding) {
      return { label: 'L3 - Building', color: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' };
    }
    if (meterData?.isApartment) {
      return { label: 'L4 - Apartment', color: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' };
    }
    if (currentConsumption === 0) {
      return { label: 'No Usage', color: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300' };
    }
    if (currentConsumption > 1000) {
      return { label: 'High', color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' };
    }
    if (currentConsumption > 500) {
      return { label: 'Medium', color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' };
    }
    return { label: 'Normal', color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' };
  };

  const getTypeColorClass = (type: string) => {
    switch (type) {
      case 'Zone Bulk': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Building Bulk': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Villa': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'A1 - NAMA': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'DC - Direct Connection': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Compact variant for mobile/simple display
  if (variant === 'compact' || !meterData) {
    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
              {label}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              #{account}
            </p>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColorClass(meterType)}`}>
            {meterType}
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
                {currentConsumption.toLocaleString()} m³
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${Math.min(zonePercentage, 100)}%`,
                  backgroundColor: zonePercentage > 10 ? '#3B82F6' : '#10B981'
                }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {zonePercentage.toFixed(1)}% of zone total
            </p>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Status</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatus().color}`}>
              {getStatus().label}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant using MobileDataCard
  const fields = [
    {
      label: 'Account',
      value: account
    },
    {
      label: 'Type',
      value: meterType
    },
    {
      label: selectedMonth || 'Current',
      value: `${currentConsumption.toLocaleString()} m³`,
      highlight: true,
      color: currentConsumption > 1000 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Total',
      value: `${(meterData?.totalConsumption || 0).toLocaleString()} m³`,
      highlight: true
    }
  ];

  if (zonePercentage > 0) {
    fields.push({
      label: 'Zone Share',
      value: `${zonePercentage.toFixed(1)}%`,
      highlight: false,
      color: 'text-gray-600 dark:text-gray-400'
    });
  }

  return (
    <MobileDataCard
      title={label}
      subtitle={meterData?.isApartment ? 'Sub-meter' : undefined}
      fields={fields}
      status={getStatus()}
      onClick={onClick}
      className={meterData?.isApartment ? 'ml-4' : ''}
    />
  );
};

export default WaterMeterCard;
