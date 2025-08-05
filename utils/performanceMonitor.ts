// Performance monitoring utilities to detect and prevent visualization issues

interface PerformanceMetrics {
  renderTime: number;
  dataSize: number;
  memoryUsage?: number;
  timestamp: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics[]> = new Map();
  private memoryWarningThreshold = 50 * 1024 * 1024; // 50MB
  private maxMetricsHistory = 50;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasurement(componentName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      this.recordMetric(componentName, {
        renderTime,
        dataSize: 0, // Will be updated by caller if needed
        memoryUsage: this.getMemoryUsage(),
        timestamp: Date.now()
      });
    };
  }

  recordMetric(componentName: string, metric: PerformanceMetrics): void {
    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, []);
    }
    
    const componentMetrics = this.metrics.get(componentName)!;
    componentMetrics.push(metric);
    
    // Keep only recent metrics
    if (componentMetrics.length > this.maxMetricsHistory) {
      componentMetrics.shift();
    }
    
    // Check for performance issues
    this.checkPerformanceIssues(componentName, metric);
  }

  private checkPerformanceIssues(componentName: string, metric: PerformanceMetrics): void {
    // Check for slow rendering
    if (metric.renderTime > 1000) { // 1 second
      console.warn(`Slow rendering detected in ${componentName}: ${metric.renderTime.toFixed(2)}ms`);
    }
    
    // Check for memory issues
    if (metric.memoryUsage && metric.memoryUsage > this.memoryWarningThreshold) {
      console.warn(`High memory usage detected in ${componentName}: ${(metric.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    }
    
    // Check for consistent performance degradation
    const recentMetrics = this.metrics.get(componentName)?.slice(-5) || [];
    if (recentMetrics.length >= 5) {
      const avgRenderTime = recentMetrics.reduce((sum, m) => sum + m.renderTime, 0) / recentMetrics.length;
      if (avgRenderTime > 500) { // 500ms average
        console.warn(`Performance degradation detected in ${componentName}: avg ${avgRenderTime.toFixed(2)}ms`);
      }
    }
  }

  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      return (performance as any).memory?.usedJSHeapSize;
    }
    return undefined;
  }

  getComponentMetrics(componentName: string): PerformanceMetrics[] {
    return this.metrics.get(componentName) || [];
  }

  getAllMetrics(): Map<string, PerformanceMetrics[]> {
    return new Map(this.metrics);
  }

  clearMetrics(componentName?: string): void {
    if (componentName) {
      this.metrics.delete(componentName);
    } else {
      this.metrics.clear();
    }
  }

  generateReport(): string {
    const report: string[] = ['=== Performance Report ==='];
    
    for (const [componentName, metrics] of this.metrics) {
      if (metrics.length === 0) continue;
      
      const avgRenderTime = metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length;
      const maxRenderTime = Math.max(...metrics.map(m => m.renderTime));
      const minRenderTime = Math.min(...metrics.map(m => m.renderTime));
      
      report.push(`\n${componentName}:`);
      report.push(`  Avg Render Time: ${avgRenderTime.toFixed(2)}ms`);
      report.push(`  Max Render Time: ${maxRenderTime.toFixed(2)}ms`);
      report.push(`  Min Render Time: ${minRenderTime.toFixed(2)}ms`);
      report.push(`  Measurements: ${metrics.length}`);
      
      const lastMetric = metrics[metrics.length - 1];
      if (lastMetric.memoryUsage) {
        report.push(`  Last Memory Usage: ${(lastMetric.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
      }
    }
    
    return report.join('\n');
  }
}

// Hook for React components
export const usePerformanceMonitor = (componentName: string) => {
  const monitor = PerformanceMonitor.getInstance();
  
  const startMeasurement = () => monitor.startMeasurement(componentName);
  
  const recordDataSize = (size: number) => {
    const metrics = monitor.getComponentMetrics(componentName);
    const lastMetric = metrics[metrics.length - 1];
    if (lastMetric) {
      lastMetric.dataSize = size;
    }
  };
  
  return { startMeasurement, recordDataSize };
};

export default PerformanceMonitor;