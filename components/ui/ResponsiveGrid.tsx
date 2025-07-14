import React, { ReactNode, HTMLAttributes } from 'react';

interface ResponsiveGridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3, wide: 4 },
  gap = 'md',
  className = '',
  ...props
}) => {
  const gapClasses = {
    sm: 'gap-2 md:gap-4',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8'
  };

  const gridColsClasses = [
    `grid-cols-${cols.mobile || 1}`,
    cols.tablet ? `sm:grid-cols-${cols.tablet}` : '',
    cols.desktop ? `lg:grid-cols-${cols.desktop}` : '',
    cols.wide ? `xl:grid-cols-${cols.wide}` : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={`grid ${gridColsClasses} ${gapClasses[gap]} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};