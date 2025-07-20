import React from 'react';


interface MobileBottomNavProps {
  sections: any[];
  activeSection: string;
  onSectionChange: (id: string) => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  sections, 
  activeSection, 
  onSectionChange 
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-2 z-50 lg:hidden shadow-2xl">
      <nav className="flex items-center justify-around">
        {sections.slice(0, 4).map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 ${
              activeSection === section.id
                ? 'text-accent bg-accent/10'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <section.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{section.shortName}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MobileBottomNav;