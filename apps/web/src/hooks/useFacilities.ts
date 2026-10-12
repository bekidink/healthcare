import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as facilitiesApi from '@/lib/api/facilities'

export function useFacilitiesQuery(organizationId: string | null) {
  return useQuery({
    queryKey: ['facilities', organizationId],
    queryFn: () => facilitiesApi.listFacilities(organizationId as string),
    enabled: !!organizationId,
    staleTime: 5 * 60_000,
  })
}

export function useFacilityQuery(facilityId: string | null) {
  return useQuery({
    queryKey: ['facility', facilityId],
    queryFn: () => facilitiesApi.getFacility(facilityId as string),
    enabled: !!facilityId,
    staleTime: 5 * 60_000,
  })
}

export function useCreateFacilityMutation(organizationId: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: facilitiesApi.CreateFacilityRequest) =>
      facilitiesApi.createFacility(organizationId as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities', organizationId] })
    },
  })
}
