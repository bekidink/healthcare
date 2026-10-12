import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertTriangle, CalendarPlus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePatientQuery } from '@/hooks/usePatients'

export const Route = createFileRoute('/_app/patients/$patientId')({
  component: PatientDetailPage,
})

function PatientDetailPage() {
  const { patientId } = Route.useParams()
  const { data: patient, isLoading, isError, error } = usePatientQuery(patientId)

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        Loading patient…
      </div>
    )
  }

  if (isError || !patient) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        {error instanceof Error ? error.message : 'Failed to load this patient.'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-sm text-muted-foreground">
            DOB {patient.dateOfBirth}
            {patient.gender ? ` · ${patient.gender}` : ''}
            {' · '}
            <Badge variant={patient.status === 'active' ? 'secondary' : 'outline'}>{patient.status}</Badge>
          </p>
        </div>
        <Button
          render={
            <Link to="/appointments" search={{ patientId: patient.id }} className="gap-2">
              <CalendarPlus className="size-4" aria-hidden="true" />
              Book appointment
            </Link>
          }
        />
      </div>

      {patient.mergedIntoPatientId ? (
        <div className="flex items-start gap-2 rounded-lg border border-status-warning bg-status-warning/40 p-3 text-sm text-status-warning-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          This record was merged into{' '}
          <Link
            to="/patients/$patientId"
            params={{ patientId: patient.mergedIntoPatientId }}
            className="font-medium underline-offset-2 hover:underline"
          >
            another patient
          </Link>
          .
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Identifiers</CardTitle>
          </CardHeader>
          <CardContent>
            {patient.identifiers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No identifiers on file.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {patient.identifiers.map((identifier) => (
                  <li key={identifier.id} className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">{formatIdentifierType(identifier.type)}</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      {identifier.value}
                      {identifier.isPrimary ? (
                        <Badge variant="outline" className="h-4 px-1 text-[10px]">
                          primary
                        </Badge>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            {patient.contacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No contacts on file.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {patient.contacts.map((contact) => (
                  <li key={contact.id} className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">{contact.label ?? contact.type}</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      {contact.value}
                      {contact.isPrimary ? (
                        <Badge variant="outline" className="h-4 px-1 text-[10px]">
                          primary
                        </Badge>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function formatIdentifierType(type: string): string {
  return type
    .split('_')
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ')
}
