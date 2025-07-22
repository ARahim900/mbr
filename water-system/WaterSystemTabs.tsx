import React from 'react';
import { 
  TrendingUp, 
  Activity, 
  Tag, 
  Database,
  Home
} from 'lucide-react';
import './WaterSystemTabs.css';

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface WaterSystemTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const WaterSystemTabs: React.FC<WaterSystemTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'water-loss', label: 'Water Loss Analysis', icon: TrendingUp },
    { id: 'zone-analysis', label: 'Zone Analysis', icon: Activity },
    { id: 'consumption-type', label: 'Consumption by Type', icon: Tag },
    { id: 'main-database', label: 'Main Database', icon: Database }
  ];

  return (
    <div className="water-system-tabs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`water-system-tab ${activeTab === tab.id ? 'active' : ''}`}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <Icon size={18} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default WaterSystemTabs;