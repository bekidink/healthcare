import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as schedulingApi from '@/lib/api/scheduling'

export function useScheduleSlotsQuery(params: schedulingApi.ListScheduleSlotsParams | null) {
  return useQuery({
    queryKey: ['schedule-slots', params],
    queryFn: () => schedulingApi.listScheduleSlots(params as schedulingApi.ListScheduleSlotsParams),
    enabled: !!params?.facilityId,
    staleTime: 15_000,
  })
}

export function useAppointmentTypesQuery(facilityId: string | null) {
  return useQuery({
    queryKey: ['appointment-types', facilityId],
    queryFn: () => schedulingApi.listAppointmentTypes(facilityId as string),
    enabled: !!facilityId,
    staleTime: 5 * 60_000,
  })
}

export function useCreateAppointmentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: schedulingApi.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-slots'] })
    },
  })
}
