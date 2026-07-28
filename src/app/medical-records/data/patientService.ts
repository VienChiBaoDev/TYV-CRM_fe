import httpService from "@/services/httpService"

import type { ClinicBranchCode } from "@/constants/clinic-branches"

export type { ClinicBranchCode }

export type Gender = "MALE" | "FEMALE"

export interface AssignedStaff {
  id: string
  fullName: string
}

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
  assignedDoctorIds?: string[]
  assignedAssistantIds?: string[]
}

export type UpdatePatientPayload = Partial<CreatePatientPayload>

export interface Patient {
  id: string
  patientCode: string
  fullName: string
  gender: Gender
  phone: string
  birthDate: string | null
  occupation: string | null
  address: string | null
  source: string | null
  clinicBranch: ClinicBranchCode
  customerStatus: string
  referrer: { id: string; fullName: string } | null
  assignedDoctors?: AssignedStaff[]
  assignedAssistants?: AssignedStaff[]
  createdAt: string
}

export async function createPatient(
  payload: CreatePatientPayload
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

export async function getPatientById(patientId: string): Promise<Patient> {
  const { data } = await httpService.get<Patient>(`/patients/${patientId}`)
  return data
}

export async function updatePatient(
  patientId: string,
  payload: UpdatePatientPayload
): Promise<Patient> {
  const { data } = await httpService.patch<Patient>(
    `/patients/${patientId}`,
    payload
  )
  return data
}
