import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  debounceMs?: number;
  minHeight?: number;
}

const SafeResponsiveContainer: React.FC<Props> = ({ 
  children, 
  width = "100%", 
  height = 350, 
  debounceMs = 150,
  minHeight = 300
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const dimensions = {
          width: rect.width || 400,
          height: typeof height === 'number' ? height : rect.height || minHeight
        };
        console.log('SafeResponsiveContainer dimensions:', dimensions, 'Original rect:', rect);
        setContainerDimensions(dimensions);
      }
    };

    // Set initial container size
    const timer = setTimeout(() => {
      updateDimensions();
      setIsLoading(false);
    }, debounceMs);

    // Update dimensions on resize
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [debounceMs, height, minHeight]);

  // Prevent SSR issues
  if (!isClient) {
    return (
      <div 
        ref={containerRef}
        style={{ 
          width, 
          height: typeof height === 'number' ? `${height}px` : height,
          minHeight: `${minHeight}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Show loading state briefly to prevent flashing
  if (isLoading || containerDimensions.width === 0) {
    return (
      <div 
        ref={containerRef}
        style={{ 
          width, 
          height: typeof height === 'number' ? `${height}px` : height,
          minHeight: `${minHeight}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  console.log('SafeResponsiveContainer rendering with dimensions:', containerDimensions);

  // Try bypassing ResponsiveContainer entirely if dimensions are valid
  if (containerDimensions.width > 0 && containerDimensions.height > 0) {
    const chartElement = React.cloneElement(children as React.ReactElement, {
      width: containerDimensions.width,
      height: containerDimensions.height
    });

    return (
      <div 
        ref={containerRef}
        style={{ 
          width, 
          height: typeof height === 'number' ? `${height}px` : height,
          minHeight: `${minHeight}px`,
          position: 'relative',
          border: '2px solid green' // Debug border - green for fixed dimensions
        }}
      >
        {chartElement}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      style={{ 
        width, 
        height: typeof height === 'number' ? `${height}px` : height,
        minHeight: `${minHeight}px`,
        position: 'relative',
        border: '2px solid red' // Debug border - red for ResponsiveContainer fallback
      }}
    >
      <ResponsiveContainer 
        width={containerDimensions.width || 400} 
        height={containerDimensions.height || minHeight}
        debounce={debounceMs}
      >
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
};

export default SafeResponsiveContainer;