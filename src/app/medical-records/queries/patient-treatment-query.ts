import { queryOptions } from "@tanstack/react-query"
import {
  fetchServiceTreatmentSessions,
  fetchTreatmentHistory,
} from "@/app/medical-records/services/patient-treatment-api"

export const patientTreatmentKeys = {
  all: ["patient-treatment"] as const,
  history: (patientId: string) =>
    [...patientTreatmentKeys.all, "history", patientId] as const,
  byService: (patientId: string, serviceId: string) =>
    [...patientTreatmentKeys.all, "service", patientId, serviceId] as const,
}

export function treatmentHistoryQueryOptions(patientId: string) {
  return queryOptions({
    queryKey: patientTreatmentKeys.history(patientId),
    queryFn: () => fetchTreatmentHistory(patientId),
    enabled: Boolean(patientId),
    staleTime: 30_000,
  })
}

export function serviceTreatmentSessionsQueryOptions(
  patientId: string,
  serviceId: string
) {
  return queryOptions({
    queryKey: patientTreatmentKeys.byService(patientId, serviceId),
    queryFn: () => fetchServiceTreatmentSessions(patientId, serviceId),
    enabled: Boolean(patientId && serviceId),
    staleTime: 10_000,
  })
}
