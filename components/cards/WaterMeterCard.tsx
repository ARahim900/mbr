import React from 'react';
import MobileDataCard from '../ui/MobileDataCard';

interface WaterMeterCardProps {
  meterData: {
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
  selectedMonth: string;
  onClick?: () => void;
}

const WaterMeterCard: React.FC<WaterMeterCardProps> = ({ 
  meterData, 
  selectedMonth,
  onClick 
}) => {
  const currentConsumption = meterData.consumption[selectedMonth] || 0;
  
  // Determine status based on consumption
  const getStatus = () => {
    if (meterData.isBuilding) {
      return { label: 'L3 - Building', color: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' };
    }
    if (meterData.isApartment) {
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

  const fields = [
    {
      label: 'Account',
      value: meterData.account
    },
    {
      label: 'Type',
      value: meterData.type
    },
    {
      label: `${selectedMonth}`,
      value: `${currentConsumption.toLocaleString()} m³`,
      highlight: true,
      color: currentConsumption > 1000 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Total',
      value: `${(meterData.totalConsumption || 0).toLocaleString()} m³`,
      highlight: true
    }
  ];

  if (meterData.percentage !== undefined) {
    fields.push({
      label: 'Zone Share',
      value: `${meterData.percentage.toFixed(1)}%`,
      highlight: false,
      color: 'text-gray-600 dark:text-gray-400'
    });
  }

  return (
    <MobileDataCard
      title={meterData.label}
      subtitle={meterData.isApartment ? 'Sub-meter' : undefined}
      fields={fields}
      status={getStatus()}
      onClick={onClick}
      className={meterData.isApartment ? 'ml-4' : ''}
    />
  );
};

export default WaterMeterCard;
