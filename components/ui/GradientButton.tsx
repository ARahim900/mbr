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
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#4E4456] to-[#00D2B3] text-white hover:from-[#4E4456]/90 hover:to-[#00D2B3]/90 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-[#00D2B3] text-[#00D2B3] hover:bg-[#00D2B3] hover:text-white bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl hover:shadow-[#00D2B3]/25'
  };

  const baseClasses = `
    font-semibold rounded-2xl transition-all duration-300 
    transform hover:scale-105 hover:-translate-y-0.5 active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:scale-100 disabled:hover:translate-y-0
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
