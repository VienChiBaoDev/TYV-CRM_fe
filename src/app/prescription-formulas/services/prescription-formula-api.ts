import API_PATHS from "@/constants/apiPaths"
import httpService from "@/services/httpService"
import { mapPrescriptionFormulaFromApi } from "../mappers/map-prescription-formula"
import type {
  CreatePrescriptionFormulaPayload,
  PrescriptionFormula,
} from "../types/prescription-formula"

/**
 * Lấy danh sách công thức phiếu trị liệu
 */
export async function fetchPrescriptionFormulas(): Promise<
  PrescriptionFormula[]
> {
  const { data } = await httpService.get(
    API_PATHS.prescriptionFormulaTemplates.list
  )
  return (data as unknown[]).map((row) =>
    mapPrescriptionFormulaFromApi(row as never)
  )
}

/**
 * Tạo công thức phiếu trị liệu
 */
export async function createPrescriptionFormula(
  payload: CreatePrescriptionFormulaPayload
): Promise<PrescriptionFormula> {
  const { data } = await httpService.post(
    API_PATHS.prescriptionFormulaTemplates.create,
    payload
  )
  return mapPrescriptionFormulaFromApi(data)
}

export async function deletePrescriptionFormula(id: string): Promise<void> {
  await httpService.delete(API_PATHS.prescriptionFormulaTemplates.delete(id))
}
