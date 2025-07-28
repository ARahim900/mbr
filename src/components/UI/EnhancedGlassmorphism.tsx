// src/components/UI/EnhancedGlassmorphism.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'medium' | 'deep' | 'ultra';
  animated?: boolean;
  onClick?: () => void;
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className = '',
  variant = 'medium',
  animated = true,
  onClick
}) => {
  const variants = {
    light: {
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(10px) saturate(150%)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.1)',
    },
    medium: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    },
    deep: {
      background: 'rgba(255, 255, 255, 0.07)',
      backdropFilter: 'blur(30px) saturate(200%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.2)',
    },
    ultra: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      backdropFilter: 'blur(40px) saturate(250%)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 16px 64px 0 rgba(31, 38, 135, 0.25), inset 0 0 30px rgba(255, 255, 255, 0.05)',
    },
  };

  const Component = animated ? motion.div : 'div';
  const style = {
    ...variants[variant],
    WebkitBackdropFilter: variants[variant].backdropFilter,
  };

  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
    whileHover: { 
      y: -4,
      boxShadow: variant === 'ultra' 
        ? '0 20px 80px 0 rgba(31, 38, 135, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.08)'
        : '0 12px 48px 0 rgba(31, 38, 135, 0.25)'
    }
  } : {};

  return (
    <Component
      className={`rounded-2xl transition-all duration-300 ${className}`}
      style={style}
      onClick={onClick}
      {...animationProps}
    >
      {children}
    </Component>
  );
};

// Enhanced Button Component
interface GlassmorphicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const GlassmorphicButton: React.FC<GlassmorphicButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon
}) => {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      color: 'rgb(147, 197, 253)',
      hoverBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.3) 100%)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.9)',
      hoverBg: 'rgba(255, 255, 255, 0.1)',
    },
    danger: {
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      color: 'rgb(252, 165, 165)',
      hoverBg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)',
    },
    success: {
      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.2) 100%)',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      color: 'rgb(134, 239, 172)',
      hoverBg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.3) 100%)',
    },
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const currentVariant = variants[variant];

  return (
    <motion.button
      className={`
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg font-medium
        backdrop-blur-md
        transition-all duration-300
        flex items-center justify-center gap-2
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        background: currentVariant.background,
        border: currentVariant.border,
        color: currentVariant.color,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
      }}
      whileHover={!disabled && !loading ? { 
        scale: 1.02,
        boxShadow: '0 6px 24px 0 rgba(0, 0, 0, 0.15)',
      } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      ) : icon}
      {children}
    </motion.button>
  );
};

// Enhanced Chart Component with Glassmorphism
interface GlassmorphicChartProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const GlassmorphicChart: React.FC<GlassmorphicChartProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <GlassmorphicCard variant="deep" className={`p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white/90">{title}</h3>
        <div className="mt-2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      <div className="relative">
        {/* Grid overlay for charts */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
        {children}
      </div>
    </GlassmorphicCard>
  );
};

// Animated Loading Skeleton
interface GlassmorphicSkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export const GlassmorphicSkeleton: React.FC<GlassmorphicSkeletonProps> = ({
  width = '100%',
  height = '20px',
  className = ''
}) => {
  return (
    <motion.div
      className={`rounded-lg ${className}`}
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%)',
        backgroundSize: '200% 100%',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration: 1.5,
        ease: 'linear',
        repeat: Infinity,
      }}
    />
  );
};

// Notification Component
interface NotificationProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
}

export const GlassmorphicNotification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  onClose
}) => {
  const typeStyles = {
    info: { icon: 'ℹ️', color: 'rgba(59, 130, 246, 0.5)' },
    success: { icon: '✅', color: 'rgba(34, 197, 94, 0.5)' },
    warning: { icon: '⚠️', color: 'rgba(251, 191, 36, 0.5)' },
    error: { icon: '❌', color: 'rgba(239, 68, 68, 0.5)' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 right-4 max-w-sm"
    >
      <GlassmorphicCard variant="ultra" className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{typeStyles[type].icon}</span>
          <div className="flex-1">
            <p className="text-white/90">{message}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white/80 transition-colors duration-200"
            >
              ✕
            </button>
          )}
        </div>
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
          style={{ background: typeStyles[type].color }}
        />
      </GlassmorphicCard>
    </motion.div>
  );
};