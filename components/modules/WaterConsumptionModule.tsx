import React, { useState } from 'react';
import { RefreshCw, ExternalLink, Maximize2, Minimize2, BarChart3 } from 'lucide-react';
import Button from '../ui/Button';
import { useIsMobile } from '../../hooks/useIsMobile';

const WaterConsumptionModule: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleRefresh = () => {
    setIsLoading(true);
    const iframe = document.getElementById('aitable-iframe') as any;
    if (iframe && iframe.src) {
      const currentSrc = iframe.src;
      iframe.src = '';
      iframe.src = currentSrc;
    }
    setTimeout(() => setIsLoading(false), 1000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const openInNewTab = () => {
    window.open('https://aitable.ai/share/shrBpWJePwtolWv0FNfGv', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <BarChart3 className="h-8 w-8" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Water Consumption - All Data</h1>
            <p className="text-blue-100 text-sm md:text-base">
              Comprehensive water consumption data from AITable
            </p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Water Consumption Data Viewer
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View and analyze comprehensive water consumption data across all meters
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="secondary"
              size="sm"
              disabled={isLoading}
              className="min-w-[100px]"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={toggleFullscreen}
              variant="secondary"
              size="sm"
              className="hidden sm:flex"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Fullscreen
                </>
              )}
            </Button>
            <Button
              onClick={openInNewTab}
              variant="primary"
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in AITable
            </Button>
          </div>
        </div>
      </div>

      {/* AITable Embed */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none' : ''
      }`}>
        {isFullscreen && (
          <div className="bg-gray-900 p-4 flex justify-between items-center">
            <h3 className="text-white font-semibold">Water Consumption Data - Fullscreen View</h3>
            <Button
              onClick={toggleFullscreen}
              variant="secondary"
              size="sm"
            >
              <Minimize2 className="h-4 w-4 mr-2" />
              Exit Fullscreen
            </Button>
          </div>
        )}
        
        <div className={`relative ${isFullscreen ? 'h-[calc(100vh-64px)]' : 'h-[800px]'} ${isMobile ? 'min-h-[600px]' : ''}`}>
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading data...</p>
              </div>
            </div>
          )}
          
          <iframe
            id="aitable-iframe"
            src="https://aitable.ai/share/shrBpWJePwtolWv0FNfGv"
            className="w-full h-full border-0"
            title="Water Consumption Data from AITable"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>

      {/* Information Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">
              About This Data
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>
                This embedded view displays comprehensive water consumption data for all meters in the Muscat Bay system. 
                The data is hosted on AITable and provides real-time access to consumption metrics, trends, and analysis.
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Interactive data exploration and filtering</li>
                <li>Historical consumption patterns</li>
                <li>Multi-level meter hierarchy (L1 → L2 → L3 → L4)</li>
                <li>Export capabilities for further analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterConsumptionModule;