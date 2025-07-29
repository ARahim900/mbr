import React from 'react';
import { cardGradients } from '../../utils/colorUtils';

interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'outlined' | 'gradient';
  theme?: 'water' | 'electricity' | 'hvac' | 'fire' | 'contractor' | 'stp';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const BaseCard: React.FC<BaseCardProps> = ({
  children,
  className = '',
  variant = 'solid',
  theme,
  hover = true,
  clickable = false,
  onClick,
  padding = 'md',
  shadow = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const variantClasses = {
    glass: 'backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/20',
    solid: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
    gradient: theme ? `bg-gradient-to-br ${cardGradients[theme]}` : 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
  };

  const hoverClasses = hover ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5' : '';
  const clickableClasses = clickable || onClick ? 'cursor-pointer' : '';

  const baseClasses = `
    rounded-xl
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${hoverClasses}
    ${clickableClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={baseClasses}
      onClick={onClick}
      role={clickable || onClick ? 'button' : undefined}
      tabIndex={clickable || onClick ? 0 : undefined}
    >
      {children}
    </Component>
  );
};

export default BaseCard;