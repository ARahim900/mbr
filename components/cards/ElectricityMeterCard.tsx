import React from 'react';
import MobileDataCard from '../ui/MobileDataCard';

interface ElectricityMeterCardProps {
  meter: {
    name: string;
    type: string;
    accountNumber: string;
    totalConsumption: number;
  };
  billingRate: number;
  onClick?: () => void;
}

const ElectricityMeterCard: React.FC<ElectricityMeterCardProps> = ({ 
  meter, 
  billingRate,
  onClick 
}) => {
  const totalCost = meter.totalConsumption * billingRate;
  
  // Determine status based on consumption
  const getStatus = () => {
    if (meter.totalConsumption > 10000) {
      return { label: 'High Usage', color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' };
    }
    if (meter.totalConsumption > 5000) {
      return { label: 'Medium Usage', color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' };
    }
    if (meter.totalConsumption === 0) {
      return { label: 'No Usage', color: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300' };
    }
    return { label: 'Normal', color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' };
  };

  const fields = [
    {
      label: 'Account',
      value: meter.accountNumber
    },
    {
      label: 'Type',
      value: meter.type
    },
    {
      label: 'Total Consumption',
      value: `${meter.totalConsumption.toLocaleString()} kWh`,
      highlight: true,
      color: meter.totalConsumption > 10000 ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
    },
    {
      label: 'Total Cost',
      value: `${totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} OMR`,
      highlight: true,
      color: 'text-green-600 dark:text-green-400'
    }
  ];

  return (
    <MobileDataCard
      title={meter.name}
      fields={fields}
      status={getStatus()}
      onClick={onClick}
    />
  );
};

export default ElectricityMeterCard;
