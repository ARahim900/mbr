
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center transform hover:scale-105 transition-transform duration-300">
      <div className={`p-3 rounded-full mr-4`} style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-neutral-medium font-semibold uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-primary">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;