import {
  DEFAULT_HERB_DECOCTION_ORDER,
  DEFAULT_HERB_DECOCTION_PREP,
  type HerbDecoctionOrder,
  type HerbDecoctionPrep,
} from "@/app/medical-records/constants/herb-decoction"
import type { Herb } from "@/app/medical-records/interfaces/types"
import { buildHerbFromMedicine } from "@/app/medical-records/utils/herb-pricing"
import { fetchMedicineById } from "@/app/medicines/services/medicine-api"
import type { Medicine } from "@/app/medicines/types/medicine"
import type {
  ApplyFormulaResult,
  PrescriptionFormula,
  PrescriptionFormulaHerb,
} from "../types/prescription-formula"
/**
 * Hàm này để tạo một herb mới mà không có giá thành
 */
function buildHerbWithoutPricing(item: PrescriptionFormulaHerb): Herb {
  return {
    name: item.name,
    weight: item.weight,
    ...(item.medicineId ? { medicineId: item.medicineId } : {}),
    ...(item.unit ? { unit: item.unit } : {}),
    ...(item.quantity != null ? { quantity: item.quantity } : {}),
    ...(item.decoctionOrder
      ? { decoctionOrder: item.decoctionOrder as HerbDecoctionOrder }
      : {}),
    ...(item.decoctionPrep
      ? { decoctionPrep: item.decoctionPrep as HerbDecoctionPrep }
      : {}),
  }
}

/**
 * Hàm này để tạo một herb mới từ một item trong công thức dược liệu
 */
function buildHerbFromFormulaItem(
  item: PrescriptionFormulaHerb,
  medicine: Medicine | null
): Herb {
  const decoctionOrder = (item.decoctionOrder ??
    DEFAULT_HERB_DECOCTION_ORDER) as HerbDecoctionOrder
  const decoctionPrep = (item.decoctionPrep ??
    DEFAULT_HERB_DECOCTION_PREP) as HerbDecoctionPrep

  if (medicine && item.quantity != null && item.quantity > 0) {
    return buildHerbFromMedicine(medicine, item.quantity, {
      decoctionOrder,
      decoctionPrep,
    })
  }

  return buildHerbWithoutPricing(item)
}

/**
 * Hàm này để fetch các medicine từ các id
 */
async function fetchMedicinesByIds(
  ids: string[]
): Promise<Map<string, Medicine>> {
  const uniqueIds = [...new Set(ids)]
  if (uniqueIds.length === 0) return new Map()

  const results = await Promise.allSettled(
    uniqueIds.map((id) => fetchMedicineById(id))
  )

  const medicineById = new Map<string, Medicine>()
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      medicineById.set(uniqueIds[index], result.value)
    }
  })

  return medicineById
}

/**
 * Hàm này để áp dụng một công thức dược liệu vào một lượt khám
 */
export async function applyFormulaToVisit(
  formula: PrescriptionFormula
): Promise<ApplyFormulaResult> {
  const medicineIds = formula.herbs
    .map((herb) => herb.medicineId)
    .filter((id): id is string => id != null)

  const medicineById = await fetchMedicinesByIds(medicineIds)

  const herbs = formula.herbs.map((item) =>
    buildHerbFromFormulaItem(
      item,
      item.medicineId ? (medicineById.get(item.medicineId) ?? null) : null
    )
  )

  return {
    prescriptionFormula: formula.name,
    prescriptionDosage: formula.dosage ?? "",
    herbs,
  }
}
