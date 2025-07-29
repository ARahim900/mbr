import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
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
  const baseStyles = 'font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95';
  
  const sizeStyles = {
    sm: 'text-sm py-2 px-4',
    md: 'text-base py-3 px-6',
    lg: 'text-lg py-4 px-8'
  };
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-accent to-accent/80 text-white hover:from-accent/90 hover:to-accent/70 disabled:from-gray-400 disabled:to-gray-400',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-white bg-white dark:bg-gray-800 hover:shadow-accent/25',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white shadow-none hover:shadow-lg',
    gradient: 'bg-gradient-to-r from-[#4E4456] to-[#00D2B3] text-white hover:from-[#4E4456]/90 hover:to-[#00D2B3]/90 hover:shadow-[#00D2B3]/25'
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:translate-y-0' : '';
  
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