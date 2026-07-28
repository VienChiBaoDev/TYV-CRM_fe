import type { TreatmentFormValues } from "@/app/medical-records/schemas/treatment-form"
import type { UpsertTreatmentSessionPayload } from "@/app/medical-records/services/patient-treatment-api"
import { isoDateToApiDatetime } from "@/lib/date-vi"

export function mapTreatmentFormToUpsertPayload(
  values: TreatmentFormValues
): UpsertTreatmentSessionPayload {
  const isoDate = values.nextTreatmentDate?.trim()
  const consumables = values.consumables
    .filter((line) => line.consumableId && line.quantity > 0)
    .map((line) => ({
      consumableId: line.consumableId,
      quantity: line.quantity,
    }))

  return {
    sessionNumber: values.currentSession,
    doctorId: values.doctorId || undefined,
    ptKtvId: values.ptKtvId || undefined,
    professionalSupport: values.professionalSupport || undefined,
    treatmentContent: values.treatmentContent.trim(),
    note: values.note || undefined,
    nextContent: values.nextContent || undefined,
    nextTreatmentDate: isoDate ? isoDateToApiDatetime(isoDate) : undefined,
    ...(consumables.length > 0 ? { consumables } : {}),
  }
}
