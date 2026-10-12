import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as patientsApi from '@/lib/api/patients'

export function usePatientQuery(patientId: string | null) {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => patientsApi.getPatient(patientId as string),
    enabled: !!patientId,
  })
}

/** A mutation rather than a query: this is a search triggered explicitly by
 * form submission, not something that should auto-refetch on every render. */
export function useSearchPatientsMutation() {
  return useMutation({
    mutationFn: patientsApi.searchPatients,
  })
}

export function useCreatePatientMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: patientsApi.createPatient,
    onSuccess: (patient) => {
      queryClient.setQueryData(['patient', patient.id], patient)
    },
  })
}
