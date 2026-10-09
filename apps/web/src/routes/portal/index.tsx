import { createFileRoute } from '@tanstack/react-router'
import { HeartPulse } from 'lucide-react'

export const Route = createFileRoute('/portal/')({
  component: PatientPortalPage,
})

/**
 * The patient-facing portal is deliberately NOT nested under `_app` (the
 * staff shell with its sidebar of clinical/admin modules) — different
 * audience, different navigation, likely different branding. Its own
 * layout/auth gets built out alongside it, not inherited from the staff
 * shell by default.
 */
function PatientPortalPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-10 text-center">
      <HeartPulse className="size-8 text-primary" aria-hidden="true" />
      <h1 className="text-lg font-semibold">Patient portal</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Patient-facing appointment requests, results, and messaging — not yet implemented.
      </p>
    </div>
  )
}
