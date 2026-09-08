import API_PATHS from "@/constants/apiPaths"
import httpService from "@/services/httpService"
import type { PatientImportApiResponse } from "../interfaces/patient-import"
import {
  chunkArray,
  PATIENT_IMPORT_BATCH_SIZE,
} from "../utils/patient-import-batch"

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
  clinicId: string
  referrerId?: string
  assignedDoctorIds: string[]
  assignedAssistantIds: string[]
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
  clinicId: string
  customerStatus: string
  referrer: { id: string; fullName: string } | null
  assignedDoctors?: AssignedStaff[]
  assignedAssistants?: AssignedStaff[]
  createdAt: string
}

export interface FetchPatientsParams {
  search?: string
  clinicId?: string
  referrerId?: string
}

export interface ImportPatientPayload {
  fullName: string
  phone: string
  gender: Gender
  clinicCode: string
  address?: string
  birthDate?: string
  createdAt?: string
}

export interface ImportPatientsBatchProgress {
  currentBatch: number
  totalBatches: number
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

export async function fetchPatientById(patientId: string): Promise<PatientApi> {
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

export async function importPatients(
  items: ImportPatientPayload[]
): Promise<PatientImportApiResponse> {
  const { data } = await httpService.post<PatientImportApiResponse>(
    API_PATHS.patients.import,
    { items }
  )
  return data
}

export async function importPatientsInBatches(
  items: ImportPatientPayload[],
  options?: {
    batchSize?: number
    onProgress?: (progress: ImportPatientsBatchProgress) => void
  }
): Promise<PatientImportApiResponse> {
  const batchSize = options?.batchSize ?? PATIENT_IMPORT_BATCH_SIZE
  const batches = chunkArray(items, batchSize)

  let created = 0
  let skipped = 0
  const errors: PatientImportApiResponse["errors"] = []

  for (let i = 0; i < batches.length; i++) {
    options?.onProgress?.({
      currentBatch: i + 1,
      totalBatches: batches.length,
    })

    const result = await importPatients(batches[i])
    created += result.created
    skipped += result.skipped
    errors.push(...result.errors)
  }

  return { created, skipped, errors }
}
