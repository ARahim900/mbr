import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface ModuleNavigationProps {
  sections: any[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  className?: string;
}

export default function ModuleNavigation({ sections, activeSection, onSectionChange, className = '' }: ModuleNavigationProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-2 mb-6 border border-gray-100 flex items-center justify-center overflow-x-auto ${className}`}>
      <div className="flex flex-wrap gap-2 w-full justify-center">
        {sections.map(tab => (
          <button
            key={tab.id}
            onClick={() => onSectionChange(tab.id)}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 whitespace-nowrap
              ${activeSection === tab.id
                ? 'bg-iceMint text-white shadow-md'
                : 'text-gray-700 hover:bg-iceMint/10 hover:text-iceMint'}
            `}
          >
            {tab.icon && <tab.icon className="w-5 h-5 mr-2" />}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}