import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MobileBottomNav from './ui/MobileBottomNav';
import { Bell, Search, Menu, User, Settings, Droplets, Zap, Wind, Shield, HardHat, Recycle } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeSection, setActiveSection }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile(1024); // Use 1024px breakpoint for mobile detection

  // Navigation items for mobile bottom nav
  const mobileNavItems = [
    { id: 'Water System', label: 'Water', icon: Droplets, shortName: 'Water' },
    { id: 'Electricity System', label: 'Electricity', icon: Zap, shortName: 'Power' },
    { id: 'HVAC System', label: 'HVAC', icon: Wind, shortName: 'HVAC' },
    { id: 'Firefighting & Alarm', label: 'Fire', icon: Shield, shortName: 'Fire' },
    { id: 'Contractor Tracker', label: 'Contractor', icon: HardHat, shortName: 'Work' },
    { id: 'STP Plant', label: 'STP', icon: Recycle, shortName: 'STP' },
  ];

  // Set initial state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <div className={`fixed top-0 left-0 h-full z-50 lg:hidden transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen} 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-[#4E4456] shadow-lg z-40 mobile-header">
          <div className="flex items-center justify-between p-4 h-full">
            {/* Left side - Menu button and title */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mobile-touch-target lg:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-iceMint/20 transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-white leading-tight">{activeSection}</h1>
                <p className="text-xs text-gray-300 hidden sm:block">Muscat Bay Resource Management</p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              {/* Search button - hidden on very small screens */}
              <button className="mobile-touch-target p-2 rounded-lg bg-white/10 text-white hover:bg-iceMint/20 transition-colors hidden sm:block">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="mobile-touch-target relative p-2 rounded-lg bg-white/10 text-white hover:bg-iceMint/20 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-iceMint rounded-full"></span>
              </button>

              {/* Settings - hidden on small screens */}
              <button className="mobile-touch-target p-2 rounded-lg bg-white/10 text-white hover:bg-iceMint/20 transition-colors hidden md:block">
                <Settings className="h-5 w-5" />
              </button>

              {/* User avatar */}
              <button className="mobile-touch-target flex items-center space-x-2 p-2 pr-3 rounded-lg bg-white/10 text-white hover:bg-iceMint/20 transition-colors">
                <div className="w-8 h-8 rounded-full bg-iceMint flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <span className="hidden lg:block text-sm font-medium">Admin</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 mobile-content">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <MobileBottomNav 
            sections={mobileNavItems}
            activeSection={activeSection}
            onSectionChange={(sectionId) => {
              setActiveSection(sectionId);
              // Close sidebar if open
              if (isSidebarOpen) {
                setIsSidebarOpen(false);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;