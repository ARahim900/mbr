import React from 'react';
import { ChevronRight } from 'lucide-react';

interface MobileDataCardProps {
  title: string;
  subtitle?: string;
  fields: Array<{
    label: string;
    value: string | number;
    highlight?: boolean;
    color?: string;
  }>;
  status?: {
    label: string;
    color: string;
  };
  onClick?: () => void;
  className?: string;
}

const MobileDataCard: React.FC<MobileDataCardProps> = ({
  title,
  subtitle,
  fields,
  status,
  onClick,
  className = ''
}) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Card Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white truncate">{title}</h3>
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{subtitle}</p>
            )}
          </div>
          {status && (
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${status.color}`}>
              {status.label}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="px-4 py-3 space-y-2">
        {fields.map((field, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">{field.label}:</span>
            <span 
              className={`text-sm sm:text-base font-semibold ${
                field.highlight 
                  ? field.color || 'text-gray-900 dark:text-white' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {typeof field.value === 'number' ? field.value.toLocaleString() : field.value}
            </span>
          </div>
        ))}
      </div>

      {/* Click Indicator */}
      {onClick && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
            <span>Tap for details</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDataCard;
