import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import WaterAnalysisModule from './components/modules/WaterAnalysisModule';
import WaterConsumptionModule from './components/modules/WaterConsumptionModule';
import ElectricityModule from './components/modules/ElectricityModule';
import HvacSystemModule from './components/modules/HvacSystemModule';
import ContractorTrackerModule from './components/modules/ContractorTrackerModule';
import StpPlantModule from './components/modules/StpPlantModule';
import FirefightingAlarmModule from './components/modules/FirefightingAlarmModule';
import useAOS from './hooks/useAOS';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  // Initialize AOS animations
  useAOS();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/water" replace />} />
            <Route path="/water" element={<WaterAnalysisModule />} />
            <Route path="/water-consumption" element={<WaterConsumptionModule />} />
            <Route path="/electricity" element={<ElectricityModule />} />
            <Route path="/hvac" element={<HvacSystemModule />} />
            <Route path="/firefighting" element={<FirefightingAlarmModule />} />
            <Route path="/contractor" element={<ContractorTrackerModule />} />
            <Route path="/stp" element={<StpPlantModule />} />
            <Route path="*" element={<Navigate to="/water" replace />} />
          </Routes>
        </Layout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#00D2B3',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}