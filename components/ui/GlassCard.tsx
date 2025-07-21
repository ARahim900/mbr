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
  const baseClasses = 'glass-card';
  
  const variantClasses = {
    default: '',
    gradient: 'bg-gradient-to-br from-white/10 to-white/5',
    'hover-lift': 'hover-lift'
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div 
      className={combinedClasses}
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;
