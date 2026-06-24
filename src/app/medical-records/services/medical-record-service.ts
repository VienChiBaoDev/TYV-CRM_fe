import httpService from "@/services/httpService"
import type { PatientDetailApiResponse } from "@/app/medical-records/mappers/map-patient-response"

export async function fetchPatientMedicalRecord(
  patientId: string
): Promise<PatientDetailApiResponse> {
  const { data } = await httpService.get<PatientDetailApiResponse>(
    `/patients/${patientId}`
  )
  return data
}
