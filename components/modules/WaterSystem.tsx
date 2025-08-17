import React, { useState, useMemo } from 'react';
import { 
  Droplets, 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  Building2, 
  MapPin,
  Database,
  Gauge,
  Activity,
  Zap
} from 'lucide-react';
import ModuleNavigation from '../ui/ModuleNavigation';
import WaterOverview from './water/WaterOverview';
import WaterLossAnalysis from './water/WaterLossAnalysis';
import WaterZoneAnalysis from './water/WaterZoneAnalysis';
import WaterConsumptionByType from './water/WaterConsumptionByType';
import WaterDatabase from './water/WaterDatabase';
import WaterQuality from './water/WaterQuality';
import WaterMeterAnalysis from './water/WaterMeterAnalysis';

// Main navigation tabs for the water system
const waterSystemTabs = [
  { 
    id: 'overview', 
    name: 'Overview', 
    label: 'System Overview', 
    shortName: 'Overview', 
    icon: BarChart3,
    description: 'Complete water system overview and key metrics'
  },
  { 
    id: 'water-loss', 
    name: 'Water Loss Analysis', 
    label: 'Water Loss Analysis', 
    shortName: 'Loss', 
    icon: TrendingUp,
    description: 'Analyze water loss across the distribution system'
  },
  { 
    id: 'zone-analysis', 
    name: 'Zone Analysis', 
    label: 'Zone Analysis', 
    shortName: 'Zones', 
    icon: MapPin,
    description: 'Detailed analysis by water distribution zones'
  },
  { 
    id: 'consumption-type', 
    name: 'Consumption by Type', 
    label: 'Consumption by Type', 
    shortName: 'Type', 
    icon: Building2,
    description: 'Water consumption analysis by building type'
  },
  { 
    id: 'quality', 
    name: 'Water Quality', 
    label: 'Water Quality', 
    shortName: 'Quality', 
    icon: AlertCircle,
    description: 'Water quality monitoring and analysis'
  },
  { 
    id: 'meter-analysis', 
    name: 'Meter Analysis', 
    label: 'Meter Analysis', 
    shortName: 'Meters', 
    icon: Gauge,
    description: 'Individual meter performance and analysis'
  },
  { 
    id: 'database', 
    name: 'Main Database', 
    label: 'Main Database', 
    shortName: 'Data', 
    icon: Database,
    description: 'Complete water system database access'
  }
];

export default function WaterSystem() {
  const [activeTab, setActiveTab] = useState('overview');

  // Render the appropriate component based on active tab
  const renderActiveContent = () => {
    switch (activeTab) {
      case 'overview':
        return <WaterOverview />;
      case 'water-loss':
        return <WaterLossAnalysis />;
      case 'zone-analysis':
        return <WaterZoneAnalysis />;
      case 'consumption-type':
        return <WaterConsumptionByType />;
      case 'quality':
        return <WaterQuality />;
      case 'meter-analysis':
        return <WaterMeterAnalysis />;
      case 'database':
        return <WaterDatabase />;
      default:
        return <WaterOverview />;
    }
  };

  // Get current tab info for better UX
  const currentTabInfo = useMemo(() => 
    waterSystemTabs.find(tab => tab.id === activeTab), 
    [activeTab]
  );

  return (
    <div className="space-y-6" data-aos="fade-up">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/20 rounded-lg">
          <Droplets className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Water System Management</h1>
          <p className="text-gray-400">
            {currentTabInfo?.description || 'Monitor and analyze water consumption and quality'}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ModuleNavigation 
        sections={waterSystemTabs} 
        activeSection={activeTab} 
        onSectionChange={setActiveTab} 
      />
      
      {/* Content Area */}
      <div className="transition-all duration-300">
        {renderActiveContent()}
      </div>
    </div>
  );
}