import { createFileRoute } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { PlaceholderPage } from '@/components/layout/PlaceholderPage'

export const Route = createFileRoute('/_app/patients/$patientId')({
  component: PatientDetailPage,
})

function PatientDetailPage() {
  const { patientId } = Route.useParams()
  return (
    <PlaceholderPage
      title={`Patient ${patientId}`}
      description="Patient identity banner, demographics, encounter history, and MPI merge-case context — built in Phase 3."
      icon={Users}
    />
  )
}
