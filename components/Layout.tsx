import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Bell, Search, Menu, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeSection, setActiveSection }) => {
  // Start with sidebar closed on mobile, open on desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Modern Top Header Bar */}
        <header className="bg-[#4E4456] shadow-lg z-40">
          <div className="flex items-center justify-between p-4">
            {/* Left side - Menu button and title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{activeSection}</h1>
                <p className="text-sm text-gray-300">Muscat Bay Resource Management</p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3">
              {/* Search button */}
              <button className="p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors hidden sm:block">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="relative p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </button>

              {/* Settings */}
              <button className="p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors hidden sm:block">
                <Settings className="h-5 w-5" />
              </button>

              {/* User avatar */}
              <button className="flex items-center space-x-2 p-2 pr-4 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.fullName?.split(' ')[0] || 'User'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;