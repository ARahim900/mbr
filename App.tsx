import React, { useState } from 'react';
import Layout from './components/Layout';
import WaterAnalysisModule from './components/modules/WaterAnalysisModule';
import ElectricityModule from './components/modules/ElectricityModule';
import ContractorTrackerModule from './components/modules/ContractorTrackerModule';
import StpPlantModule from './components/modules/StpPlantModule';
import HvacSystemModule from './components/modules/HvacSystemModule';
import FirefightingAlarmModule from './components/modules/FirefightingAlarmModule';

const App: React.FC = () => {
    const [activeSection, setActiveSection] = useState('Water System');

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