import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface TopHeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="md:hidden bg-gradient-to-r from-header-primary to-header-secondary shadow-md sticky top-0 z-40">
      <div className="px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">Muscat Bay</h1>
          <p className="text-xs text-gray-300">Assets & Operations</p>
        </div>
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
