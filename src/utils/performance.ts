// src/utils/performance.ts
import { lazy, Suspense, ComponentType } from 'react';
import { GlassmorphicSkeleton } from '../components/UI/EnhancedGlassmorphism';

// Lazy loading wrapper with loading state
export function lazyLoadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <GlassmorphicSkeleton height="200px" />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Data decimation for large datasets
export function decimateData<T>(
  data: T[],
  maxPoints: number = 1000,
  keyExtractor: (item: T) => number
): T[] {
  if (data.length <= maxPoints) return data;
  
  const factor = Math.ceil(data.length / maxPoints);
  return data.filter((_, index) => index % factor === 0);
}

// Debounce function for search and input handling
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttle function for scroll and resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number = 300
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoized selector creator for complex state derivations
export function createSelector<T, R>(
  selector: (state: T) => R,
  equalityFn?: (a: R, b: R) => boolean
): (state: T) => R {
  let lastState: T;
  let lastResult: R;
  
  return (state: T) => {
    if (state !== lastState) {
      const newResult = selector(state);
      if (!equalityFn || !equalityFn(newResult, lastResult)) {
        lastResult = newResult;
      }
      lastState = state;
    }
    return lastResult;
  };
}

// Bundle size optimization helpers
export const dynamicImports = {
  FileManager: () => import('../components/FileManagement/FileManager'),
  OptimizedChart: () => import('../components/Charts/OptimizedChart'),
  // Add more dynamic imports as needed
};