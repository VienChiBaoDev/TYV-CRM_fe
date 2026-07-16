import httpService from "@/services/httpService"

export interface MedicalCaseApiResponse {
  readonly id: string
  readonly patientId: string
  readonly formData: Record<string, unknown>
  readonly createdAt: string
  readonly updatedAt: string
}

/**
 * Lấy bệnh án YHCT ngoại trú của bệnh nhân (hoặc null nếu chưa có)
 */
export async function fetchMedicalCase(
  patientId: string
): Promise<MedicalCaseApiResponse | null> {
  const { data } = await httpService.get<MedicalCaseApiResponse | null>(
    `/patients/${patientId}/medical-case`
  )
  return data
}

/**
 * Tạo mới hoặc cập nhật bệnh án YHCT ngoại trú (upsert)
 */
export async function saveMedicalCase(
  patientId: string,
  formData: Record<string, unknown>
): Promise<MedicalCaseApiResponse> {
  const { data } = await httpService.put<MedicalCaseApiResponse>(
    `/patients/${patientId}/medical-case`,
    { formData }
  )
  return data
}
