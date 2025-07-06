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
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <input type="text" readOnly value={value.start} className="w-full text-center p-3 border-2 border-primary-dark rounded-lg bg-gray-50 dark:bg-gray-700 text-primary dark:text-gray-200" />
        <span className="text-secondary dark:text-gray-400 font-semibold">to</span>
        <input type="text" readOnly value={value.end} className="w-full text-center p-3 border-2 border-primary-dark rounded-lg bg-gray-50 dark:bg-gray-700 text-primary dark:text-gray-200" />
      </div>

      <div className="relative h-8 flex items-center">
        <div className="absolute top-0 bottom-0 left-0 right-0 h-1.5 my-auto bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div 
            className="absolute top-0 bottom-0 h-1.5 my-auto bg-gradient-to-r from-gray-600 to-gray-700 dark:bg-gradient-to-r dark:from-gray-500 dark:to-gray-600 rounded-full"
            style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }}
        />
        <input
            type="range"
            min={min}
            max={max}
            value={startIndex}
            onChange={handleStartChange}
            className="slider-thumb"
            style={{ zIndex: 3 }}
        />
        <input
            type="range"
            min={min}
            max={max}
            value={endIndex}
            onChange={handleEndChange}
            className="slider-thumb"
            style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
};

export default MonthRangeSlider;