import React, { useState } from 'react';
import { format, subMonths } from 'date-fns';

// Import all necessary components
import DateRangeSelector from '../ui/DateRangeSelector';
import WaterDistributionCard from '../cards/WaterDistributionCard';
import WaterLossCard from '../cards/WaterLossCard';
import WaterQualityCard from '../cards/WaterQualityCard';
import PumpStationCard from '../cards/PumpStationCard';
import CorrelationAnalysisCard from '../cards/CorrelationAnalysisCard';
import TankLevelCard from '../cards/TankLevelCard';
import AnomalyDetectionCard from '../cards/AnomalyDetectionCard';
import FlowRateAnalysisCard from '../cards/FlowRateAnalysisCard';
import CostAnalysisCard from '../cards/CostAnalysisCard';
import MaintenanceScheduleCard from '../cards/MaintenanceScheduleCard';
import YearlyComparisonCard from '../cards/YearlyComparisonCard';
import AlertsAndNotificationsCard from '../cards/AlertsAndNotificationsCard';
import PredictiveMaintenanceCard from '../cards/PredictiveMaintenanceCard';
import WaterSourceCard from '../cards/WaterSourceCard';
import BillingAnalysisCard from '../cards/BillingAnalysisCard';
import NetworkTopologyCard from '../cards/NetworkTopologyCard';
import WaterBalanceCard from '../cards/WaterBalanceCard';
import ComplianceReportCard from '../cards/ComplianceReportCard';
import ConsumptionForecastCard from '../cards/ConsumptionForecastCard';
import EmergencyResponseCard from '../cards/EmergencyResponseCard';

/**
 * Water System Component - Updated version without navigation bar
 * The navigation tabs (Overview, Water Loss Analysis, Zone Analysis, 
 * Consumption by Type, Main Database) have been removed to reduce confusion
 */
function WaterSystem() {
  const [startDate, setStartDate] = useState(subMonths(new Date(), 6));
  const [endDate, setEndDate] = useState(new Date());
  const [showAI, setShowAI] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleResetRange = () => {
    setStartDate(subMonths(new Date(), 6));
    setEndDate(new Date());
  };

  const handleRunAI = () => {
    setShowAI(true);
    setRefreshKey(prev => prev + 1);
  };

  const dateRange = {
    from: format(startDate, 'MMM-dd'),
    to: format(endDate, 'MMM-dd')
  };

  return (
    <div className="water-system">
      {/* Page title */}
      <h1 className="text-4xl font-bold text-white mb-6">Water System Analysis</h1>
      
      {/* Date range selector section */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg mb-6">
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onResetRange={handleResetRange}
          onRunAI={handleRunAI}
        />
      </div>

      {/* 4-Level Water Distribution Totals section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          4-Level Water Distribution Totals for {format(startDate, 'MMM-dd')} to {format(endDate, 'MMM-dd')}
        </h2>
        <WaterDistributionCard dateRange={dateRange} refreshKey={refreshKey} />
      </div>

      {/* Multi-Stage Water Loss Totals section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Multi-Stage Water Loss Totals for {format(startDate, 'MMM-dd')} to {format(endDate, 'MMM-dd')}
        </h2>
        <WaterLossCard dateRange={dateRange} refreshKey={refreshKey} />
      </div>

      {/* All other analysis cards in grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <WaterQualityCard dateRange={dateRange} refreshKey={refreshKey} />
        <PumpStationCard dateRange={dateRange} refreshKey={refreshKey} />
        <CorrelationAnalysisCard dateRange={dateRange} refreshKey={refreshKey} />
        <TankLevelCard dateRange={dateRange} refreshKey={refreshKey} />
        <AnomalyDetectionCard dateRange={dateRange} refreshKey={refreshKey} />
        <FlowRateAnalysisCard dateRange={dateRange} refreshKey={refreshKey} />
        <CostAnalysisCard dateRange={dateRange} refreshKey={refreshKey} />
        <MaintenanceScheduleCard dateRange={dateRange} refreshKey={refreshKey} />
        <YearlyComparisonCard dateRange={dateRange} refreshKey={refreshKey} />
        <AlertsAndNotificationsCard dateRange={dateRange} refreshKey={refreshKey} />
        <PredictiveMaintenanceCard dateRange={dateRange} showAI={showAI} />
        <WaterSourceCard dateRange={dateRange} refreshKey={refreshKey} />
        <BillingAnalysisCard dateRange={dateRange} refreshKey={refreshKey} />
        <NetworkTopologyCard dateRange={dateRange} refreshKey={refreshKey} />
        <WaterBalanceCard dateRange={dateRange} refreshKey={refreshKey} />
        <ComplianceReportCard dateRange={dateRange} refreshKey={refreshKey} />
        <ConsumptionForecastCard dateRange={dateRange} refreshKey={refreshKey} />
        <EmergencyResponseCard dateRange={dateRange} refreshKey={refreshKey} />
      </div>
    </div>
  );
}

export default WaterSystem;