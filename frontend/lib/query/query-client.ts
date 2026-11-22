import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';
import { isApiError } from '@/lib/api';

/**
 * Create one QueryClient per browser application instance.
 * On the server, call this factory per request/render to avoid sharing cache
 * between users. Do not export a module-level QueryClient singleton.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: (failureCount, error) => {
          if (isApiError(error)) {
            if (error.kind === 'aborted' || error.kind === 'request_validation' ||
                error.kind === 'response_validation' || error.kind === 'configuration') {
              return false;
            }
            if (error.status !== undefined && error.status >= 400 && error.status < 500) {
              // Retry throttling/timeouts once; validation and auth/client errors are terminal.
              return (error.status === 408 || error.status === 429) && failureCount < 1;
            }
          }
          return failureCount < 2;
        },
        retryDelay: (attemptIndex) =>
          Math.min(1_000 * 2 ** attemptIndex, 30_000),
      },
      mutations: {
        retry: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}
