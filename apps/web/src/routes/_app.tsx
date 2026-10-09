import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/AppShell'

/**
 * Pathless layout wrapping every staff-facing page in the sidebar/topbar
 * shell. Route-level auth enforcement (redirecting to /login when
 * unauthenticated) is a Phase 2 concern, added here via `beforeLoad` once
 * real identity integration exists — this layout is structural for now.
 */
export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
