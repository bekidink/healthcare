import { apiFetch } from './client'

export interface Organization {
  id: string
  legalName: string
  displayName: string
  type: 'healthcare_network' | 'hospital' | 'clinic' | 'pharmacy_chain' | 'diagnostic_center'
  status: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrganizationRequest {
  legalName: string
  displayName: string
  type: Organization['type']
}

/** Requires `organization.manage` — in practice, platform super admins only. */
export function createOrganization(payload: CreateOrganizationRequest) {
  return apiFetch<Organization>('/organizations', { method: 'POST', body: payload })
}

export function getOrganization(id: string) {
  return apiFetch<Organization>(`/organizations/${id}`)
}
