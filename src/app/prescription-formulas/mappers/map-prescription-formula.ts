import type { Herb } from "@/app/medical-records/interfaces/types"
import type {
  CreatePrescriptionFormulaPayload,
  PrescriptionFormula,
} from "../types/prescription-formula"

/**
 * Dữ liệu API của công thức phiếu trị liệu
 */
interface PrescriptionFormulaApi {
  id: string
  name: string
  dosage: string | null
  herbs: Array<{
    medicineId: string | null
    name: string
    weight: string
    unit: string | null
    quantity: number | null
    decoctionOrder: string | null
    decoctionPrep: string | null
    sortOrder: number
  }>
  createdAt: string
  updatedAt: string
}

/**
 * Map dữ liệu API của công thức phiếu trị liệu thành dữ liệu của công thức phiếu trị liệu
 */
export function mapPrescriptionFormulaFromApi(
  data: PrescriptionFormulaApi
): PrescriptionFormula {
  return {
    id: data.id,
    name: data.name,
    dosage: data.dosage,
    herbs: data.herbs,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

/**
 * Map dữ liệu vị thuốc của lượt khám thành dữ liệu của công thức phiếu trị liệu
 */
export function mapVisitHerbsToCreatePayload(
  herbs: Herb[]
): CreatePrescriptionFormulaPayload["herbs"] {
  return herbs.map((herb) => ({
    name: herb.name.trim(),
    weight: herb.weight.trim(),
    ...(herb.medicineId ? { medicineId: herb.medicineId } : {}),
    ...(herb.unit ? { unit: herb.unit } : {}),
    ...(herb.quantity != null ? { quantity: herb.quantity } : {}),
    ...(herb.decoctionOrder ? { decoctionOrder: herb.decoctionOrder } : {}),
    ...(herb.decoctionPrep ? { decoctionPrep: herb.decoctionPrep } : {}),
  }))
}
