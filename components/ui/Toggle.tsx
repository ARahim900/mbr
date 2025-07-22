import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: {
      track: 'w-10 h-5',
      thumb: 'w-4 h-4',
      translate: 'translate-x-5',
      label: 'text-sm'
    },
    md: {
      track: 'w-12 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-6',
      label: 'text-base'
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
      label: 'text-lg'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          relative inline-flex items-center ${currentSize.track} rounded-full
          transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent
          ${checked 
            ? 'bg-gradient-to-r from-accent to-accent/80 shadow-lg' 
            : 'bg-gray-300 dark:bg-gray-600 shadow-md'
          }
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer hover:shadow-xl transform hover:scale-105'
          }
        `}
        aria-checked={checked}
        role="switch"
      >
        <span
          className={`
            ${currentSize.thumb} bg-white rounded-full shadow-lg transform transition-all duration-300
            flex items-center justify-center
            ${checked ? currentSize.translate : 'translate-x-0.5'}
            ${!disabled && 'group-hover:shadow-xl'}
          `}
        >
          {/* Optional check mark or dot indicator */}
          <span 
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${checked ? 'bg-accent/30' : 'bg-gray-400/30'}
            `}
          />
        </span>
      </button>
      
      {label && (
        <label
          className={`
            ${currentSize.label} font-medium text-gray-700 dark:text-gray-300
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onClick={() => !disabled && onChange(!checked)}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Toggle; 