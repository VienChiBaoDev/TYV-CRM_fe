import httpService from "@/services/httpService"
import API_PATHS from "@/constants/apiPaths"

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

export interface PatientApi {
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

export interface FetchPatientsParams {
  search?: string
  branch?: ClinicBranchCode
  referrerId?: string
}

export async function fetchPatients(
  params: FetchPatientsParams = {}
): Promise<PatientApi[]> {
  const { data } = await httpService.get<PatientApi[]>(
    API_PATHS.patients.list,
    { params }
  )
  return data
}

export async function fetchPatientById(
  patientId: string
): Promise<PatientApi> {
  const { data } = await httpService.get<PatientApi>(
    API_PATHS.patients.detail(patientId)
  )
  return data
}

export async function createPatient(
  payload: CreatePatientPayload
): Promise<PatientApi> {
  const { data } = await httpService.post<PatientApi>(
    API_PATHS.patients.create,
    payload
  )
  return data
}

export async function updatePatient(
  patientId: string,
  payload: UpdatePatientPayload
): Promise<PatientApi> {
  const { data } = await httpService.patch<PatientApi>(
    API_PATHS.patients.update(patientId),
    payload
  )
  return data
}
