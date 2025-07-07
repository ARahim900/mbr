import React from 'react';
import MobileBottomNav from './MobileBottomNav';

interface ModuleNavigationProps {
  sections: any[];
  activeSection: string;
  onSectionChange: (id: string) => void;
}

const ModuleNavigation: React.FC<ModuleNavigationProps> = ({ 
  sections, 
  activeSection, 
  onSectionChange 
}) => {
  return (
    <>
      {/* Desktop navigation */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-3 mb-6 border border-gray-100 dark:border-gray-700">
        <nav className="flex flex-wrap items-center justify-center gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-accent to-accent/80 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              <section.icon className="w-5 h-5 mr-2" />
              <span>{section.name}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Mobile navigation */}
      <MobileBottomNav 
        sections={sections}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />
    </>
  );
};

export default ModuleNavigation;