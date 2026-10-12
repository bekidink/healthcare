import { useMutation, useQuery } from '@tanstack/react-query'
import * as organizationsApi from '@/lib/api/organizations'
import { useFacilityStore } from '@/stores/facility-store'

export function useOrganizationQuery(organizationId: string | null) {
  return useQuery({
    queryKey: ['organization', organizationId],
    queryFn: () => organizationsApi.getOrganization(organizationId as string),
    enabled: !!organizationId,
    staleTime: 5 * 60_000,
  })
}

export function useCreateOrganizationMutation() {
  const setOrganization = useFacilityStore((s) => s.setOrganization)

  return useMutation({
    mutationFn: organizationsApi.createOrganization,
    onSuccess: (organization) => {
      // The backend has no endpoint to add the creator as a member of their
      // own new organization automatically — that still requires a separate
      // Membership row (`user.manage`). Setting this as the active
      // organization locally just lets the UI move on to creating a
      // facility under it; it grants no permissions the backend doesn't
      // already recognize (those come only from `isSuperAdmin` or a real
      // membership).
      setOrganization(organization.id)
    },
  })
}
