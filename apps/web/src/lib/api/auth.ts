import { apiFetch } from './client'
import type { AuthTokens, UserProfile } from '@/stores/auth-store'

export interface LoginRequest {
  email: string
  password: string
  organizationId?: string
}

export function login(payload: LoginRequest) {
  return apiFetch<AuthTokens>('/auth/login', { method: 'POST', body: payload, auth: false })
}

export function logout() {
  return apiFetch<{ ok: boolean }>('/auth/logout', { method: 'POST' })
}

export function getMe() {
  return apiFetch<UserProfile>('/users/me')
}

export interface SwitchOrganizationResponse {
  accessToken: string
  expiresIn: number
}

export function switchOrganization(organizationId: string) {
  return apiFetch<SwitchOrganizationResponse>('/auth/switch-organization', {
    method: 'POST',
    body: { organizationId },
  })
}
