import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import WaterAnalysisModule from './components/modules/WaterAnalysisModule';
import ElectricityModule from './components/modules/ElectricityModule';
import ContractorTrackerModule from './components/modules/ContractorTrackerModule';
import StpPlantModule from './components/modules/StpPlantModule';
import HvacSystemModule from './components/modules/HvacSystemModule';
import FirefightingAlarmModule from './components/modules/FirefightingAlarmModule';
import { useAOS } from './hooks/useAOS';

const App: React.FC = () => {
    const [activeSection, setActiveSection] = useState('Water System');

    // Initialize AOS with custom options
    useAOS({
        offset: 100,
        delay: 100,
        duration: 800,
        easing: 'ease-in-out-cubic',
        once: true,
        mirror: false,
    });

    // Additional effect to ensure AOS is properly initialized
    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            if (typeof window !== 'undefined' && window.AOS) {
                window.AOS.refresh();
            }
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const renderContent = () => {
        switch (activeSection) {
            case 'Water System':
                return <WaterAnalysisModule />;
            case 'Electricity System':
                return <ElectricityModule />;
            case 'HVAC System':
                return <HvacSystemModule />;
            case 'Contractor Tracker':
                return <ContractorTrackerModule />;
            case 'STP Plant':
                return <StpPlantModule />;
            case 'Firefighting & Alarm':
                return <FirefightingAlarmModule />;
            default:
                return <WaterAnalysisModule />;
        }
    };

    return (
        <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
            {renderContent()}
        </Layout>
    );
};

export default App;