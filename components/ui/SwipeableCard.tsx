import React, { useState, useRef } from 'react';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  className = ''
}) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const swipeThreshold = 100; // pixels
  
  const handleStart = (clientX: number) => {
    setStartX(clientX);
    setIsDragging(true);
  };
  
  const handleMove = (clientX: number) => {
    if (!startX || !isDragging) return;
    
    const deltaX = clientX - startX;
    setCurrentX(deltaX);
  };
  
  const handleEnd = () => {
    if (!isDragging) return;
    
    if (Math.abs(currentX) > swipeThreshold) {
      if (currentX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (currentX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
    
    setStartX(null);
    setCurrentX(0);
    setIsDragging(false);
  };
  
  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    handleEnd();
  };
  
  // Mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };
  
  const handleMouseUp = () => {
    handleEnd();
  };
  
  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };
  
  return (
    <div
      ref={cardRef}
      className={`relative touch-pan-y ${className}`}
      style={{
        transform: `translateX(${currentX}px) rotate(${currentX * 0.05}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        opacity: 1 - Math.abs(currentX) / 500,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={isDragging ? handleMouseMove : undefined}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Swipe indicators */}
      {isDragging && currentX > swipeThreshold && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <div className="bg-green-500 text-white p-2 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
      
      {isDragging && currentX < -swipeThreshold && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <div className="bg-red-500 text-white p-2 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default SwipeableCard;