import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ModuleNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function ModuleNavigation({ tabs, activeTab, onTabChange }: ModuleNavigationProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 mb-6 shadow-lg">
      <div className="flex flex-wrap gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
              ${activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}