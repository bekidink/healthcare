import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * The backend has no server-side concept of an "active facility" (only
 * `activeOrganizationId` lives in the JWT — confirmed against the identity
 * service). Every facility-scoped request carries `facilityId` explicitly in
 * its own payload/query, so this store exists purely to remember the user's
 * last-picked organization/facility across the UI and thread it into those
 * requests — it is a workflow convenience, not an authorization boundary.
 */
interface FacilityState {
  organizationId: string | null
  facilityId: string | null
  setOrganization: (organizationId: string | null) => void
  setFacility: (facilityId: string | null) => void
  reset: () => void
}

export const useFacilityStore = create<FacilityState>()(
  persist(
    (set) => ({
      organizationId: null,
      facilityId: null,
      setOrganization: (organizationId) => set({ organizationId, facilityId: null }),
      setFacility: (facilityId) => set({ facilityId }),
      reset: () => set({ organizationId: null, facilityId: null }),
    }),
    { name: 'healthcare-facility' },
  ),
)
