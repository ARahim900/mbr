import React from 'react';
import {
  Droplets,
  Zap,
  HardHat,
  Recycle,
  ChevronsLeft,
  ChevronsRight,
  Wind,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

interface NavItemProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isOpen: boolean;
  onClick: (id: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ id, icon, label, active, isOpen, onClick }) => (
    <li>
      <button 
        onClick={() => onClick(id)} 
        className={`w-full flex items-center p-3 my-1 rounded-lg transition-all duration-300 transform hover:scale-105 ${
          active 
          ? 'bg-accent text-white shadow-lg' 
          : 'text-secondary hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary'
      }`}
      title={label}
      >
        {icon}
        {isOpen && <span className="ml-4 font-semibold whitespace-nowrap">{label}</span>}
      </button>
    </li>
);

const navItems = [
    { id: 'Water System', label: 'Water System', icon: <Droplets className="h-6 w-6" /> },
    { id: 'Electricity System', label: 'Electricity System', icon: <Zap className="h-6 w-6" /> },
    { id: 'HVAC System', label: 'HVAC System', icon: <Wind className="h-6 w-6" /> },
    { id: 'Contractor Tracker', label: 'Contractor Tracker', icon: <HardHat className="h-6 w-6" /> },
    { id: 'STP Plant', label: 'STP Plant', icon: <Recycle className="h-6 w-6" /> },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, activeSection, setActiveSection }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg lg:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative
        bg-white dark:bg-gray-800 
        border-r border-neutral-border dark:border-gray-700 
        transition-all duration-300 ease-in-out 
        flex flex-col
        z-50 lg:z-auto
        h-full
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'}
      `}>
        {/* Logo section */}
        <div className="relative flex items-center justify-center p-4 border-b border-neutral-border dark:border-gray-700 h-24 flex-shrink-0">
          {/* Logo - hidden when sidebar is collapsed */}
          {isOpen ? (
            <img 
              src="/APP Logo.png" 
              alt="MBR App Logo" 
              className="h-16 w-auto object-contain"
            />
          ) : (
            /* Show a dot or abbreviated version when collapsed on desktop */
            <div className="hidden lg:flex items-center justify-center">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
            </div>
          )}
          
          {/* Desktop toggle button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="hidden lg:flex p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 absolute -right-4 top-8 bg-white dark:bg-gray-800 border-2 border-neutral-border dark:border-gray-700 text-secondary hover:text-primary transition-all duration-300"
          >
            {isOpen ? <ChevronsLeft className="h-5 w-5" /> : <ChevronsRight className="h-5 w-5" />}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-grow p-4 overflow-y-auto">
          <ul>
            {navItems.map(item => (
              <NavItem 
                key={item.id}
                id={item.id}
                icon={item.icon}
                label={item.label}
                isOpen={isOpen}
                active={activeSection === item.id}
                onClick={(id) => {
                  setActiveSection(id);
                  // Auto-close sidebar on mobile after selection
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;