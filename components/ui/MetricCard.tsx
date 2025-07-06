import React from 'react';
import { LucideProps } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.FC<LucideProps>;
  subtitle: string;
  iconColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, icon: Icon, subtitle, iconColor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex items-center space-x-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className={`p-3 rounded-full bg-opacity-10 ${iconColor.replace('text-', 'bg-')}`}>
         <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-secondary dark:text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-primary dark:text-white">
          {value} <span className="text-lg font-medium text-secondary dark:text-gray-300">{unit}</span>
        </p>
        <p className="text-xs text-secondary dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
};

export default MetricCard;
