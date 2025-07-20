import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import WaterAnalysisModule from './components/modules/WaterAnalysisModule';
import ElectricityModule from './components/modules/ElectricityModule';
import HvacSystemModule from './components/modules/HvacSystemModule';
import ContractorTrackerModule from './components/modules/ContractorTrackerModule';
import StpPlantModule from './components/modules/StpPlantModule';
import Layout from './components/Layout';
import FirefightingAlarmModule from './components/modules/FirefightingAlarmModule';
import useAOS from './hooks/useAOS';

export default function App() {
  const [activeSection, setActiveSection] = useState('Water System');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Initialize AOS animations
  useAOS();

  const renderModule = () => {
    switch (activeSection) {
      case 'Water System':
        return <WaterAnalysisModule />;
      case 'Electricity System':
        return <ElectricityModule />;
      case 'HVAC System':
        return <HvacSystemModule />;
      case 'Firefighting & Alarm':
        return <FirefightingAlarmModule />;
      case 'Contractor Tracker':
        return <ContractorTrackerModule />;
      case 'STP Plant':
        return <StpPlantModule />;
      default:
        return <WaterAnalysisModule />;
    }
  };

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderModule()}
    </Layout>
  );
}