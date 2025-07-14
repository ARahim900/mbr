import React, { ButtonHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#00D2B3] to-[#4E4456] text-white hover:shadow-lg',
    secondary: 'bg-gradient-to-r from-[#4E4456] to-[#6C63FF] text-white hover:shadow-lg',
    outline: 'bg-transparent border-2 border-[#00D2B3] text-[#00D2B3] hover:bg-[#00D2B3]/10'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <button
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded-lg font-medium
        transition-all duration-300
        transform hover:scale-105
        flex items-center justify-center space-x-2
        ${className}
      `}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={iconSizes[size]} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon size={iconSizes[size]} />}
    </button>
  );
};