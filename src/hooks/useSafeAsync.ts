import { useState, useCallback, useRef, useEffect } from 'react';

// Custom hook for safe async operations in React
export const useSafeAsync = <T>() => {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: false,
    error: null
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    if (!isMountedRef.current) return;

    setState({ data: null, loading: true, error: null });

    try {
      const result = await asyncFn();
      
      if (isMountedRef.current) {
        setState({ data: result, loading: false, error: null });
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState({ data: null, loading: false, error: error as Error });
      }
    }
  }, []);

  return { ...state, execute };
};