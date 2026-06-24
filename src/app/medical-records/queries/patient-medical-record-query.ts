import { queryOptions } from "@tanstack/react-query"
import { fetchPatientMedicalRecord } from "@/app/medical-records/services/medical-record-service"
import { mapPatientDetailToPatient } from "@/app/medical-records/mappers/map-patient-response"

export const medicalRecordKeys = {
  all: ["medical-records"] as const,
  detail: (patientId: string) =>
    [...medicalRecordKeys.all, "detail", patientId] as const,
}

export function patientMedicalRecordQueryOptions(patientId: string) {
  return queryOptions({
    queryKey: medicalRecordKeys.detail(patientId),
    queryFn: async () => {
      const response = await fetchPatientMedicalRecord(patientId)
      return mapPatientDetailToPatient(response)
    },
    enabled: Boolean(patientId),
    staleTime: 30_000,
  })
}
