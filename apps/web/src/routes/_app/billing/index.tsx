import { createFileRoute } from '@tanstack/react-router'
import { Receipt } from 'lucide-react'
import { PlaceholderPage } from '@/components/layout/PlaceholderPage'

export const Route = createFileRoute('/_app/billing/')({
  component: () => (
    <PlaceholderPage
      title="Billing & payments"
      description="Invoices and idempotent payment submission — built in Phase 4, against the Finance service."
      icon={Receipt}
    />
  ),
})
