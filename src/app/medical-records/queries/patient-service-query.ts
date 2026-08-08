import { queryOptions } from "@tanstack/react-query"
import { fetchPatientServices } from "@/app/medical-records/services/patient-service-api"
import { mapPatientServiceFromApi } from "@/app/medical-records/mappers/map-patient-service-response"

export const patientServiceKeys = {
  all: ["patient-services"] as const,
  list: (patientId: string) =>
    [...patientServiceKeys.all, "list", patientId] as const,
}

export function patientServicesQueryOptions(
  patientId: string,
  enabled = true
) {
  return queryOptions({
    queryKey: patientServiceKeys.list(patientId),
    queryFn: async () => {
      const records = await fetchPatientServices(patientId)
      return records.map(mapPatientServiceFromApi)
    },
    enabled: Boolean(patientId) && enabled,
    staleTime: 30_000,
  })
}
