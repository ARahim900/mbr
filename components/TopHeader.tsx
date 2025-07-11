import React, { useState } from 'react';
import { Droplets, User, LogOut, ChevronDown } from 'lucide-react';
import TopNavigation from './TopNavigation';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useClickOutside } from '../hooks/useClickOutside';

interface TopHeaderProps {
    activeSection: string;
    onSectionChange: (sectionId: string) => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ activeSection, onSectionChange }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useClickOutside(() => setShowUserMenu(false));

  const handleLogout = () => {
    signOut();
    setShowUserMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md transition-colors duration-300 h-24 lg:h-20">
      <div className="container mx-auto flex justify-between items-center h-full px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Droplets className="h-8 w-8 text-accent" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white whitespace-nowrap">
            Muscat Bay
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <TopNavigation activeSection={activeSection} onSectionChange={onSectionChange} />
          
          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.primaryEmailAddress?.emailAddress || 'user@muscatbay.com'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.primaryEmailAddress?.emailAddress || 'user@muscatbay.com'}
                  </p>
                  <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    USER
                  </span>
                </div>
                
                <div className="px-4 py-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">User ID:</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                    {user?.id || 'N/A'}
                  </p>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
