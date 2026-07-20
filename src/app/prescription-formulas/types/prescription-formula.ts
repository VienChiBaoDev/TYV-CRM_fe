import type { Herb } from "@/app/medical-records/interfaces/types"

export interface PrescriptionFormulaHerb {
  medicineId: string | null
  name: string
  weight: string
  unit: string | null
  quantity: number | null
  decoctionOrder: string | null
  decoctionPrep: string | null
  sortOrder: number
}

export interface PrescriptionFormula {
  id: string
  name: string
  dosage: string | null
  herbs: PrescriptionFormulaHerb[]
  createdAt: string
  updatedAt: string
}

export interface CreatePrescriptionFormulaPayload {
  name: string
  dosage?: string
  herbs: Array<{
    name: string
    weight: string
    medicineId?: string
    unit?: string
    quantity?: number
    decoctionOrder?: string
    decoctionPrep?: string
  }>
}

/**
 * Kết quả áp dụng công thức phiếu trị liệu
 */
export interface ApplyFormulaResult {
  //prescription formula là tên của công thức phiếu trị liệu
  prescriptionFormula: string
  // prescription dosage là liều lượng của công thức phiếu trị liệu
  prescriptionDosage: string
  herbs: Herb[]
}
