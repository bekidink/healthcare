import { apiFetch } from './client'

export interface Facility {
  id: string
  organizationId: string
  name: string
  type: 'hospital' | 'clinic' | 'pharmacy' | 'diagnostic_center'
  status: string
  addressLine: string | null
  city: string | null
  region: string | null
  country: string | null
  phone: string | null
  email: string | null
  createdAt: string
  updatedAt: string
}

/** Returns `[]` server-side if `organizationId` is omitted — there is no "all facilities" listing. */
export function listFacilities(organizationId: string) {
  return apiFetch<Facility[]>('/facilities', { query: { organizationId } })
}

export function getFacility(id: string) {
  return apiFetch<Facility>(`/facilities/${id}`)
}

export interface CreateFacilityRequest {
  name: string
  type: Facility['type']
  addressLine?: string
  city?: string
  region?: string
  phone?: string
  email?: string
}

/** Requires `organization.manage` — in practice, platform super admins only. */
export function createFacility(organizationId: string, payload: CreateFacilityRequest) {
  return apiFetch<Facility>(`/organizations/${organizationId}/facilities`, {
    method: 'POST',
    body: payload,
  })
}
