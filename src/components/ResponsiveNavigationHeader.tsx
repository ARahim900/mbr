import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

interface ResponsiveNavProps {
  onMenuToggle?: (isOpen: boolean) => void;
  onFilterChange?: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

interface FilterState {
  monthRange: {
    start: string;
    end: string;
  };
  zone: string;
  alarmType: string;
  severity: string;
}

const ResponsiveNavigationHeader: React.FC<ResponsiveNavProps> = ({
  onMenuToggle,
  onFilterChange,
  initialFilters = {}
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Filter state management
  const [filters, setFilters] = useState<FilterState>({
    monthRange: {
      start: initialFilters.monthRange?.start || '',
      end: initialFilters.monthRange?.end || ''
    },
    zone: initialFilters.zone || 'all',
    alarmType: initialFilters.alarmType || 'all',
    severity: initialFilters.severity || 'all'
  });

  // Debounced filter change handler to prevent performance issues
  const debouncedFilterChange = useCallback(
    debounce((newFilters: FilterState) => {
      setIsProcessing(true);
      try {
        onFilterChange?.(newFilters);
      } catch (error) {
        console.error('Filter change error:', error);
      } finally {
        // Add small delay to show processing state
        setTimeout(() => setIsProcessing(false), 200);
      }
    }, 500),
    [onFilterChange]
  );

  // Effect to call debounced filter change
  useEffect(() => {
    debouncedFilterChange(filters);
    
    return () => {
      debouncedFilterChange.cancel();
    };
  }, [filters, debouncedFilterChange]);

  // Mobile menu toggle handler
  const handleMobileMenuToggle = useCallback(() => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMenuToggle?.(newState);
    
    // Close filter panel when mobile menu closes
    if (!newState) {
      setIsFilterPanelOpen(false);
    }
  }, [isMobileMenuOpen, onMenuToggle]);

  // Filter panel toggle handler
  const handleFilterToggle = useCallback(() => {
    setIsFilterPanelOpen(prev => !prev);
  }, []);

  // Filter change handlers
  const handleMonthRangeChange = useCallback((field: 'start' | 'end', value: string) => {
    setFilters(prev => ({
      ...prev,
      monthRange: {
        ...prev.monthRange,
        [field]: value
      }
    }));
  }, []);

  const handleFilterChange = useCallback((field: keyof Omit<FilterState, 'monthRange'>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Quick filter presets
  const quickFilters = useMemo(() => [
    {
      label: 'Last 30 Days',
      action: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        
        setFilters(prev => ({
          ...prev,
          monthRange: {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
          }
        }));
      }
    },
    {
      label: 'This Month',
      action: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        setFilters(prev => ({
          ...prev,
          monthRange: {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
          }
        }));
      }
    },
    {
      label: 'Critical Only',
      action: () => {
        setFilters(prev => ({
          ...prev,
          severity: 'critical'
        }));
      }
    }
  ], []);

  // Clear filters handler
  const handleClearFilters = useCallback(() => {
    setFilters({
      monthRange: { start: '', end: '' },
      zone: 'all',
      alarmType: 'all',
      severity: 'all'
    });
  }, []);

  // Close panels when clicking outside (for mobile)
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Close mobile menu if clicking outside
      if (isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-toggle')) {
        setIsMobileMenuOpen(false);
        onMenuToggle?.(false);
      }
      
      // Close filter panel if clicking outside
      if (isFilterPanelOpen && !target.closest('.filter-panel') && !target.closest('.filter-toggle')) {
        setIsFilterPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMobileMenuOpen, isFilterPanelOpen, onMenuToggle]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsFilterPanelOpen(false);
        onMenuToggle?.(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onMenuToggle]);

