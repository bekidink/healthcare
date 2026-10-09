import { createFileRoute } from '@tanstack/react-router'
import { Stethoscope } from 'lucide-react'
import { PlaceholderPage } from '@/components/layout/PlaceholderPage'

export const Route = createFileRoute('/_app/clinical/')({
  component: () => (
    <PlaceholderPage
      title="Clinical encounters"
      description="Encounter documentation, SOAP notes (draft vs. signed — never silently overwritten once signed), vitals, and diagnoses — built in Phase 3, against the Clinical service."
      icon={Stethoscope}
    />
  ),
})
