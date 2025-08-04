import React from 'react';
import {
  Droplets,
  Zap,
  HardHat,
  Recycle,
  ChevronsLeft,
  ChevronsRight,
  Wind,
  Shield,
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
  <li className="mb-2">
    <button
      onClick={() => onClick(id)}
      className={`
        w-full flex items-center p-3 rounded-lg transition-all duration-200 text-left
        ${active 
          ? 'bg-iceMint text-white shadow-md' 
          : 'text-gray-300 hover:bg-iceMint/20 hover:text-white'
        }
      `}
      style={{
        '--hover-bg-color': '#5CB6BD'
      } as React.CSSProperties}
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
    { id: 'Firefighting & Alarm', label: 'Firefighting & Alarm', icon: <Shield className="h-6 w-6" /> },
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

      {/* Sidebar */}
      <aside 
        data-sidebar="true"
        className={`
        fixed lg:relative
        bg-[#4E4456]
        transition-all duration-300 ease-in-out 
        flex flex-col
        z-50 lg:z-auto
        h-full
        shadow-2xl
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'}
      `}>
        {/* Logo section with extended header color */}
        <div className="relative flex items-center justify-center p-4 h-24 flex-shrink-0 bg-[#3A353F] border-b border-[#5A5563]">
          {/* Logo - hidden when sidebar is collapsed */}
          {isOpen ? (
            <img 
              src="/APP Logo.png" 
              alt="MBR App Logo" 
              className="h-16 w-auto object-contain filter brightness-110"
            />
          ) : (
            /* Show a dot or abbreviated version when collapsed on desktop */
            <div className="hidden lg:flex items-center justify-center">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">MB</span>
              </div>
            </div>
          )}
          
          {/* Desktop toggle button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="sidebar-toggle-button hidden lg:flex p-1.5 rounded-full hover:bg-iceMint absolute -right-4 top-8 bg-[#4E4456] border-2 border-[#5A5563] text-gray-300 hover:text-white transition-all duration-300 shadow-lg"
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