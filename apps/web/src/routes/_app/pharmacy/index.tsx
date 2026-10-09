import { createFileRoute } from '@tanstack/react-router'
import { Pill } from 'lucide-react'
import { PlaceholderPage } from '@/components/layout/PlaceholderPage'

export const Route = createFileRoute('/_app/pharmacy/')({
  component: () => (
    <PlaceholderPage
      title="Pharmacy"
      description="Prescriptions, dispensing, and ledger-enforced inventory (every stock change creates a movement record) — built in Phase 4, against the Pharmacy service."
      icon={Pill}
    />
  ),
})
