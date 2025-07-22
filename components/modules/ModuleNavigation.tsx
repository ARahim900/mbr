import { LucideIcon } from 'lucide-react';

interface NavigationSection {
  id: string;
  name: string;
  label: string;
  icon: LucideIcon;
  shortName?: string;
}

interface ModuleNavigationProps {
  sections: NavigationSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  className?: string;
}

export default function ModuleNavigation({ 
  sections, 
  activeSection, 
  onSectionChange, 
  className = '' 
}: ModuleNavigationProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-2 mb-6 border border-gray-100 flex items-center justify-center overflow-x-auto ${className}`}>
      <div className="flex flex-wrap gap-2 w-full justify-center">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
              activeSection === section.id
                ? 'bg-iceMint text-white shadow-md'
                : 'text-gray-700 hover:bg-iceMint/10 hover:text-iceMint'
            }`}
            aria-pressed={activeSection === section.id}
            aria-label={`Navigate to ${section.label || section.name}`}
          >
            {section.label || section.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export type { NavigationSection, ModuleNavigationProps };