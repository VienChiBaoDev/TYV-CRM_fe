import httpService from "@/services/httpService"
import API_PATHS from "@/constants/apiPaths"
import type {
  TreatmentHistoryItemApi,
  TreatmentSessionApi,
  TreatmentSessionImageApi,
  TreatmentSessionListApi,
} from "@/app/medical-records/interfaces/patient-treatment-api"

export interface TreatmentSessionConsumablePayload {
  consumableId: string
  quantity: number
}

export interface UpsertTreatmentSessionPayload {
  sessionNumber: number
  doctorId?: string
  ptKtvId?: string
  professionalSupport?: string
  treatmentContent: string
  note?: string
  nextContent?: string
  nextTreatmentDate?: string
  consumables?: TreatmentSessionConsumablePayload[]
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

export async function uploadTreatmentSessionImage(
  patientId: string,
  serviceId: string,
  sessionNumber: number,
  file: File
): Promise<TreatmentSessionImageApi> {
  const formData = new FormData()
  formData.append("file", file)
  const { data } = await httpService.post<TreatmentSessionImageApi>(
    API_PATHS.patientTreatment.uploadImage(patientId, serviceId, sessionNumber),
    formData
  )
  return data
}
export async function deleteTreatmentSessionImage(
  patientId: string,
  serviceId: string,
  sessionNumber: number,
  imageId: string
): Promise<void> {
  await httpService.delete(
    API_PATHS.patientTreatment.deleteImage(
      patientId,
      serviceId,
      sessionNumber,
      imageId
    )
  )
}
