import { useEffect } from 'react';

declare global {
  interface Window {
    AOS: {
      init: (options?: any) => void;
      refresh: () => void;
      refreshHard: () => void;
    };
  }
}

interface AOSOptions {
  offset?: number;
  delay?: number;
  duration?: number;
  easing?: string;
  once?: boolean;
  mirror?: boolean;
  anchorPlacement?: string;
}

export const useAOS = (options: AOSOptions = {}) => {
  useEffect(() => {
    // Initialize AOS when component mounts
    if (typeof window !== 'undefined' && window.AOS) {
      window.AOS.init({
        // Default options
        offset: 120,
        delay: 0,
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        anchorPlacement: 'top-bottom',
        // Override with custom options
        ...options,
      });
    }

    // Refresh AOS on window resize
    const handleResize = () => {
      if (window.AOS) {
        window.AOS.refresh();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [options]);

  // Function to refresh AOS manually
  const refreshAOS = () => {
    if (typeof window !== 'undefined' && window.AOS) {
      window.AOS.refresh();
    }
  };

  return { refreshAOS };
}; 