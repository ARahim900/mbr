import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileBottomNav from './ui/MobileBottomNav';
import { Bell, Search, Menu, User, Settings, Droplets, Zap, Wind, Shield, HardHat, Recycle } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile(1024); // Use 1024px breakpoint for mobile detection
  const location = useLocation();
  const navigate = useNavigate();

  // Get active section from current route
  const getActiveSection = () => {
    const path = location.pathname;
    switch (path) {
      case '/water':
        return 'Water System';
      case '/electricity':
        return 'Electricity System';
      case '/hvac':
        return 'HVAC System';
      case '/firefighting':
        return 'Firefighting & Alarm';
      case '/contractor':
        return 'Contractor Tracker';
      case '/stp':
        return 'STP Plant';
      default:
        return 'Water System';
    }
  };

  const activeSection = getActiveSection();

  const setActiveSection = (section: string) => {
    switch (section) {
      case 'Water System':
        navigate('/water');
        break;
      case 'Electricity System':
        navigate('/electricity');
        break;
      case 'HVAC System':
        navigate('/hvac');
        break;
      case 'Firefighting & Alarm':
        navigate('/firefighting');
        break;
      case 'Contractor Tracker':
        navigate('/contractor');
        break;
      case 'STP Plant':
        navigate('/stp');
        break;
      default:
        navigate('/water');
    }
  };

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
      {/* Skip Navigation Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:text-sm"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block" role="navigation" aria-label="Primary navigation">
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close navigation menu"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsSidebarOpen(false);
            }
          }}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <aside 
          className={`fixed top-0 left-0 h-full z-50 lg:hidden transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="navigation" 
          aria-label="Primary navigation"
          aria-hidden={!isSidebarOpen}
        >
          <Sidebar 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen} 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
          />
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-[#4E4456] shadow-lg z-40 mobile-header" role="banner">
          <div className="flex items-center justify-between p-4 h-full">
            {/* Left side - Menu button and title */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mobile-touch-target lg:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-iceMint/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4E4456]"
                aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isSidebarOpen}
                aria-controls="mobile-navigation"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-white leading-tight">{activeSection}</h1>
                <p className="text-xs text-gray-300 hidden sm:block">Muscat Bay Resource Management</p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2" role="toolbar" aria-label="Header actions">
              {/* Search button - hidden on very small screens */}
              <button 
                className="mobile-touch-target p-2 rounded-lg bg-white/10 text-white hover:bg-iceMint/20 transition-colors hidden sm:block focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4E4456]"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button 
                className="mobile-touch-target relative p-2 rounded-lg bg-white/10 text-white hover:bg-iceMint/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4E4456]"
                aria-label="Notifications (1 unread)"
                aria-describedby="notification-badge"
              >
                <Bell className="h-5 w-5" />
                <span 
                  id="notification-badge"
                  className="absolute top-1 right-1 w-2 h-2 bg-iceMint rounded-full"
                  aria-hidden="true"
                ></span>
              </button>

              {/* Settings - hidden on small screens */}
              <button 
                className="mobile-touch-target p-2 rounded-lg bg-white/10 text-white hover:bg-iceMint/20 transition-colors hidden md:block focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4E4456]"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>

              {/* User avatar */}
              <button 
                className="mobile-touch-target flex items-center space-x-2 p-2 pr-3 rounded-lg bg-white/10 text-white hover:bg-iceMint/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4E4456]"
                aria-label="User menu for Admin"
              >
                <div className="w-8 h-8 rounded-full bg-iceMint flex items-center justify-center" aria-hidden="true">
                  <User className="h-5 w-5" />
                </div>
                <span className="hidden lg:block text-sm font-medium">Admin</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main 
          id="main-content" 
          className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 mobile-content"
          role="main"
          tabIndex={-1}
        >
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <nav role="navigation" aria-label="Mobile bottom navigation">
            <MobileBottomNav 
              sections={mobileNavItems}
              activeSection={activeSection}
              onSectionChange={(sectionId) => {
                setActiveSection(sectionId);
                // Close sidebar if open
                if (isSidebarOpen) {
                  setIsSidebarOpen(false);
                }
                // Announce page change to screen readers
                const announcement = `Navigated to ${sectionId} section`;
                const announcer = document.createElement('div');
                announcer.setAttribute('aria-live', 'polite');
                announcer.setAttribute('aria-atomic', 'true');
                announcer.className = 'sr-only';
                announcer.textContent = announcement;
                document.body.appendChild(announcer);
                setTimeout(() => document.body.removeChild(announcer), 1000);
              }}
            />
          </nav>
        )}
      </div>
    </div>
  );
};

export default Layout;