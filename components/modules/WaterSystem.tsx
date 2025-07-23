import { useState } from 'react';
import { Droplets, BarChart3, TrendingUp, AlertCircle, Building2, MapPin } from 'lucide-react';
import ModuleNavigation from './ModuleNavigation';

const tabs = [
  { id: 'overview', name: 'Overview', label: 'Overview', icon: BarChart3 },
  { id: 'consumption', name: 'Consumption Analysis', label: 'Consumption Analysis', icon: TrendingUp },
  { id: 'byType', name: 'Consumption by Type', label: 'Consumption by Type', icon: Building2 },
  { id: 'quality', name: 'Quality', label: 'Quality', icon: AlertCircle },
  { id: 'zones', name: 'Zone Analysis', label: 'Zone Analysis', icon: MapPin },
  { id: 'meterByMeter', name: 'Meter by Meter', label: 'Meter by Meter', icon: Droplets }
];

export default function WaterSystem() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="text-center py-12">
          <Droplets className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Water System Module
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This section is under development. Please use the Water Analysis Module for detailed water system analysis.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Water Analysis
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" data-aos="fade-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/20 rounded-lg">
          <Droplets className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Water System Management</h1>
          <p className="text-gray-400">Monitor and analyze water consumption and quality</p>
        </div>
      </div>

      <ModuleNavigation sections={tabs} activeSection={activeTab} onSectionChange={setActiveTab} />
      
      <div className="transition-all duration-300">
        {renderContent()}
      </div>
    </div>
  );
}