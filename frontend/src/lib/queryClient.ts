import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable automatic refetching on window focus
      retry: 1,                    // Retry failed requests once
      staleTime: 5 * 60 * 1000,    // Data is considered fresh for 5 minutes
    },
  },
});
