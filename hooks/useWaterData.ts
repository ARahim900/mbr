import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getProcessedWaterData } from '../services/waterDataService';
import { ProcessedData } from '../types';

// Query keys
export const waterQueryKeys = {
  all: ['water'] as const,
  data: () => [...waterQueryKeys.all, 'data'] as const,
  stats: () => [...waterQueryKeys.all, 'stats'] as const,
  zones: (zones: string[]) => [...waterQueryKeys.all, 'zones', zones] as const,
  dateRange: (start: Date, end: Date) => [...waterQueryKeys.all, 'dateRange', start, end] as const,
};

// Fetch water data
export const useWaterData = () => {
  return useQuery({
    queryKey: waterQueryKeys.data(),
    queryFn: async (): Promise<ProcessedData> => {
      try {
        const data = await getProcessedWaterData();
        return data;
      } catch (error) {
        toast.error('Failed to load water data');
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Fetch filtered water data
export const useFilteredWaterData = (zones: string[]) => {
  return useQuery({
    queryKey: waterQueryKeys.zones(zones),
    queryFn: async (): Promise<ProcessedData> => {
      try {
        const data = await getProcessedWaterData();
        
        // Apply zone filtering
        if (zones.length > 0) {
          const filteredTree = data.tree.filter(meter => 
            zones.some(zone => meter.zone.includes(zone))
          );
          
          return {
            ...data,
            tree: filteredTree,
            stats: {
              ...data.stats,
              totalConsumption: filteredTree.reduce((sum, meter) => sum + meter.totalConsumption, 0),
              meterCount: filteredTree.length,
            }
          };
        }
        
        return data;
      } catch (error) {
        toast.error('Failed to filter water data');
        throw error;
      }
    },
    enabled: zones.length > 0,
    staleTime: 1000 * 60 * 3, // 3 minutes for filtered data
  });
};

// Refresh water data mutation
export const useRefreshWaterData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getProcessedWaterData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waterQueryKeys.all });
      toast.success('Water data refreshed successfully');
    },
    onError: () => {
      toast.error('Failed to refresh water data');
    },
  });
};