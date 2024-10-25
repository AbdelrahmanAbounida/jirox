"use client";
import {
  QueryClient,
  QueryClientProvider as QueryClientProviderBase,
} from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined = undefined;

export const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3600,
        refetchOnMount: true,
      },
    },
  });
};

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const QueryClientProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProviderBase client={queryClient}>
      {children}
    </QueryClientProviderBase>
  );
};
