import httpService from "@/services/httpService"
import API_PATHS from "@/constants/apiPaths"

export interface Clinic {
  id: string
  code: string
  name: string
  address: string | null
  note: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

/** Bản rút gọn cho ô chọn cơ sở trên UI. */
export interface ClinicOption {
  id: string
  code: string
  name: string
}

export interface ClinicPayload {
  code: string
  name: string
  address?: string
  note?: string
  isActive?: boolean
  sortOrder?: number
}

export async function fetchClinics(): Promise<Clinic[]> {
  const { data } = await httpService.get<Clinic[]>(API_PATHS.clinics.list)
  return data
}

export async function fetchClinicOptions(): Promise<ClinicOption[]> {
  const { data } = await httpService.get<ClinicOption[]>(
    API_PATHS.clinics.options
  )
  return data
}

export async function createClinic(payload: ClinicPayload): Promise<Clinic> {
  const { data } = await httpService.post<Clinic>(
    API_PATHS.clinics.create,
    payload
  )
  return data
}

export async function updateClinic(
  id: string,
  payload: Partial<ClinicPayload>
): Promise<Clinic> {
  const { data } = await httpService.patch<Clinic>(
    API_PATHS.clinics.update(id),
    payload
  )
  return data
}

export async function deleteClinic(id: string): Promise<void> {
  await httpService.delete(API_PATHS.clinics.delete(id))
}
