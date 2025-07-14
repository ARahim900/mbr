import React, { ReactNode, HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  variant?: 'default' | 'primary' | 'warning' | 'danger' | 'success';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  variant = 'default',
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-white/10 border-white/20',
    primary: 'bg-[#00D2B3]/10 border-[#00D2B3]/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
    danger: 'bg-red-500/10 border-red-500/30',
    success: 'bg-green-500/10 border-green-500/30'
  };

  return (
    <div 
      className={`
        backdrop-blur-md ${variantClasses[variant]}
        border rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        ${hover ? 'transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.5)]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};