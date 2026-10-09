import { createFileRoute } from '@tanstack/react-router'
import { Package } from 'lucide-react'
import { PlaceholderPage } from '@/components/layout/PlaceholderPage'

export const Route = createFileRoute('/_app/inventory/')({
  component: () => (
    <PlaceholderPage
      title="Inventory"
      description="General (non-pharmaceutical) supply stock and its ledger — built in Phase 4, against the Supply service."
      icon={Package}
    />
  ),
})
