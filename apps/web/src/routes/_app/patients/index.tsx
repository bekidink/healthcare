import { createFileRoute } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { PlaceholderPage } from '@/components/layout/PlaceholderPage'

export const Route = createFileRoute('/_app/patients/')({
  component: () => (
    <PlaceholderPage
      title="Patients"
      description="Patient registration and Master Patient Index search — built in Phase 3, against the Patient service's /patients and /patients/search endpoints."
      icon={Users}
    />
  ),
})
