import { createFileRoute } from '@tanstack/react-router'
import { ListOrdered } from 'lucide-react'
import { PlaceholderPage } from '@/components/layout/PlaceholderPage'

export const Route = createFileRoute('/_app/queue/')({
  component: () => (
    <PlaceholderPage
      title="Queue & Triage"
      description="Reception check-in, the day-of active queue, and triage/vitals capture — built in Phase 3, against the Scheduling and Clinical services."
      icon={ListOrdered}
    />
  ),
})
