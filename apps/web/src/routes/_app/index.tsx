import { createFileRoute } from '@tanstack/react-router'
import { CalendarClock, ListOrdered, Receipt, Users } from 'lucide-react'

export const Route = createFileRoute('/_app/')({
  component: DashboardPage,
})

/**
 * Summary cards here are static placeholders, not wired to zero-value data
 * from a real query — "0" would look like real data and mislead. Phase 2+
 * replaces these with real useQuery-backed counts once the gateway
 * integration exists.
 */
const SUMMARY_CARDS = [
  { label: 'Patients', icon: Users },
  { label: "Today's appointments", icon: CalendarClock },
  { label: 'Active queue', icon: ListOrdered },
  { label: 'Open invoices', icon: Receipt },
] as const

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Facility-wide overview. Real metrics arrive once identity and facility-context integration (Phase 2) and
          the first clinical workflow (Phase 3) are wired in.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SUMMARY_CARDS.map(({ label, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </div>
            <p className="mt-2 text-2xl font-semibold text-muted-foreground">—</p>
          </div>
        ))}
      </div>
    </div>
  )
}
