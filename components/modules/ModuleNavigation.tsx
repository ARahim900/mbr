import React from 'react';
import { Link } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
}

interface ModuleNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function ModuleNavigation({ tabs, activeTab, onTabChange, className = '' }: ModuleNavigationProps) {
  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-xl p-1 shadow-lg ${className}`}>
      <div className="flex flex-wrap gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-300
              ${activeTab === tab.id
                ? 'bg-iceMint text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-iceMint/20'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}