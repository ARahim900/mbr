import React from 'react';

interface MobileBottomNavProps {
  sections: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    shortName: string;
  }>;
  activeSection: string;
  onSectionChange: (id: string) => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  sections, 
  activeSection, 
  onSectionChange 
}) => {
  return (
    <div className="mobile-bottom-nav">
      <nav 
        className="flex items-center justify-around h-full px-2"
        role="tablist"
        aria-label="Module navigation"
      >
        {sections.map((section) => {
          const IconComponent = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`mobile-touch-target flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-iceMint focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 ${
                isActive
                  ? 'text-iceMint bg-iceMint/10 scale-105'
                  : 'text-gray-500 dark:text-gray-400 hover:text-iceMint dark:hover:text-iceMint hover:bg-iceMint/5 dark:hover:bg-iceMint/10'
              }`}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${section.label} ${isActive ? '(current)' : ''}`}
              tabIndex={isActive ? 0 : -1}
            >
              <IconComponent 
                className={`w-6 h-6 mb-1 transition-all duration-300 ${
                  isActive ? 'text-iceMint' : 'text-gray-500 dark:text-gray-400'
                }`}
                aria-hidden="true"
              />
              <span className={`text-xs font-medium transition-all duration-300 ${
                isActive ? 'text-iceMint font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {section.shortName}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div 
                  className="absolute -top-1 w-1 h-1 bg-iceMint rounded-full"
                  aria-hidden="true"
                ></div>
              )}
              
              {/* Screen reader only current page indicator */}
              {isActive && (
                <span className="sr-only">(current page)</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileBottomNav;