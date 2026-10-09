import { createFileRoute } from '@tanstack/react-router'
import { FlaskConical } from 'lucide-react'
import { PlaceholderPage } from '@/components/layout/PlaceholderPage'

export const Route = createFileRoute('/_app/lab/')({
  component: () => (
    <PlaceholderPage
      title="Laboratory"
      description="Lab order entry, specimen tracking, and results (corrected via an append-only chain, never overwritten) — built in Phase 4, against the Lab service."
      icon={FlaskConical}
    />
  ),
})
