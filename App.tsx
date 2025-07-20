import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Dashboard from './components/Dashboard';
import WaterSystem from './components/modules/WaterSystem';
import Electricity from './components/modules/Electricity';
import HVACSystem from './components/modules/HVACSystem';
import ContractorTracker from './components/modules/ContractorTracker';
import STPPlant from './components/modules/STPPlant';
import Layout from './components/Layout';
import useAOS from './hooks/useAOS';

export default function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Initialize AOS animations
  useAOS();

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'water':
        return <WaterSystem />;
      case 'electricity':
        return <Electricity />;
      case 'hvac':
        return <HVACSystem />;
      case 'contractor':
        return <ContractorTracker />;
      case 'stp':
        return <STPPlant />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout sidebarOpen={sidebarOpen}>
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <TopHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-[1600px] mx-auto">
            {renderModule()}
          </div>
        </main>
      </div>
    </Layout>
  );
}