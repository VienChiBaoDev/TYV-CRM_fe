import { queryOptions } from "@tanstack/react-query"
import { fetchPatientPayments } from "@/app/medical-records/services/patient-payment-api"
import { mapPatientPaymentsListFromApi } from "@/app/medical-records/mappers/map-patient-payment-response"

export const patientPaymentKeys = {
  all: ["patient-payments"] as const,
  list: (patientId: string) =>
    [...patientPaymentKeys.all, "list", patientId] as const,
}

export function patientPaymentsQueryOptions(patientId: string) {
  return queryOptions({
    queryKey: patientPaymentKeys.list(patientId),
    queryFn: async () => {
      const response = await fetchPatientPayments(patientId)
      return mapPatientPaymentsListFromApi(response)
    },
    enabled: Boolean(patientId),
    staleTime: 30_000,
  })
}
