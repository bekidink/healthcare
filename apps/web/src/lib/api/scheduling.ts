import { apiFetch, type QueryValue } from './client'

export interface ScheduleSlot {
  id: string
  providerId: string
  facilityId: string
  departmentId: string | null
  date: string
  startTime: string
  endTime: string
  status: 'open' | 'booked' | 'blocked'
  createdAt: string
}

export interface ListScheduleSlotsParams {
  facilityId: string
  providerId?: string
  departmentId?: string
  date?: string
  status?: ScheduleSlot['status']
}

/** Defaults to `status: 'open'` server-side when omitted. */
export function listScheduleSlots(params: ListScheduleSlotsParams) {
  return apiFetch<ScheduleSlot[]>('/schedule-slots', {
    query: params as unknown as Record<string, QueryValue>,
  })
}

export interface AppointmentType {
  id: string
  facilityId: string
  name: string
  code: string
  defaultDurationMins: number
  isActive: boolean
  createdAt: string
}

export function listAppointmentTypes(facilityId: string) {
  return apiFetch<AppointmentType[]>('/appointment-types', { query: { facilityId } })
}

export type AppointmentStatus =
  | 'requested'
  | 'confirmed'
  | 'checked_in'
  | 'in_service'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export interface Appointment {
  id: string
  patientId: string
  providerId: string
  facilityId: string
  departmentId: string | null
  appointmentTypeId: string | null
  slotId: string
  status: AppointmentStatus
  reason: string | null
  cancellationReason: string | null
  requestedAt: string
  confirmedAt: string | null
  checkedInAt: string | null
  startedAt: string | null
  completedAt: string | null
  cancelledAt: string | null
}

export interface CreateAppointmentRequest {
  patientId: string
  slotId: string
  appointmentTypeId?: string
  reason?: string
}

/**
 * There is no direct provider/facility/time input here — a `ScheduleSlot`
 * carries all of that, and booking it atomically marks it 'booked'. Callers
 * must list open slots first and let the user pick one.
 */
export function createAppointment(payload: CreateAppointmentRequest) {
  return apiFetch<Appointment>('/appointments', { method: 'POST', body: payload })
}

export function getAppointment(id: string) {
  return apiFetch<Appointment>(`/appointments/${id}`)
}

export function cancelAppointment(id: string, reason?: string) {
  return apiFetch<Appointment>(`/appointments/${id}/cancel`, { method: 'POST', body: { reason } })
}

export function confirmAppointment(id: string) {
  return apiFetch<Appointment>(`/appointments/${id}/confirm`, { method: 'POST' })
}
