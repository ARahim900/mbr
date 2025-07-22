import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'hover-lift';
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  onClick 
}) => {
  const baseClasses = 'group rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1';
  
  const variantClasses = {
    default: 'hover:shadow-2xl',
    gradient: 'bg-gradient-to-br from-white/10 to-white/5 hover:shadow-2xl',
    'hover-lift': 'hover:shadow-2xl hover:scale-[1.03]'
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div 
      className={combinedClasses}
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25), 0 4px 16px 0 rgba(0, 0, 0, 0.1)'
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;
