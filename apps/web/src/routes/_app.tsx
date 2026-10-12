import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useAuthHydrated, useAuthStore } from '@/stores/auth-store'

/**
 * Pathless layout wrapping every staff-facing page in the sidebar/topbar
 * shell, gated on having a session.
 *
 * Two layers, both client-only by necessity: the backend returns both
 * tokens as plain JSON (no cookies — confirmed against the deployed API),
 * so they only ever live in the browser's localStorage, and the server has
 * no way to know whether a visitor is authenticated during SSR.
 *
 * - `beforeLoad` handles client-side route transitions (e.g. a stale Link
 *   clicked after logout) — it's a no-op during SSR.
 * - The component-level effect below is the real backstop: on a hard
 *   refresh or direct URL visit, the router hydrates from the server's
 *   already-resolved match and does NOT re-run `beforeLoad`, so that guard
 *   alone would never fire for the single most important case. The effect
 *   runs on every mount regardless of how the route was reached.
 *
 * Both layers also have to wait for `useAuthStore`'s localStorage
 * rehydration to actually finish before concluding "no token" — confirmed
 * empirically that it does NOT reliably complete before a consumer's first
 * render/effect on a full page navigation in the production build, which
 * was bouncing already-logged-in users back to /login. See
 * `useAuthHydrated`'s doc comment.
 *
 * Either way, the backend remains the real authorization boundary — every
 * API call still requires (and the server still verifies) a valid bearer
 * token; these are UX conveniences, not the security boundary.
 */
export const Route = createFileRoute('/_app')({
  beforeLoad: ({ location }) => {
    if (typeof window === 'undefined') {
      return
    }
    if (!useAuthStore.persist.hasHydrated()) {
      // Can't yet tell whether there's a token — don't redirect on a
      // false negative. The component-level effect below re-checks once
      // hydration completes.
      return
    }
    const { accessToken } = useAuthStore.getState()
    if (!accessToken) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const hasHydrated = useAuthHydrated()
  const navigate = useNavigate()

  useEffect(() => {
    if (hasHydrated && !accessToken) {
      navigate({ to: '/login', search: { redirect: window.location.href } })
    }
  }, [hasHydrated, accessToken, navigate])

  if (!hasHydrated || !accessToken) {
    return null
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
