import type { Gender } from "@/app/medical-records/services/patient-api"

export interface PatientImportRow {
  rowNumber: number
  fullName: string
  phone: string
  gender: Gender
  clinicCode: string
  address?: string
  birthDate?: string
  createdAt?: string
}

export interface PatientImportParseResult {
  validRows: PatientImportRow[]
  errors: Array<{ row: number; message: string }>
}

export interface PatientImportApiResponse {
  created: number
  skipped: number
  errors: Array<{ row: number; message: string }>
}
