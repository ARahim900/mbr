import React from 'react';
import { BarChart3 } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import { validateChartData } from '../../utils/dataValidation';

interface SafeChartProps {
  data: any[];
  children: React.ReactNode;
  title?: string;
  fallbackMessage?: string;
  minDataPoints?: number;
}

const ChartFallback: React.FC<{ title?: string; message?: string }> = ({ 
  title = 'Chart', 
  message = 'Unable to load chart data' 
}) => (
  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
      {title} Unavailable
    </h3>
    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
      {message}. Please refresh the page or check your data connection.
    </p>
  </div>
);

const SafeChart: React.FC<SafeChartProps> = ({
  data,
  children,
  title,
  fallbackMessage = 'Chart data is currently unavailable',
  minDataPoints = 1
}) => {
  // Validate data before rendering
  const validation = validateChartData(data);
  
  if (!validation.isValid || validation.safeData.length < minDataPoints) {
    console.warn(`SafeChart (${title}): Data validation failed`, validation.errors);
    return <ChartFallback title={title} message={fallbackMessage} />;
  }

  return (
    <ErrorBoundary
      fallback={<ChartFallback title={title} message="Chart rendering error occurred" />}
      onError={(error) => {
        console.error(`SafeChart (${title}) error:`, error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default SafeChart;