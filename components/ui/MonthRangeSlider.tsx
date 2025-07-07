import React, { useCallback, useMemo } from 'react';

interface MonthRangeSliderProps {
  months: string[];
  value: { start: string; end: string };
  onChange: (newValue: { start: string; end: string }) => void;
}

const MonthRangeSlider: React.FC<MonthRangeSliderProps> = ({ months, value, onChange }) => {
  const min = 0;
  const max = months.length > 1 ? months.length - 1 : 1;
  
  const startIndex = useMemo(() => Math.max(0, months.indexOf(value.start)), [months, value.start]);
  const endIndex = useMemo(() => Math.max(0, months.indexOf(value.end)), [months, value.end]);

  const handleStartChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartIndex = Math.min(Number(e.target.value), endIndex);
    if (months[newStartIndex]) {
      onChange({ ...value, start: months[newStartIndex] });
    }
  }, [endIndex, months, onChange, value]);

  const handleEndChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndIndex = Math.max(Number(e.target.value), startIndex);
    if (months[newEndIndex]) {
      onChange({ ...value, end: months[newEndIndex] });
    }
  }, [startIndex, months, onChange, value]);

  const leftPercent = max > 0 ? (startIndex / max) * 100 : 0;
  const rightPercent = max > 0 ? (endIndex / max) * 100 : 0;

  return (
    <div className="month-range-slider">
      <div className="flex items-center justify-between gap-4 mb-4">
        <input 
          type="text" 
          readOnly 
          value={value.start} 
          className="w-full text-center p-3 border-2 border-gray-400 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium" 
        />
        <span className="text-gray-600 dark:text-gray-400 font-semibold">to</span>
        <input 
          type="text" 
          readOnly 
          value={value.end} 
          className="w-full text-center p-3 border-2 border-gray-400 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium" 
        />
      </div>

      <div className="relative h-12 flex items-center px-3">
        {/* Base track */}
        <div className="absolute left-0 right-0 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        
        {/* Active track */}
        <div 
          className="absolute h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
          style={{ 
            left: `${leftPercent}%`, 
            right: `${100 - rightPercent}%`
          }}
        />
        
        {/* Start slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={startIndex}
          onChange={handleStartChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
          style={{ pointerEvents: 'auto' }}
        />
        
        {/* End slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={endIndex}
          onChange={handleEndChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer z-20"
          style={{ pointerEvents: 'auto' }}
        />
        
        {/* Start thumb */}
        <div 
          className="absolute w-6 h-6 bg-blue-600 rounded-full shadow-lg transform -translate-x-1/2 pointer-events-none transition-all hover:scale-110"
          style={{ left: `${leftPercent}%` }}
        >
          <div className="absolute inset-1 bg-white rounded-full"></div>
        </div>
        
        {/* End thumb */}
        <div 
          className="absolute w-6 h-6 bg-blue-600 rounded-full shadow-lg transform -translate-x-1/2 pointer-events-none transition-all hover:scale-110"
          style={{ left: `${rightPercent}%` }}
        >
          <div className="absolute inset-1 bg-white rounded-full"></div>
        </div>
      </div>
      
      {/* Month labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        <span>{months[0]}</span>
        <span>{months[months.length - 1]}</span>
      </div>
    </div>
  );
};

export default MonthRangeSlider;