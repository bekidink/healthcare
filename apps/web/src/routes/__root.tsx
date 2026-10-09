import { HeadContent, Scripts, createRootRouteWithContext, useRouteContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary'
import { RouteNotFound } from '@/components/layout/RouteNotFound'
import { RoutePending } from '@/components/layout/RoutePending'

import appCss from '../styles.css?url'

// Applies the persisted/system theme before first paint, avoiding a
// flash of the wrong theme on load — same mechanism ThemeToggle writes to.
const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export interface RouterAppContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Healthcare Platform' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
  // Route-level error/not-found/pending handling, per every route by
  // default — a route can still override these with its own.
  errorComponent: RouteErrorBoundary,
  notFoundComponent: RouteNotFound,
  pendingComponent: RoutePending,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  // Pulled from router context, never a module-level import — this is the
  // per-request QueryClient `router.tsx`'s getRouter() creates fresh each
  // time. See lib/query-client.ts for why that matters.
  const { queryClient } = useRouteContext({ from: Route.id })

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </QueryClientProvider>
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> }]}
        />
        <Scripts />
      </body>
    </html>
  )
}
