import { createFileRoute } from '@tanstack/react-router'
import { CalendarClock } from 'lucide-react'
import { PlaceholderPage } from '@/components/layout/PlaceholderPage'

export const Route = createFileRoute('/_app/appointments/')({
  component: () => (
    <PlaceholderPage
      title="Appointments"
      description="Slot booking and the appointment state machine (requested → confirmed → checked_in → in_service → completed) — built in Phase 3, against the Scheduling service."
      icon={CalendarClock}
    />
  ),
})
