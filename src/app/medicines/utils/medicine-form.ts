import { medicineFormDefaultValues } from "../schemas/medicine-form"
import type { MedicineFormInput } from "../schemas/medicine-form"
import type { Medicine } from "../types/medicine"

export function mapMedicineToFormValues(medicine: Medicine): MedicineFormInput {
  return {
    name: medicine.name,
    unit: medicine.unit,
    unitPrice: medicine.unitPrice,
    category: medicine.category ?? "",
  }
}

export function buildDefaultMedicineFormValues(): MedicineFormInput {
  return { ...medicineFormDefaultValues }
}
