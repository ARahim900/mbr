import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
  // UI State
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  isLoading: boolean;
  
  // User Preferences
  dateRange: {
    start: Date;
    end: Date;
  };
  selectedZones: string[];
  chartType: 'bar' | 'line' | 'area';
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setDarkMode: (dark: boolean) => void;
  setLoading: (loading: boolean) => void;
  setDateRange: (range: { start: Date; end: Date }) => void;
  setSelectedZones: (zones: string[]) => void;
  setChartType: (type: 'bar' | 'line' | 'area') => void;
  
  // Reset functions
  resetFilters: () => void;
}

const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        isSidebarOpen: false,
        isDarkMode: false,
        isLoading: false,
        dateRange: {
          start: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1),
          end: new Date(),
        },
        selectedZones: [],
        chartType: 'bar',
        
        // Actions
        setSidebarOpen: (open) => set({ isSidebarOpen: open }),
        setDarkMode: (dark) => set({ isDarkMode: dark }),
        setLoading: (loading) => set({ isLoading: loading }),
        setDateRange: (range) => set({ dateRange: range }),
        setSelectedZones: (zones) => set({ selectedZones: zones }),
        setChartType: (type) => set({ chartType: type }),
        
        // Reset functions
        resetFilters: () => set({
          selectedZones: [],
          chartType: 'bar',
          dateRange: {
            start: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1),
            end: new Date(),
          },
        }),
      }),
      {
        name: 'mbr-app-storage',
        partialize: (state) => ({
          isDarkMode: state.isDarkMode,
          dateRange: state.dateRange,
          chartType: state.chartType,
        }),
      }
    ),
    {
      name: 'mbr-app-store',
    }
  )
);

export default useAppStore;