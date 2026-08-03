import { queryOptions } from "@tanstack/react-query"
import {
  fetchPatientPayments,
  type FetchPatientPaymentsParams,
} from "@/app/medical-records/services/patient-payment-api"
import { mapPatientPaymentsListFromApi } from "@/app/medical-records/mappers/map-patient-payment-response"

export const patientPaymentKeys = {
  all: ["patient-payments"] as const,
  byPatient: (patientId: string) =>
    [...patientPaymentKeys.all, "list", patientId] as const,
  list: (patientId: string, params: FetchPatientPaymentsParams = {}) =>
    [...patientPaymentKeys.byPatient(patientId), params] as const,
}

export function patientPaymentsQueryOptions(
  patientId: string,
  params: FetchPatientPaymentsParams = {}
) {
  return queryOptions({
    queryKey: patientPaymentKeys.list(patientId, params),
    queryFn: async () => {
      const response = await fetchPatientPayments(patientId, params)
      return mapPatientPaymentsListFromApi(response)
    },
    enabled: Boolean(patientId),
    staleTime: 30_000,
  })
}
