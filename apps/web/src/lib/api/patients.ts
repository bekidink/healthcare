import { apiFetch, type QueryValue } from './client'

export interface PatientIdentifier {
  id: string
  patientId: string
  type: 'facility_mrn' | 'national_id' | 'insurance_id' | 'phone' | 'passport'
  value: string
  issuingContext: string | null
  isPrimary: boolean
  createdAt: string
}

export interface PatientContact {
  id: string
  patientId: string
  type: 'phone' | 'email' | 'address'
  value: string
  label: string | null
  isPrimary: boolean
  createdAt: string
}

export interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string | null
  status: 'active' | 'merged' | 'inactive'
  mergedIntoPatientId: string | null
  createdAt: string
  updatedAt: string
  identifiers: PatientIdentifier[]
  contacts: PatientContact[]
}

export interface PatientMatchCandidate {
  patientId: string
  score: number
  reasons: string[]
}

export interface SearchPatientsParams {
  firstName: string
  lastName: string
  dateOfBirth: string
  nationalId?: string
  phone?: string
}

/**
 * This is MPI candidate matching (duplicate detection), not a general patient
 * directory — the backend has no "list all patients" endpoint. Results are
 * scored candidates, not full patient records; fetch each one via
 * `getPatient` to show name/DOB.
 */
export function searchPatients(params: SearchPatientsParams) {
  return apiFetch<PatientMatchCandidate[]>('/patients/search', {
    query: params as unknown as Record<string, QueryValue>,
  })
}

export function getPatient(id: string) {
  return apiFetch<Patient>(`/patients/${id}`)
}

export interface CreatePatientRequest {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender?: string
  nationalId?: string
  phone?: string
}

export interface CreatePatientResponse extends Patient {
  possibleDuplicates: PatientMatchCandidate[]
  openedMergeCaseIds: string[]
}

export function createPatient(payload: CreatePatientRequest) {
  return apiFetch<CreatePatientResponse>('/patients', { method: 'POST', body: payload })
}
