import React from 'react';
import { Droplets } from 'lucide-react';
import TopNavigation from './TopNavigation';

interface TopHeaderProps {
    activeSection: string;
    onSectionChange: (sectionId: string) => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ activeSection, onSectionChange }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md transition-colors duration-300 h-24 lg:h-20">
      <div className="container mx-auto flex justify-between items-center h-full px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Droplets className="h-8 w-8 text-accent" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white whitespace-nowrap">
            Muscat Bay
          </h1>
        </div>
        <TopNavigation activeSection={activeSection} onSectionChange={onSectionChange} />
      </div>
    </header>
  );
};

export default TopHeader;
