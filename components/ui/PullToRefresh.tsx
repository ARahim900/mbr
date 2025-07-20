import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  
  const threshold = 80; // Pull distance required to trigger refresh
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        touchStartY = e.touches[0].clientY;
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY || isRefreshing) return;
      
      const touchY = e.touches[0].clientY;
      const distance = touchY - touchStartY;
      
      if (distance > 0 && container.scrollTop === 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance, threshold * 1.5));
      }
    };
    
    const handleTouchEnd = async () => {
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        setPullDistance(threshold);
        
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }
      
      touchStartY = 0;
    };
    
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, isRefreshing, onRefresh]);
  
  const pullPercentage = Math.min((pullDistance / threshold) * 100, 100);
  
  return (
    <div ref={containerRef} className="relative h-full overflow-auto">
      {/* Pull indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-300 z-50"
        style={{
          height: `${pullDistance}px`,
          opacity: pullDistance > 0 ? 1 : 0,
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
          <RefreshCw 
            className={`h-6 w-6 text-accent transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
            style={{
              transform: `rotate(${pullPercentage * 3.6}deg)`,
            }}
          />
        </div>
      </div>
      
      {/* Content container */}
      <div 
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pullDistance === 0 ? 'transform 0.3s' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;