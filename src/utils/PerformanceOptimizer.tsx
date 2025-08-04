import { debounce, throttle } from 'lodash';

// Performance monitoring and optimization utilities
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private performanceMetrics: Map<string, number[]> = new Map();
  private errorLogs: Array<{ timestamp: Date; error: Error; context: string }> = [];
  private maxLogSize = 100;

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Measure execution time of functions
  public measurePerformance<T>(
    fn: () => T | Promise<T>,
    operationName: string
  ): T | Promise<T> {
    const start = performance.now();
    
    try {
      const result = fn();
      
      if (result instanceof Promise) {
        return result.then(
          (value) => {
            this.recordMetric(operationName, performance.now() - start);
            return value;
          },
          (error) => {
            this.recordMetric(operationName, performance.now() - start, true);
            throw error;
          }
        );
      } else {
        this.recordMetric(operationName, performance.now() - start);
        return result;
      }
    } catch (error) {
      this.recordMetric(operationName, performance.now() - start, true);
      throw error;
    }
  }

  private recordMetric(operationName: string, duration: number, isError = false): void {
    if (!this.performanceMetrics.has(operationName)) {
      this.performanceMetrics.set(operationName, []);
    }
    
    const metrics = this.performanceMetrics.get(operationName)!;
    metrics.push(duration);
    
    // Keep only last 50 measurements
    if (metrics.length > 50) {
      metrics.shift();
    }

    // Log slow operations
    if (duration > 1000 && !isError) {
      console.warn(`Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`);
    }
  }

  public getPerformanceReport(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const report: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    this.performanceMetrics.forEach((durations, operationName) => {
      if (durations.length > 0) {
        const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length;
        const min = Math.min(...durations);
        const max = Math.max(...durations);
        
        report[operationName] = {
          avg: Math.round(avg * 100) / 100,
          min: Math.round(min * 100) / 100,
          max: Math.round(max * 100) / 100,
          count: durations.length
        };
      }
    });
    
    return report;
  }

  // Error handling and logging
  public logError(error: Error, context: string): void {
    const errorLog = {
      timestamp: new Date(),
      error,
      context
    };
    
    this.errorLogs.unshift(errorLog);
    
    // Keep only recent errors
    if (this.errorLogs.length > this.maxLogSize) {
      this.errorLogs = this.errorLogs.slice(0, this.maxLogSize);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error in ${context}:`, error);
    }
  }

  public getErrorLogs(): Array<{ timestamp: Date; error: Error; context: string }> {
    return [...this.errorLogs];
  }

  public clearErrorLogs(): void {
    this.errorLogs = [];
  }
}

// Debounced and throttled function factories
export const createDebouncedFunction = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: { leading?: boolean; trailing?: boolean }
): T & { cancel(): void; flush(): ReturnType<T> } => {
  return debounce(func, wait, options);
};

export const createThrottledFunction = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: { leading?: boolean; trailing?: boolean }
): T & { cancel(): void; flush(): ReturnType<T> } => {
  return throttle(func, wait, options);
};

// Memory usage monitoring
export class MemoryMonitor {
  private static memoryCheckInterval: NodeJS.Timeout | null = null;
  private static memoryWarningThreshold = 50 * 1024 * 1024; // 50MB

  static startMonitoring(intervalMs = 30000): void {
    if (this.memoryCheckInterval) {
      return; // Already monitoring
    }

    this.memoryCheckInterval = setInterval(() => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        const usedMemory = memInfo.usedJSHeapSize;
        const totalMemory = memInfo.totalJSHeapSize;

        if (usedMemory > this.memoryWarningThreshold) {
          console.warn(`High memory usage detected: ${(usedMemory / 1024 / 1024).toFixed(2)}MB`);
        }

        // Log memory stats periodically
        if (process.env.NODE_ENV === 'development') {
          console.log(`Memory: ${(usedMemory / 1024 / 1024).toFixed(2)}MB / ${(totalMemory / 1024 / 1024).toFixed(2)}MB`);
        }
      }
    }, intervalMs);
  }

  static stopMonitoring(): void {
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
      this.memoryCheckInterval = null;
    }
  }
}

// React component error boundary HOC
import React, { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const optimizer = PerformanceOptimizer.getInstance();
    optimizer.logError(error, 'React Error Boundary');
    
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo!);
      }

      return (
        <div style={{
          padding: '20px',
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#fff5f5',
          color: '#721c24',
          margin: '20px 0'
        }}>
          <h3>Something went wrong</h3>
          <p>An error occurred while rendering this component.</p>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '10px' }}>
              <summary>Error Details</summary>
              <pre style={{
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Async operation utilities with error handling
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  context: string,
  options: {
    retries?: number;
    retryDelay?: number;
    onError?: (error: Error) => void;
    fallback?: (...args: Parameters<T>) => ReturnType<T>;
  } = {}
): T => {
  const { retries = 2, retryDelay = 1000, onError, fallback } = options;

  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const optimizer = PerformanceOptimizer.getInstance();
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await optimizer.measurePerformance(
          () => asyncFn(...args),
          `${context}-attempt-${attempt + 1}`
        );
      } catch (error) {
        lastError = error as Error;
        optimizer.logError(lastError, `${context} (attempt ${attempt + 1})`);
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }

    // All retries failed
    onError?.(lastError!);
    
    if (fallback) {
      try {
        return await fallback(...args);
      } catch (fallbackError) {
        optimizer.logError(fallbackError as Error, `${context}-fallback`);
        throw fallbackError;
      }
    }

    throw lastError!;
  }) as T;
};

// Cache management for API responses
export class ApiCache {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private static maxSize = 100;

  static set(key: string, data: any, ttlMs = 300000): void { // 5 minutes default
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  static get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  static invalidate(key: string): void {
    this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }
}

// Custom hook for safe async operations in React
import { useState, useCallback, useRef, useEffect } from 'react';

export const useSafeAsync = <T>() => {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: false,
    error: null
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    if (!isMountedRef.current) return;

    setState({ data: null, loading: true, error: null });

    try {
      const result = await asyncFn();
      
      if (isMountedRef.current) {
        setState({ data: result, loading: false, error: null });
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState({ data: null, loading: false, error: error as Error });
      }
    }
  }, []);

  return { ...state, execute };
};

// Zone data validation and sanitization
export const validateZoneData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check required fields
  if (!data.id || typeof data.id !== 'string') {
    errors.push('Zone ID is required and must be a string');
  }

  if (!data.name || typeof data.name !== 'string') {
    errors.push('Zone name is required and must be a string');
  }

  if (!data.status || !['active', 'inactive', 'maintenance'].includes(data.status)) {
    errors.push('Zone status must be one of: active, inactive, maintenance');
  }

  // Validate alarms array
  if (!Array.isArray(data.alarms)) {
    errors.push('Alarms must be an array');
  } else {
    data.alarms.forEach((alarm: any, index: number) => {
      if (!alarm.id || typeof alarm.id !== 'string') {
        errors.push(`Alarm ${index}: ID is required and must be a string`);
      }

      if (!alarm.type || !['fire', 'smoke', 'co', 'heat', 'manual'].includes(alarm.type)) {
        errors.push(`Alarm ${index}: Type must be one of: fire, smoke, co, heat, manual`);
      }

      if (!alarm.severity || !['low', 'medium', 'high', 'critical'].includes(alarm.severity)) {
        errors.push(`Alarm ${index}: Severity must be one of: low, medium, high, critical`);
      }

      if (!alarm.timestamp || isNaN(new Date(alarm.timestamp).getTime())) {
        errors.push(`Alarm ${index}: Valid timestamp is required`);
      }

      if (!alarm.location || typeof alarm.location !== 'string') {
        errors.push(`Alarm ${index}: Location is required and must be a string`);
      }

      if (typeof alarm.resolved !== 'boolean') {
        errors.push(`Alarm ${index}: Resolved status must be a boolean`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Application health checker
export class ApplicationHealthChecker {
  private static checks: Map<string, () => Promise<boolean>> = new Map();

  static addHealthCheck(name: string, checkFn: () => Promise<boolean>): void {
    this.checks.set(name, checkFn);
  }

  static async runHealthChecks(): Promise<{
    overall: boolean;
    checks: Record<string, { status: boolean; error?: string }>;
  }> {
    const results: Record<string, { status: boolean; error?: string }> = {};
    let overallHealth = true;

    for (const [name, checkFn] of this.checks) {
      try {
        const status = await checkFn();
        results[name] = { status };
        
        if (!status) {
          overallHealth = false;
        }
      } catch (error) {
        results[name] = { 
          status: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        overallHealth = false;
      }
    }

    return {
      overall: overallHealth,
      checks: results
    };
  }

  static removeHealthCheck(name: string): void {
    this.checks.delete(name);
  }
}

// Initialize default health checks
ApplicationHealthChecker.addHealthCheck('memory', async () => {
  if ('memory' in performance) {
    const memInfo = (performance as any).memory;
    const usedMemory = memInfo.usedJSHeapSize;
    const totalMemory = memInfo.totalJSHeapSize;
    
    // Return false if using more than 80% of available memory
    return (usedMemory / totalMemory) < 0.8;
  }
  return true;
});

ApplicationHealthChecker.addHealthCheck('performance', async () => {
  const optimizer = PerformanceOptimizer.getInstance();
  const report = optimizer.getPerformanceReport();
  
  // Check if any operation is consistently slow (avg > 2 seconds)
  return !Object.values(report).some(metric => metric.avg > 2000);
});

// Export all utilities
export {
  PerformanceOptimizer,
  MemoryMonitor,
  ApiCache,
  ApplicationHealthChecker
};