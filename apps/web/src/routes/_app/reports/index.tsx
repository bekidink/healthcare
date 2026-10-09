import { createFileRoute } from '@tanstack/react-router'
import { BarChart3 } from 'lucide-react'
import { PlaceholderPage } from '@/components/layout/PlaceholderPage'

export const Route = createFileRoute('/_app/reports/')({
  component: () => (
    <PlaceholderPage
      title="Reports"
      description="Operational analytics (inventory levels, appointment throughput, lab turnaround) — built in Phase 4, against the Analytics service."
      icon={BarChart3}
    />
  ),
})
