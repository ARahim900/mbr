import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  disabled,
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent inline-flex items-center justify-center gap-2';
  
  const sizeStyles = {
    sm: 'text-sm py-1.5 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6'
  };
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-accent to-accent/80 text-white hover:from-accent/90 hover:to-accent/70 shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-white bg-transparent',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : '';
  
  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;