  return (
    <header className="responsive-nav-header">
      <div className="nav-container">
        {/* Logo/Brand */}
        <div className="brand">
          <h1>MBR Alarm Tracker</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <a href="#dashboard" className="nav-link active">Dashboard</a>
          <a href="#zones" className="nav-link">Zones</a>
          <a href="#alarms" className="nav-link">Alarms</a>
          <a href="#reports" className="nav-link">Reports</a>
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          <button
            onClick={handleFilterToggle}
            className={`filter-toggle ${isFilterPanelOpen ? 'active' : ''}`}
            aria-label="Toggle filters"
          >
            <span className="filter-icon">🔍</span>
            Filters
            {isProcessing && <span className="processing-dot"></span>}
          </button>
          
          <button
            onClick={handleMobileMenuToggle}
            className={`menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            aria-label="Toggle mobile menu"
          >
            <span className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <a href="#dashboard" className="mobile-nav-link active">Dashboard</a>
          <a href="#zones" className="mobile-nav-link">Zones</a>
          <a href="#alarms" className="mobile-nav-link">Alarms</a>
          <a href="#reports" className="mobile-nav-link">Reports</a>
        </nav>
      </div>

      {/* Filter Panel */}
      <div className={`filter-panel ${isFilterPanelOpen ? 'open' : ''}`}>
        <div className="filter-content">
          <div className="filter-header">
            <h3>Filters</h3>
            <button 
              onClick={handleClearFilters}
              className="clear-filters-btn"
            >
              Clear All
            </button>
          </div>

          {/* Month Range Filter */}
          <div className="filter-group">
            <label className="filter-label">Date Range</label>
            <div className="date-range-inputs">
              <input
                type="date"
                value={filters.monthRange.start}
                onChange={(e) => handleMonthRangeChange('start', e.target.value)}
                className="date-input"
                aria-label="Start date"
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                value={filters.monthRange.end}
                onChange={(e) => handleMonthRangeChange('end', e.target.value)}
                className="date-input"
                aria-label="End date"
              />
            </div>
          </div>

          {/* Quick Date Filters */}
          <div className="filter-group">
            <label className="filter-label">Quick Filters</label>
            <div className="quick-filters">
              {quickFilters.map((filter, index) => (
                <button
                  key={index}
                  onClick={filter.action}
                  className="quick-filter-btn"
                  disabled={isProcessing}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zone Filter */}
          <div className="filter-group">
            <label className="filter-label">Zone</label>
            <select
              value={filters.zone}
              onChange={(e) => handleFilterChange('zone', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Zones</option>
              <option value="zone-01">Zone 01</option>
              <option value="zone-02">Zone 02</option>
              <option value="zone-03">Zone 03</option>
              <option value="zone-04">Zone 04</option>
            </select>
          </div>

          {/* Alarm Type Filter */}
          <div className="filter-group">
            <label className="filter-label">Alarm Type</label>
            <select
              value={filters.alarmType}
              onChange={(e) => handleFilterChange('alarmType', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="fire">Fire</option>
              <option value="smoke">Smoke</option>
              <option value="co">Carbon Monoxide</option>
              <option value="heat">Heat</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="filter-group">
            <label className="filter-label">Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {isProcessing && (
            <div className="filter-processing">
              <span>Applying filters...</span>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {(isMobileMenuOpen || isFilterPanelOpen) && (
        <div 
          className="overlay"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsFilterPanelOpen(false);
            onMenuToggle?.(false);
          }}
        />
      )}

      <style >{`
        .responsive-nav-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: white;
          border-bottom: 1px solid #e0e0e0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .brand h1 {
          margin: 0;
          font-size: 1.5rem;
          color: #333;
          font-weight: 600;
        }

        .desktop-nav {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          text-decoration: none;
          color: #666;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #007bff;
          background: #f0f8ff;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          position: relative;
        }

        .filter-toggle:hover,
        .filter-toggle.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .filter-icon {
          font-size: 1rem;
        }

        .processing-dot {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 8px;
          height: 8px;
          background: #28a745;
          border-radius: 50%;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          width: 24px;
          height: 18px;
          justify-content: space-between;
        }

        .hamburger span {
          display: block;
          height: 2px;
          width: 100%;
          background: #333;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .menu-toggle.active .hamburger span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .menu-toggle.active .hamburger span:nth-child(2) {
          opacity: 0;
        }

        .menu-toggle.active .hamburger span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        .mobile-menu {
          display: none;
          background: white;
          border-top: 1px solid #e0e0e0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .mobile-menu.open {
          display: block;
        }

        .mobile-nav {
          padding: 1rem 2rem;
        }

        .mobile-nav-link {
          display: block;
          padding: 1rem 0;
          text-decoration: none;
          color: #666;
          font-weight: 500;
          border-bottom: 1px solid #f0f0f0;
          transition: color 0.2s ease;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          color: #007bff;
        }

        .mobile-nav-link:last-child {
          border-bottom: none;
        }

        .filter-panel {
          position: absolute;
          top: 100%;
          right: 2rem;
          width: 320px;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-10px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          z-index: 1001;
        }

        .filter-panel.open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .filter-content {
          padding: 1.5rem;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .filter-header h3 {
          margin: 0;
          color: #333;
          font-size: 1.1rem;
        }

        .clear-filters-btn {
          background: none;
          border: 1px solid #ddd;
          color: #666;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s ease;
        }

        .clear-filters-btn:hover {
          background: #f8f9fa;
          border-color: #007bff;
          color: #007bff;
        }

        .filter-group {
          margin-bottom: 1.5rem;
        }

        .filter-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
          font-size: 0.9rem;
        }

        .date-range-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .date-input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .date-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .date-separator {
          color: #666;
          font-size: 0.9rem;
        }

        .quick-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .quick-filter-btn {
          padding: 0.4rem 0.8rem;
          background: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s ease;
        }

        .quick-filter-btn:hover:not(:disabled) {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .quick-filter-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .filter-select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
          background: white;
        }

        .filter-select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .filter-processing {
          text-align: center;
          color: #007bff;
          font-size: 0.8rem;
          padding: 0.5rem;
          background: #f0f8ff;
          border-radius: 4px;
          margin-top: 1rem;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        /* Responsive breakpoints */
        @media (max-width: 1024px) {
          .nav-container {
            padding: 1rem;
          }

          .filter-panel {
            right: 1rem;
            width: 300px;
          }
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }

          .menu-toggle {
            display: flex;
          }

          .brand h1 {
            font-size: 1.2rem;
          }

          .filter-panel {
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            width: auto;
            border-radius: 12px 12px 0 0;
            transform: translateY(100%);
          }

          .filter-panel.open {
            transform: translateY(0);
          }

          .filter-content {
            max-height: 70vh;
            overflow-y: auto;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            padding: 0.75rem;
          }

          .brand h1 {
            font-size: 1.1rem;
          }

          .filter-toggle {
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
          }

          .date-range-inputs {
            flex-direction: column;
            align-items: stretch;
          }

          .date-separator {
            text-align: center;
            padding: 0.25rem;
          }
        }
      `}</style>
    </header>
  );
};

export default ResponsiveNavigationHeader;