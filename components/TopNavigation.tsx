import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  BarChart2,
  Tags,
  Database,
  Menu,
  X,
} from 'lucide-react';

interface TopNavigationProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const navItems = [
    { id: 'Overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'WaterLoss', label: 'Water Loss', icon: TrendingUp },
    { id: 'ZoneAnalysis', label: 'Zone Analysis', icon: BarChart2 },
    { id: 'ByTypeAnalysis', label: 'By Type', icon: Tags },
    { id: 'MainDatabase', label: 'Database', icon: Database },
];

const TopNavigation: React.FC<TopNavigationProps> = ({ activeSection, onSectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onSectionChange(id);
    setIsOpen(false);
  };

  return (
    <nav>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 rounded-md text-primary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Open navigation menu"
        >
          <Menu size={28} />
        </button>
        
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        <div
          className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 z-50 transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-lg text-primary dark:text-white">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-md text-primary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close navigation menu"
            >
              <X size={28} />
            </button>
          </div>
          <ul className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg text-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-accent text-white shadow'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-2">
        {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
                    isActive
                    ? 'bg-accent text-white shadow-md'
                    : 'text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
        })}
      </div>
    </nav>
  );
};

export default TopNavigation;
