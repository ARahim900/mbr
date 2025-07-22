
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Background gradient effect */}
      <div 
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at top right, ${color}, transparent 70%)`
        }}
      />
      
      <div className="relative flex items-center">
        <div 
          className="p-3 sm:p-4 rounded-2xl mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110"
          style={{ 
            background: `linear-gradient(135deg, ${color}dd, ${color}aa)`,
          }}
        >
          <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
        
        <div className="flex-1">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              {value}
            </p>
            {trend && (
              <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="text-base sm:text-lg">{trend.isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;