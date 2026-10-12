import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import * as authApi from '@/lib/api/auth'
import { useAuthStore } from '@/stores/auth-store'
import { useFacilityStore } from '@/stores/facility-store'
import { decodeJwtPayload, type AccessTokenPayload } from '@/lib/jwt'

export function useLoginMutation() {
  const setTokens = useAuthStore((s) => s.setTokens)
  const setUser = useAuthStore((s) => s.setUser)
  const setOrganization = useFacilityStore((s) => s.setOrganization)

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (tokens) => {
      setTokens(tokens)

      const payload = decodeJwtPayload<AccessTokenPayload>(tokens.accessToken)
      const user = await authApi.getMe()
      setUser(user)

      if (payload?.activeOrganizationId) {
        setOrganization(payload.activeOrganizationId)
      } else {
        // Backend leaves `activeOrganizationId` unset when login didn't
        // disambiguate it (more than one membership) — fall back to the
        // single organization the user belongs to, if there's only one.
        const organizationIds = [...new Set(user.memberships.map((m) => m.organizationId))]
        if (organizationIds.length === 1) {
          setOrganization(organizationIds[0])
        }
      }
    },
  })
}

export function useMeQuery() {
  const accessToken = useAuthStore((s) => s.accessToken)
  return useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    enabled: !!accessToken,
    staleTime: 5 * 60_000,
  })
}

export function useLogoutMutation() {
  const clearSession = useAuthStore((s) => s.clearSession)
  const resetFacility = useFacilityStore((s) => s.reset)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearSession()
      resetFacility()
      queryClient.clear()
      navigate({ to: '/login' })
    },
  })
}

export function useSwitchOrganizationMutation() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken)
  const setOrganization = useFacilityStore((s) => s.setOrganization)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.switchOrganization,
    onSuccess: (result, organizationId) => {
      setAccessToken(result.accessToken)
      setOrganization(organizationId)
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
