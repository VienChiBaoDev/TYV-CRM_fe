import httpService from "@/services/httpService"
import type { ClinicalImageCategory } from "@/app/medical-records/constants/clinical-image"
import type { PatientDetailApiResponse } from "@/app/medical-records/mappers/map-patient-response"
import type { MedicalVisitApiResponse } from "@/app/medical-records/mappers/map-patient-response"
import type {
  CreateMedicalVisitApiPayload,
  UpdateMedicalVisitApiPayload,
} from "@/app/medical-records/mappers/map-visit-request"

export interface ClinicalImageApiResponse {
  readonly id: string
  readonly imageUrl: string
  readonly category: ClinicalImageCategory
  readonly sortOrder: number
}

// Chi tiết mỗi lần khám của khách hàng
export async function fetchPatientMedicalRecord(
  patientId: string
): Promise<PatientDetailApiResponse> {
  const { data } = await httpService.get<PatientDetailApiResponse>(
    `/patients/${patientId}/medical-record`
  )
  return data
}
// Tạo lần khám mới
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

// Cập nhật lần khám
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
// Tải ảnh khám lên
export async function uploadClinicalImage(
  patientId: string,
  visitId: string,
  file: File,
  category: ClinicalImageCategory
): Promise<ClinicalImageApiResponse> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("category", category)

  const { data } = await httpService.post<ClinicalImageApiResponse>(
    `/patients/${patientId}/visits/${visitId}/clinical-images`,
    formData
  )
  return data
}
// Xóa ảnh khám
export async function deleteClinicalImage(
  patientId: string,
  visitId: string,
  imageId: string
): Promise<void> {
  await httpService.delete(
    `/patients/${patientId}/visits/${visitId}/clinical-images/${imageId}`
  )
}
