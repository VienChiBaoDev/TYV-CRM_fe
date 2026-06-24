import httpService from "@/services/httpService"
import type { PatientDetailApiResponse } from "@/app/medical-records/mappers/map-patient-response"
import type { MedicalVisitApiResponse } from "@/app/medical-records/mappers/map-patient-response"
import type {
  CreateMedicalVisitApiPayload,
  UpdateMedicalVisitApiPayload,
} from "@/app/medical-records/mappers/map-visit-request"

export async function fetchPatientMedicalRecord(
  patientId: string
): Promise<PatientDetailApiResponse> {
  const { data } = await httpService.get<PatientDetailApiResponse>(
    `/patients/${patientId}`
  )
  return data
}

export async function createMedicalVisit(
  patientId: string,
  payload: CreateMedicalVisitApiPayload
): Promise<MedicalVisitApiResponse> {
  const { data } = await httpService.post<MedicalVisitApiResponse>(
    `/patients/${patientId}/visits`,
    payload
  )
  return data
}

export async function updateMedicalVisit(
  patientId: string,
  visitId: string,
  payload: UpdateMedicalVisitApiPayload
): Promise<MedicalVisitApiResponse> {
  const { data } = await httpService.patch<MedicalVisitApiResponse>(
    `/patients/${patientId}/visits/${visitId}`,
    payload
  )
  return data
}
