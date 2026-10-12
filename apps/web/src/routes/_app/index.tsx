import { createFileRoute, Link } from '@tanstack/react-router'
import { CalendarClock, ListOrdered, Receipt, UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { useFacilityStore } from '@/stores/facility-store'
import { useFacilityQuery } from '@/hooks/useFacilities'

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
  const user = useAuthStore((s) => s.user)
  const facilityId = useFacilityStore((s) => s.facilityId)
  const { data: facility } = useFacilityQuery(facilityId)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {user?.email ? `Signed in as ${user.email}` : 'Facility-wide overview'}
            {facility ? ` · ${facility.name}` : ''}
          </p>
        </div>
        <Button
          render={
            <Link to="/patients" className="gap-2">
              <UserPlus className="size-4" aria-hidden="true" />
              Register or find a patient
            </Link>
          }
        />
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
