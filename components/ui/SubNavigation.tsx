import React from 'react';
import { LucideProps } from 'lucide-react';

interface SubSection {
  name: string;
  id: string;
  icon: React.FC<LucideProps>;
  shortName: string;
}

interface SubNavigationProps {
  sections: SubSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const SubNavigation: React.FC<SubNavigationProps> = ({ sections, activeSection, onSectionChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-2 mb-6 border border-gray-200 dark:border-gray-700">
      <nav className="flex flex-wrap items-center justify-center gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent ${
              activeSection === section.id
                ? 'bg-primary text-white shadow-md'
                : 'text-secondary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <section.icon className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">{section.name}</span>
            <span className="sm:hidden">{section.shortName}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SubNavigation;
