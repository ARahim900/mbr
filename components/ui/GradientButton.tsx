import React from 'react';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#4E4456] to-[#00D2B3] text-white hover:opacity-90',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:opacity-90',
    outline: 'border-2 border-[#00D2B3] text-[#00D2B3] hover:bg-[#00D2B3] hover:text-white'
  };

  const baseClasses = `
    font-medium rounded-md transition-all duration-300 
    transform hover:scale-105 active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:scale-100
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
};

export default GradientButton;
