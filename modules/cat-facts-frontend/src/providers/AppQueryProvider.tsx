import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
      refetchOnWindowFocus: false,
      refetchOnMount: 'always',
      retry: false,
    },
  },
});

export const AppQueryProvider = ({
  children,
}: {
  children: React.ReactElement[] | React.ReactElement;
}) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
