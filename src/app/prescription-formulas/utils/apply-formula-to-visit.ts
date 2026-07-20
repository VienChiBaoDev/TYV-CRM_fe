import type { Herb } from "@/app/medical-records/interfaces/types"
import type {
  ApplyFormulaResult,
  PrescriptionFormula,
} from "../types/prescription-formula"
import type {
  HerbDecoctionOrder,
  HerbDecoctionPrep,
} from "@/app/medical-records/constants/herb-decoction"

export function applyFormulaToVisit(
  formula: PrescriptionFormula
): ApplyFormulaResult {
  const herbs: Herb[] = formula.herbs.map((item) => ({
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

  return {
    prescriptionFormula: formula.name,
    prescriptionDosage: formula.dosage ?? "",
    herbs,
  }
}
