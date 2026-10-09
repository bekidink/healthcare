import { createFileRoute } from '@tanstack/react-router'
import { Shield } from 'lucide-react'
import { PlaceholderPage } from '@/components/layout/PlaceholderPage'

export const Route = createFileRoute('/_app/insurance/')({
  component: () => (
    <PlaceholderPage
      title="Insurance & claims"
      description="Insurance policies and claim submission/adjudication tracking — built in Phase 4, against the Supply service."
      icon={Shield}
    />
  ),
})
