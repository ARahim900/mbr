import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onClick, 
  icon = <Plus className="h-6 w-6" /> 
}) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 w-14 h-14 bg-accent text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-40"
    >
      {icon}
    </button>
  );
};

export default FloatingActionButton;