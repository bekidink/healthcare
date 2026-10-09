import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { createQueryClient } from '@/lib/query-client'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  // Created here, not at module scope — this function runs fresh per
  // request on the server (and once on the client), so each request gets
  // its own QueryClient. See createQueryClient's own doc comment for why
  // that matters for a healthcare app specifically.
  const queryClient = createQueryClient()

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
