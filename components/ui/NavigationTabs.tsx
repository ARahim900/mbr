import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavigationTabProps {
  tabs: {
    id: string;
    label: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const NavigationTabs: React.FC<NavigationTabProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = ""
}) => {
  return (
    <div className={`flex bg-white/10 backdrop-blur-md rounded-xl p-1.5 shadow-lg border border-white/20 overflow-x-auto min-w-fit ${className}`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 ease-in-out min-w-fit whitespace-nowrap
              ${isActive 
                ? 'bg-gradient-to-r from-[#4E4456] to-[#5D4D67] text-white shadow-lg shadow-[#4E4456]/20 border border-[#4E4456]/30' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
              }
            `}
          >
            <Icon 
              size={18} 
              className={`
                transition-colors duration-300
                ${isActive ? 'text-[#00D2B3]' : 'text-current'}
              `} 
            />
            <span className={`
              font-medium transition-colors duration-300 text-sm
              ${isActive ? 'text-white' : 'text-current'}
            `}>
              {tab.label}
            </span>
            
            {/* Active indicator dot */}
            {isActive && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#00D2B3] rounded-full"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};

// Enhanced secondary navigation for sub-sections
interface SecondaryNavProps {
  items: {
    id: string;
    label: string;
    icon: LucideIcon;
  }[];
  activeItem: string;
  onItemChange: (itemId: string) => void;
  className?: string;
}

export const SecondaryNavigation: React.FC<SecondaryNavProps> = ({
  items,
  activeItem,
  onItemChange,
  className = ""
}) => {
  return (
    <div className={`flex gap-2 p-1 bg-white/5 backdrop-blur-sm rounded-lg overflow-x-auto ${className}`}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onItemChange(item.id)}
            className={`
              flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition-all duration-300 min-w-fit
              ${isActive 
                ? 'bg-[#4E4456] text-white shadow-md border border-[#4E4456]/30' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/10'
              }
            `}
          >
            <Icon 
              size={20} 
              className={`
                transition-colors duration-300
                ${isActive ? 'text-[#00D2B3]' : 'text-current'}
              `} 
            />
            <span className={`
              text-xs font-medium transition-colors duration-300
              ${isActive ? 'text-white' : 'text-current'}
            `}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default NavigationTabs;