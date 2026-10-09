import { QueryClient } from '@tanstack/react-query'

/**
 * A factory, not a module-level singleton — `router.tsx`'s `getRouter()` is
 * invoked fresh per request on the server (and once on the client), and
 * calling this from inside that function is what keeps one visitor's
 * cached query data from leaking into another's SSR render. Never import a
 * shared `queryClient` instance directly; always go through router context
 * (`Route.useRouteContext().queryClient` client-side, `context.queryClient`
 * in loaders).
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Healthcare operational data (queues, slots, inventory) goes stale
        // fast; individual features can override this per query as needed.
        staleTime: 30_000,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}
