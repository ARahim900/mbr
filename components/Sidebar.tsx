import React from 'react';
import {
  Droplets,
  Zap,
  HardHat,
  Recycle,
  ChevronsLeft,
  ChevronsRight,
  Wind,
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
    <aside className={`relative bg-white dark:bg-gray-800 border-r border-neutral-border dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col ${isOpen ? 'w-64' : 'w-20'}`}>
        <div className="relative flex items-center justify-center p-4 border-b border-neutral-border dark:border-gray-700 h-24 flex-shrink-0">
             <img src="/APP Logo.png" alt="MBR App Logo" className={`transition-all duration-300 ${isOpen ? 'h-16' : 'h-12'}`} />
             <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 absolute -right-4 top-8 bg-white dark:bg-gray-800 border-2 border-neutral-border dark:border-gray-700 text-secondary hover:text-primary transition-all duration-300">
                {isOpen ? <ChevronsLeft className="h-5 w-5" /> : <ChevronsRight className="h-5 w-5" />}
            </button>
        </div>
        
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
                        onClick={setActiveSection}
                    />
                ))}
            </ul>
        </nav>
        
    </aside>
  );
};

export default Sidebar;