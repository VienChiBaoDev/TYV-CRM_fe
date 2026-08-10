import type { MedicineFormValues } from "../schemas/medicine-form"

export interface MedicineImportRow extends MedicineFormValues {
  rowNumber: number
}

export interface MedicineImportParseResult {
  validRows: MedicineImportRow[]
  errors: Array<{ row: number; message: string }>
}

export interface MedicineImportApiResponse {
  created: number
  skipped: number
  errors: Array<{ row: number; message: string }>
}
