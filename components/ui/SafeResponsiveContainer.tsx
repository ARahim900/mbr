import React, { useState, useEffect } from 'react';
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
  height = "100%", 
  debounceMs = 150,
  minHeight = 300
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    
    // Set initial container size
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [debounceMs]);

  // Prevent SSR issues
  if (!isClient) {
    return (
      <div 
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
  if (isLoading) {
    return (
      <div 
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

  return (
    <div style={{ 
      width, 
      height: typeof height === 'number' ? `${height}px` : height,
      minHeight: `${minHeight}px`,
      position: 'relative'
    }}>
      <ResponsiveContainer 
        width={width} 
        height={typeof height === 'number' ? height : '100%'}
        debounce={debounceMs}
      >
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
};

export default SafeResponsiveContainer;