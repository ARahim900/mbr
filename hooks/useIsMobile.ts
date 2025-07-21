import { useState, useEffect } from 'react';
import { debounce } from '../utils';

// Breakpoint definitions
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Hook for checking if screen is mobile
export const useIsMobile = (breakpoint: number | Breakpoint = 'md') => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const bp = typeof breakpoint === 'number' ? breakpoint : breakpoints[breakpoint];
    
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < bp);
    };

    // Debounced resize handler for better performance
    const debouncedCheck = debounce(checkIsMobile, 150);

    // Check on mount
    checkIsMobile();

    // Add event listener
    window.addEventListener('resize', debouncedCheck);

    // Cleanup
    return () => window.removeEventListener('resize', debouncedCheck);
  }, [breakpoint]);

  return isMobile;
};

// Hook for responsive breakpoints
export const useBreakpoint = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xs');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= breakpoints['2xl']) setCurrentBreakpoint('2xl');
      else if (width >= breakpoints.xl) setCurrentBreakpoint('xl');
      else if (width >= breakpoints.lg) setCurrentBreakpoint('lg');
      else if (width >= breakpoints.md) setCurrentBreakpoint('md');
      else if (width >= breakpoints.sm) setCurrentBreakpoint('sm');
      else setCurrentBreakpoint('xs');
    };

    const debouncedCheck = debounce(checkBreakpoint, 150);

    // Check on mount
    checkBreakpoint();

    // Add event listener
    window.addEventListener('resize', debouncedCheck);

    // Cleanup
    return () => window.removeEventListener('resize', debouncedCheck);
  }, []);

  return {
    current: currentBreakpoint,
    isXs: currentBreakpoint === 'xs',
    isSm: currentBreakpoint === 'sm',
    isMd: currentBreakpoint === 'md',
    isLg: currentBreakpoint === 'lg',
    isXl: currentBreakpoint === 'xl',
    is2Xl: currentBreakpoint === '2xl',
    isMobile: ['xs', 'sm'].includes(currentBreakpoint),
    isTablet: currentBreakpoint === 'md',
    isDesktop: ['lg', 'xl', '2xl'].includes(currentBreakpoint),
  };
};

// Hook for media queries
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = () => setMatches(mediaQuery.matches);
    
    // Set initial value
    handleChange();
    
    // Add listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};
