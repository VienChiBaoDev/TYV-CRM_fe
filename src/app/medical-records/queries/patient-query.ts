import { queryOptions } from "@tanstack/react-query"

import {
  fetchPatientById,
  fetchPatients,
  type FetchPatientsParams,
} from "@/app/medical-records/services/patient-api"

export type { FetchPatientsParams }

export const patientKeys = {
  all: ["patients"] as const,
  list: (params: FetchPatientsParams) =>
    [...patientKeys.all, "list", params] as const,
  detail: (patientId: string) =>
    [...patientKeys.all, "detail", patientId] as const,
}

/** @deprecated Use patientKeys */
export const patientListKeys = patientKeys

export function patientListQueryOptions(params: FetchPatientsParams) {
  return queryOptions({
    queryKey: patientKeys.list(params),
    queryFn: () => fetchPatients(params),
    enabled: Boolean(params.clinicId),
    staleTime: 30_000,
  })
}

export function patientDetailQueryOptions(patientId: string) {
  return queryOptions({
    queryKey: patientKeys.detail(patientId),
    queryFn: () => fetchPatientById(patientId),
    enabled: Boolean(patientId),
    staleTime: 30_000,
  })
}
