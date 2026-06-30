import type { MedicineApi } from "../interfaces/medicine.interfaces"
import type { MedicineFormValues } from "../schemas/medicine-form"
import type { Medicine } from "../types/medicine"

export function mapMedicineFromApi(medicine: MedicineApi): Medicine {
  return {
    id: medicine.id,
    name: medicine.name,
    unit: medicine.unit,
    unitPrice: Number(medicine.unitPrice),
    category: medicine.category ?? undefined,
  }
}

export function mapFormValuesToApiPayload(values: MedicineFormValues) {
  return {
    name: values.name.trim(),
    unit: values.unit,
    unitPrice: values.unitPrice,
    category: values.category?.trim() || undefined,
  }
}
