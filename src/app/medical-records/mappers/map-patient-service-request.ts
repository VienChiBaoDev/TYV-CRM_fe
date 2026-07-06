import type { PatientServiceFormValues } from "@/app/medical-records/schemas/patient-service-form"

export interface CreatePatientServicePayload {
  catalogServiceId: string
  consultantId: string
  telesaleId?: string
  unitPrice: number
  vatPercent: number
  vatAmount: number
  unitPriceAfterVat: number
  quantity: number
  discount: number
  treatmentCount: number
  expiryDate?: string
  note?: string
}

export function mapPatientServiceFormToCreatePayload(
  values: PatientServiceFormValues
): CreatePatientServicePayload {
  return {
    catalogServiceId: values.serviceId,
    consultantId: values.consultantId,
    telesaleId: values.telesaleId || undefined,
    unitPrice: values.unitPrice,
    vatPercent: values.vatPercent,
    vatAmount: values.vatAmount,
    unitPriceAfterVat: values.unitPriceAfterVat,
    quantity: values.quantity,
    discount: values.discount,
    treatmentCount: values.treatmentCount,
    expiryDate: values.expiryDate || undefined,
    note: values.note.trim() || undefined,
  }
}
