import { useSyncExternalStore } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Membership {
  organizationId: string
  facilityId: string | null
  role: string
  status: string
}

export interface ProviderProfile {
  id: string
  userId: string
  licenseNumber: string | null
  specialty: string | null
  credentialStatus: string
  credentialExpiresAt: string | null
}

export interface UserProfile {
  id: string
  email: string | null
  phone: string | null
  status: string
  isSuperAdmin: boolean
  memberships: Membership[]
  provider: ProviderProfile | null
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UserProfile | null
  setTokens: (tokens: AuthTokens) => void
  setAccessToken: (accessToken: string) => void
  setUser: (user: UserProfile | null) => void
  clearSession: () => void
}

/**
 * This backend returns both tokens as plain JSON in the response body (no
 * httpOnly cookies — confirmed against the deployed API), so localStorage
 * persistence is the only option a pure SPA has here, not a security
 * preference. Authorization is still enforced server-side on every request;
 * nothing in the UI trusts this store for access control.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: 'healthcare-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
)

/**
 * Whether this store has finished reading its persisted state back from
 * localStorage. `persist`'s rehydration is NOT guaranteed to complete
 * before a consumer's first render — confirmed empirically: on a full page
 * navigation in the production (SSR + hydration) build, an effect reading
 * `accessToken` ran while it was still `null`, incorrectly treating an
 * already-logged-in user as logged out. Anything that redirects based on
 * "no access token" (see `_app.tsx`) must gate on this being `true` first,
 * not just on the token being absent.
 */
export function useAuthHydrated(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => useAuthStore.persist.onFinishHydration(onStoreChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false, // server snapshot: rehydration never happens during SSR
  )
}
