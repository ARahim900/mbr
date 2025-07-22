import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`group bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 overflow-hidden ${className}`}>
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;