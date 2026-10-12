import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { AlertTriangle, CalendarClock, CheckCircle2, Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePatientQuery } from '@/hooks/usePatients'
import { useAppointmentTypesQuery, useCreateAppointmentMutation, useScheduleSlotsQuery } from '@/hooks/useScheduling'
import { useFacilityStore } from '@/stores/facility-store'
import { ApiError } from '@/lib/api/client'
import { cn } from '@/lib/utils'

const appointmentsSearchSchema = z.object({
  patientId: z.string().optional(),
})

export const Route = createFileRoute('/_app/appointments/')({
  validateSearch: appointmentsSearchSchema,
  component: AppointmentsPage,
})

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function AppointmentsPage() {
  const { patientId } = Route.useSearch()

  if (!patientId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="size-4" aria-hidden="true" />
            Book an appointment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Appointments are booked for a specific patient. Find or register one first.
          </p>
          <Button
            render={
              <Link to="/patients" className="gap-2">
                <Search className="size-4" aria-hidden="true" />
                Find a patient
              </Link>
            }
          />
        </CardContent>
      </Card>
    )
  }

  return <BookAppointmentFlow patientId={patientId} />
}

function BookAppointmentFlow({ patientId }: { patientId: string }) {
  const facilityId = useFacilityStore((s) => s.facilityId)
  const { data: patient } = usePatientQuery(patientId)
  const [date, setDate] = useState(todayIsoDate)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [appointmentTypeId, setAppointmentTypeId] = useState<string | undefined>(undefined)
  const [reason, setReason] = useState('')

  const slotsQuery = useScheduleSlotsQuery(facilityId ? { facilityId, date, status: 'open' } : null)
  const typesQuery = useAppointmentTypesQuery(facilityId)
  const createMutation = useCreateAppointmentMutation()

  if (!facilityId) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-status-warning bg-status-warning/40 p-4 text-sm text-status-warning-foreground">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Select a facility from the top bar before booking an appointment.
      </div>
    )
  }

  function handleBook() {
    if (!selectedSlotId) {
      return
    }
    createMutation.mutate(
      { patientId, slotId: selectedSlotId, appointmentTypeId, reason: reason || undefined },
      { onSuccess: () => setSelectedSlotId(null) },
    )
  }

  const serverError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : createMutation.error
        ? 'Booking failed. Please try again.'
        : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Book an appointment</h1>
        <p className="text-sm text-muted-foreground">
          For{' '}
          <Link
            to="/patients/$patientId"
            params={{ patientId }}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            {patient ? `${patient.firstName} ${patient.lastName}` : patientId}
          </Link>
        </p>
      </div>

      {createMutation.isSuccess ? (
        <div className="flex items-start gap-2 rounded-lg border border-status-success bg-status-success/40 p-4 text-sm text-status-success-foreground">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div>
            Appointment booked — status <span className="font-medium">{createMutation.data.status}</span>.
            <p className="text-xs opacity-80">Appointment ID: {createMutation.data.id}</p>
          </div>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>1. Choose a date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs space-y-1.5">
            <Label htmlFor="slot-date">Date</Label>
            <Input
              id="slot-date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                setSelectedSlotId(null)
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Pick an open slot</CardTitle>
        </CardHeader>
        <CardContent>
          {slotsQuery.isLoading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Loading open slots…
            </p>
          ) : slotsQuery.isError ? (
            <p className="text-sm text-destructive">Failed to load schedule slots.</p>
          ) : !slotsQuery.data || slotsQuery.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No open slots for this facility on {date}.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {slotsQuery.data.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlotId(slot.id)}
                  aria-pressed={selectedSlotId === slot.id}
                  className={cn(
                    'rounded-lg border p-3 text-left text-sm transition-colors',
                    selectedSlotId === slot.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted',
                  )}
                >
                  <p className="font-medium">
                    {slot.startTime}–{slot.endTime}
                  </p>
                  <p className="text-xs text-muted-foreground">Provider {slot.providerId}</p>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Details &amp; confirm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Appointment type (optional)</Label>
              <Select value={appointmentTypeId} onValueChange={(value) => setAppointmentTypeId(value as string)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={typesQuery.isLoading ? 'Loading…' : 'Select a type'} />
                </SelectTrigger>
                <SelectContent>
                  {typesQuery.data?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
          </div>

          <Button onClick={handleBook} disabled={!selectedSlotId || createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <CalendarClock />}
            Book appointment
          </Button>

          {serverError ? (
            <p role="alert" className="text-sm text-destructive">
              {serverError}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
