import httpService from "@/services/httpService"
import API_PATHS from "@/constants/apiPaths"
import type {
  TreatmentHistoryItemApi,
  TreatmentSessionApi,
  TreatmentSessionListApi,
} from "@/app/medical-records/interfaces/patient-treatment-api"

export interface UpsertTreatmentSessionPayload {
  sessionNumber: number
  doctorId?: string
  ptKtvId?: string
  professionalSupport?: string
  treatmentContent: string
  note?: string
  nextContent?: string
  nextTreatmentDate?: string
}

export async function fetchTreatmentHistory(
  patientId: string
): Promise<TreatmentHistoryItemApi[]> {
  const { data } = await httpService.get<TreatmentHistoryItemApi[]>(
    API_PATHS.patientTreatment.listByPatient(patientId)
  )
  return data
}

export async function fetchServiceTreatmentSessions(
  patientId: string,
  serviceId: string
): Promise<TreatmentSessionListApi> {
  const { data } = await httpService.get<TreatmentSessionListApi>(
    API_PATHS.patientTreatment.listByService(patientId, serviceId)
  )
  return data
}

export async function upsertTreatmentSession(
  patientId: string,
  serviceId: string,
  payload: UpsertTreatmentSessionPayload
): Promise<TreatmentSessionApi> {
  const { data } = await httpService.post<TreatmentSessionApi>(
    API_PATHS.patientTreatment.upsert(patientId, serviceId),
    payload
  )
  return data
}
