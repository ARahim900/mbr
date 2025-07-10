import React, { useState } from 'react';
import { Droplets, User, LogOut, ChevronDown } from 'lucide-react';
import TopNavigation from './TopNavigation';
import { useAuth } from '../contexts/AuthContext';
import { useClickOutside } from '../hooks/useClickOutside';

interface TopHeaderProps {
    activeSection: string;
    onSectionChange: (sectionId: string) => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ activeSection, onSectionChange }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useClickOutside(() => setShowUserMenu(false));

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'operator': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
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
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.department}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.fullName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{user?.username}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user?.role || '')}`}>
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
                
                <div className="px-4 py-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {user?.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
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
