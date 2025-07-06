import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeSection, setActiveSection }) => {
  // Start with sidebar closed on mobile, open on desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex h-screen bg-background-primary dark:bg-gray-900">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        // Add padding-left on mobile when sidebar is open to prevent content overlap
        isSidebarOpen && window.innerWidth < 1024 ? 'lg:ml-0' : ''
      }`}>
        {/* Add padding top on mobile to account for menu button */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto pt-16 lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;