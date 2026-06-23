import httpService from "@/services/httpService"

export type Gender = "MALE" | "FEMALE"
export type ClinicBranchCode = "HANG_BONG" | "CAU_GIAY"

export interface CreatePatientPayload {
  fullName: string
  gender: Gender
  phone: string
  birthDate?: string
  occupation?: string
  address?: string
  source?: string
  clinicBranch?: ClinicBranchCode
  referrerId?: string
}

export interface Patient {
  id: string
  patientCode: string
  fullName: string
  gender: Gender
  phone: string
  birthDate: string | null
  address: string | null
  source: string | null
  clinicBranch: ClinicBranchCode
  customerStatus: string
  referrer: { id: string; fullName: string } | null
  createdAt: string
}

export async function createPatient(
  payload: CreatePatientPayload,
): Promise<Patient> {
  const { data } = await httpService.post<Patient>("/patients", payload)
  return data
}

export async function getPatients(params?: {
  search?: string
  branch?: ClinicBranchCode
  referrerId?: string
}): Promise<Patient[]> {
  const { data } = await httpService.get<Patient[]>("/patients", { params })
  return data
}
