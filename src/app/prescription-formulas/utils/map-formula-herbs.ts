import type { Herb } from "@/app/medical-records/interfaces/types"
import type {
  HerbDecoctionOrder,
  HerbDecoctionPrep,
} from "@/app/medical-records/constants/herb-decoction"
import type { PrescriptionFormulaHerb } from "../types/prescription-formula"

export function mapFormulaHerbsToHerbs(
  herbs: PrescriptionFormulaHerb[]
): Herb[] {
  return herbs.map((item) => ({
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
  }))
}
