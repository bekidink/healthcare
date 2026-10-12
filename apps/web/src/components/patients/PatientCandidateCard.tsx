import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { usePatientQuery } from '@/hooks/usePatients'
import type { PatientMatchCandidate } from '@/lib/api/patients'

/**
 * `/patients/search` returns only `{patientId, score, reasons}` — it's MPI
 * candidate matching, not a directory with names attached. Each candidate's
 * display details are fetched separately via `GET /patients/:id`.
 */
export function PatientCandidateCard({ candidate }: { candidate: PatientMatchCandidate }) {
  const { data: patient, isLoading, isError } = usePatientQuery(candidate.patientId)

  return (
    <Link
      to="/patients/$patientId"
      params={{ patientId: candidate.patientId }}
      className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-3 text-sm transition-colors hover:bg-muted"
    >
      <div className="min-w-0">
        {isLoading ? (
          <span className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            Loading…
          </span>
        ) : isError || !patient ? (
          <span className="text-destructive">Patient {candidate.patientId} (failed to load)</span>
        ) : (
          <>
            <p className="truncate font-medium">
              {patient.firstName} {patient.lastName}
            </p>
            <p className="text-xs text-muted-foreground">DOB {patient.dateOfBirth}</p>
          </>
        )}
        {candidate.reasons.length > 0 ? (
          <p className="mt-1 text-xs text-muted-foreground">Matched on: {candidate.reasons.join(', ')}</p>
        ) : null}
      </div>
      <Badge variant={candidate.score >= 80 ? 'destructive' : 'secondary'} className="shrink-0">
        {candidate.score}% match
      </Badge>
    </Link>
  )
}
