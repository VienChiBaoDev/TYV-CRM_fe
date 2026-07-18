import type { Medicine } from "@/app/medicines/types/medicine"
import type { Herb } from "@/app/medical-records/interfaces/types"
import type {
  HerbDecoctionOrder,
  HerbDecoctionPrep,
} from "@/app/medical-records/constants/herb-decoction"

export function formatHerbWeight(quantity: number, unit: string): string {
  return `${quantity} ${unit}`
}

interface BuildHerbOptions {
  decoctionOrder: HerbDecoctionOrder
  decoctionPrep: HerbDecoctionPrep
}

export function buildHerbFromMedicine(
  medicine: Medicine,
  quantity: number,
  options: BuildHerbOptions
): Herb {
  const lineTotal = medicine.unitPrice * quantity

  return {
    medicineId: medicine.id,
    name: medicine.name,
    unit: medicine.unit,
    quantity,
    unitPrice: medicine.unitPrice,
    lineTotal,
    weight: formatHerbWeight(quantity, medicine.unit),
    decoctionOrder: options.decoctionOrder,
    decoctionPrep: options.decoctionPrep,
  }
}

export function getHerbLineTotal(herb: Herb): number | null {
  if (herb.lineTotal != null) return herb.lineTotal
  if (herb.quantity != null && herb.unitPrice != null) {
    return herb.quantity * herb.unitPrice
  }
  return null
}

export function getPrescriptionHerbsTotal(herbs: Herb[]): number {
  return herbs.reduce((sum, herb) => sum + (getHerbLineTotal(herb) ?? 0), 0)
}

export function hasPricedHerbs(herbs: Herb[]): boolean {
  return herbs.some((herb) => getHerbLineTotal(herb) != null)
}
