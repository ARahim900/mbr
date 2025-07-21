import React from 'react';
import { LucideProps } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.FC<LucideProps>;
  subtitle: string;
  iconColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  subtitle, 
  iconColor,
  trend 
}) => {
  const getIconBackground = () => {
    const colorMap: { [key: string]: string } = {
      'text-yellow-500': 'from-yellow-400 to-yellow-600',
      'text-green-500': 'from-green-400 to-green-600',
      'text-blue-500': 'from-blue-400 to-blue-600',
      'text-red-500': 'from-red-400 to-red-600',
      'text-purple-500': 'from-purple-400 to-purple-600',
      'text-iceMint': 'from-iceMint-light to-iceMint-dark',
      'text-yellow-600': 'from-yellow-500 to-yellow-700',
      'text-green-600': 'from-green-500 to-green-700',
      'text-blue-600': 'from-blue-500 to-blue-700',
      'text-red-600': 'from-red-500 to-red-700',
      'text-purple-600': 'from-purple-500 to-purple-700',
      'text-orange-600': 'from-orange-500 to-orange-700',
    };
    return colorMap[iconColor] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className="group bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 overflow-hidden relative">
      {/* Mobile tap effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Gradient background effect */}
      <div 
        className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${getIconBackground()}`}
      />
      
      <div className="relative flex items-start space-x-4">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${getIconBackground()} shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            <p className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              {value}
            </p>
            <span className="text-base lg:text-lg font-medium text-gray-500 dark:text-gray-400">
              {unit}
            </span>
            {trend && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="text-lg">{trend.isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;