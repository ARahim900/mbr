import { useState, useEffect } from 'react';
import { debounce } from '../utils';

// Breakpoint definitions
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

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
