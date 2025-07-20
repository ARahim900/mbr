import React, { useState } from 'react';
import { Droplets, BarChart3, TrendingUp, AlertCircle, Building2, MapPin } from 'lucide-react';
import ModuleNavigation from './ModuleNavigation';
import WaterOverview from '../../water-system/src/components/WaterOverview';
import ConsumptionAnalysis from '../../water-system/src/components/ConsumptionAnalysis';
import QualityMonitoring from '../../water-system/src/components/QualityMonitoring';
import ZoneAnalysis from '../../water-system/src/components/ZoneAnalysis';
import ConsumptionByType from '../../water-system/src/components/ConsumptionByType';
import MeterByMeter from '../../water-system/src/components/MeterByMeter';

const tabs = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'consumption', label: 'Consumption Analysis', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'byType', label: 'Consumption by Type', icon: <Building2 className="w-4 h-4" /> },
  { id: 'quality', label: 'Quality', icon: <AlertCircle className="w-4 h-4" /> },
  { id: 'zones', label: 'Zone Analysis', icon: <MapPin className="w-4 h-4" /> },
  { id: 'meterByMeter', label: 'Meter by Meter', icon: <Droplets className="w-4 h-4" /> }
];

export default function WaterSystem() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <WaterOverview />;
      case 'consumption':
        return <ConsumptionAnalysis />;
      case 'byType':
        return <ConsumptionByType />;
      case 'quality':
        return <QualityMonitoring />;
      case 'zones':
        return <ZoneAnalysis />;
      case 'meterByMeter':
        return <MeterByMeter />;
      default:
        return <WaterOverview />;
    }
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

      <ModuleNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="transition-all duration-300">
        {renderContent()}
      </div>
    </div>
  );
}