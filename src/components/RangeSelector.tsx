import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

interface RangeSelectorProps {
  onRangeChange: (startDate: Date, endDate: Date) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
  disabled?: boolean;
}

const RangeSelector: React.FC<RangeSelectorProps> = ({
  onRangeChange,
  initialStartDate,
  initialEndDate,
  disabled = false
}) => {
  const [startDate, setStartDate] = useState<string>(
    initialStartDate ? initialStartDate.toISOString().split('T')[0] : ''
  );
  const [endDate, setEndDate] = useState<string>(
    initialEndDate ? initialEndDate.toISOString().split('T')[0] : ''
  );
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced function to prevent freeze during rapid input changes
  const debouncedRangeChange = useCallback(
    debounce((start: string, end: string) => {
      setIsProcessing(true);
      setError(null);
      
      try {
        if (start && end) {
          const startDateObj = new Date(start);
          const endDateObj = new Date(end);
          
          // Validate date range
          if (startDateObj > endDateObj) {
            setError('Start date must be before end date');
            setIsProcessing(false);
            return;
          }
          
          // Check if range is too large (more than 1 year)
          const diffTime = Math.abs(endDateObj.getTime() - startDateObj.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays > 365) {
            setError('Date range cannot exceed 365 days');
            setIsProcessing(false);
            return;
          }
          
          onRangeChange(startDateObj, endDateObj);
        }
      } catch (err) {
        setError('Invalid date format');
        console.error('Range selection error:', err);
      } finally {
        setIsProcessing(false);
      }
    }, 300), // 300ms debounce delay
    [onRangeChange]
  );

  // Effect to handle range changes
  useEffect(() => {
    if (startDate && endDate) {
      debouncedRangeChange(startDate, endDate);
    }
    
    // Cleanup function to cancel pending debounced calls
    return () => {
      debouncedRangeChange.cancel();
    };
  }, [startDate, endDate, debouncedRangeChange]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleStartDateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      setStartDate(event.target.value);
      setError(null);
    }
  }, [disabled]);

  const handleEndDateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      setEndDate(event.target.value);
      setError(null);
    }
  }, [disabled]);

  // Quick preset handlers
  const handlePresetRange = useCallback((days: number) => {
    if (disabled) return;
    
    const endDateObj = new Date();
    const startDateObj = new Date();
    startDateObj.setDate(endDateObj.getDate() - days);
    
    setStartDate(startDateObj.toISOString().split('T')[0]);
    setEndDate(endDateObj.toISOString().split('T')[0]);
  }, [disabled]);

  const presetButtons = useMemo(() => [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
  ], []);

  return (
    <div className="range-selector">
      <div className="range-inputs">
        <div className="input-group">
          <label htmlFor="start-date">Start Date:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            disabled={disabled || isProcessing}
            className={`date-input ${error ? 'error' : ''}`}
            aria-describedby={error ? 'range-error' : undefined}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="end-date">End Date:</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            disabled={disabled || isProcessing}
            className={`date-input ${error ? 'error' : ''}`}
            aria-describedby={error ? 'range-error' : undefined}
          />
        </div>
      </div>

      <div className="preset-buttons">
        {presetButtons.map(({ label, days }) => (
          <button
            key={days}
            type="button"
            onClick={() => handlePresetRange(days)}
            disabled={disabled || isProcessing}
            className="preset-btn"
          >
            {label}
          </button>
        ))}
      </div>

      {isProcessing && (
        <div className="processing-indicator">
          <span>Processing...</span>
        </div>
      )}

      {error && (
        <div id="range-error" className="error-message" role="alert">
          {error}
        </div>
      )}

      <style jsx>{`
        .range-selector {
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }

        .range-inputs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .input-group label {
          font-weight: 500;
          font-size: 0.9rem;
          color: #333;
        }

        .date-input {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: border-color 0.2s ease;
        }

        .date-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .date-input.error {
          border-color: #dc3545;
        }

        .date-input:disabled {
          background-color: #e9ecef;
          opacity: 0.6;
          cursor: not-allowed;
        }

        .preset-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .preset-btn {
          padding: 0.5rem 1rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: background-color 0.2s ease;
        }

        .preset-btn:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .preset-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        .processing-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #007bff;
          font-size: 0.9rem;
        }

        .error-message {
          color: #dc3545;
          font-size: 0.8rem;
          margin-top: 0.5rem;
          padding: 0.5rem;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .range-inputs {
            flex-direction: column;
          }
          
          .preset-buttons {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default RangeSelector;