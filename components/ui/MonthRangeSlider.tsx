import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';

interface MonthRangeSliderProps {
  months: string[];
  value: { start: string; end: string };
  onChange: (newValue: { start: string; end: string }) => void;
}

const MonthRangeSlider: React.FC<MonthRangeSliderProps> = ({ months, value, onChange }) => {
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // const min = 0;
  const max = months.length > 1 ? months.length - 1 : 0;
  
  const startIndex = useMemo(() => {
    const index = months.indexOf(value.start);
    return index >= 0 ? index : 0;
  }, [months, value.start]);
  
  const endIndex = useMemo(() => {
    const index = months.indexOf(value.end);
    return index >= 0 ? index : months.length - 1;
  }, [months, value.end]);

  const getPositionFromEvent = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return 0;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = (clientX - rect.left) / rect.width;
    
    return Math.max(0, Math.min(1, position));
  }, []);

  const getIndexFromPosition = useCallback((position: number) => {
    return Math.round(position * max);
  }, [max]);

  const handleMouseDown = useCallback((handle: 'start' | 'end') => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    const position = getPositionFromEvent(e);
    const newIndex = getIndexFromPosition(position);
    
    if (isDragging === 'start') {
      const clampedIndex = Math.min(newIndex, endIndex);
      if (clampedIndex !== startIndex && months[clampedIndex]) {
        onChange({ ...value, start: months[clampedIndex] });
      }
    } else if (isDragging === 'end') {
      const clampedIndex = Math.max(newIndex, startIndex);
      if (clampedIndex !== endIndex && months[clampedIndex]) {
        onChange({ ...value, end: months[clampedIndex] });
      }
    }
  }, [isDragging, getPositionFromEvent, getIndexFromPosition, startIndex, endIndex, months, onChange, value]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      const handleMove = (e: MouseEvent | TouchEvent) => handleMouseMove(e);
      const handleUp = () => handleMouseUp();
      
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('mouseup', handleUp);
      document.addEventListener('touchend', handleUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('mouseup', handleUp);
        document.removeEventListener('touchend', handleUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const leftPercent = max > 0 ? (startIndex / max) * 100 : 0;
  const rightPercent = max > 0 ? (endIndex / max) * 100 : 0;

  // Handle clicking on the track
  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.dataset.thumb) return; // Don't handle if clicking on thumb
    
    const position = getPositionFromEvent(e);
    const clickedIndex = getIndexFromPosition(position);
    
    // Determine which thumb to move based on proximity
    const distToStart = Math.abs(clickedIndex - startIndex);
    const distToEnd = Math.abs(clickedIndex - endIndex);
    
    if (distToStart < distToEnd) {
      if (clickedIndex <= endIndex && months[clickedIndex]) {
        onChange({ ...value, start: months[clickedIndex] });
      }
    } else {
      if (clickedIndex >= startIndex && months[clickedIndex]) {
        onChange({ ...value, end: months[clickedIndex] });
      }
    }
  }, [getPositionFromEvent, getIndexFromPosition, startIndex, endIndex, months, onChange, value]);

  return (
    <div className="month-range-slider">
      <div className="flex items-center justify-between gap-4 mb-4">
        <input 
          type="text" 
          readOnly 
          value={value.start} 
          className="w-full text-center p-3 border-2 border-gray-400 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium cursor-default" 
        />
        <span className="text-gray-600 dark:text-gray-400 font-semibold">to</span>
        <input 
          type="text" 
          readOnly 
          value={value.end} 
          className="w-full text-center p-3 border-2 border-gray-400 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium cursor-default" 
        />
      </div>

      <div 
        ref={sliderRef}
        className="relative h-12 flex items-center px-3 cursor-pointer select-none"
        onClick={handleTrackClick}
      >
        {/* Base track */}
        <div className="absolute left-0 right-0 h-2 bg-gray-300 dark:bg-gray-600 rounded-full pointer-events-none"></div>
        
        {/* Active track */}
        <div 
          className="absolute h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 pointer-events-none"
          style={{ 
            left: `${leftPercent}%`, 
            right: `${100 - rightPercent}%`
          }}
        />
        
        {/* Start thumb */}
        <div 
          data-thumb="start"
          className={`absolute w-6 h-6 bg-blue-600 rounded-full shadow-lg transform -translate-x-1/2 cursor-grab transition-transform ${
            isDragging === 'start' ? 'scale-125 cursor-grabbing' : 'hover:scale-110'
          }`}
          style={{ 
            left: `${leftPercent}%`,
            zIndex: isDragging === 'start' ? 40 : 20
          }}
          onMouseDown={handleMouseDown('start')}
          onTouchStart={handleMouseDown('start')}
        >
          <div className="absolute inset-1 bg-white rounded-full pointer-events-none"></div>
        </div>
        
        {/* End thumb */}
        <div 
          data-thumb="end"
          className={`absolute w-6 h-6 bg-blue-600 rounded-full shadow-lg transform -translate-x-1/2 cursor-grab transition-transform ${
            isDragging === 'end' ? 'scale-125 cursor-grabbing' : 'hover:scale-110'
          }`}
          style={{ 
            left: `${rightPercent}%`,
            zIndex: isDragging === 'end' ? 40 : 30
          }}
          onMouseDown={handleMouseDown('end')}
          onTouchStart={handleMouseDown('end')}
        >
          <div className="absolute inset-1 bg-white rounded-full pointer-events-none"></div>
        </div>
      </div>
      
      {/* Month labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400 px-3">
        <span>{months[0]}</span>
        {months.length > 2 && <span className="text-center">{months[Math.floor(months.length / 2)]}</span>}
        <span>{months[months.length - 1]}</span>
      </div>
    </div>
  );
};

export default MonthRangeSlider;