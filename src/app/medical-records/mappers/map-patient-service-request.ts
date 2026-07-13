import type { PatientService } from "@/app/medical-records/interfaces/patient-service"
import {
  PATIENT_SERVICE_MODE,
  type PatientServiceFormInput,
  type PatientServiceFormValues,
} from "@/app/medical-records/schemas/patient-service-form"
import { getPatientServiceSessionCount } from "@/app/medical-records/utils/patient-service-pricing"

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

export type UpdatePatientServicePayload = CreatePatientServicePayload

export function mapPatientServiceFormToCreatePayload(
  values: PatientServiceFormValues
): CreatePatientServicePayload {
  return mapPatientServiceFormToPayload(values)
}

export function mapPatientServiceFormToUpdatePayload(
  values: PatientServiceFormValues
): UpdatePatientServicePayload {
  return mapPatientServiceFormToPayload(values)
}

function mapPatientServiceFormToPayload(
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
    treatmentCount: values.quantity,
    expiryDate: values.expiryDate || undefined,
    note: values.note.trim() || undefined,
  }
}

export function mapPatientServiceToFormInput(
  service: PatientService
): PatientServiceFormInput {
  const sessionCount = getPatientServiceSessionCount({
    treatmentCount: service.form.treatmentCount,
    quantity: service.form.quantity,
  })

  return {
    consultantId: service.form.consultantId,
    telesaleId: service.form.telesaleId ?? "",
    serviceMode: PATIENT_SERVICE_MODE.SERVICE,
    groupId: service.form.groupId,
    serviceId: service.form.catalogServiceId,
    unitPrice: service.form.unitPrice,
    vatPercent: service.form.vatPercent,
    vatAmount: service.form.vatAmount,
    unitPriceAfterVat: service.form.unitPriceAfterVat,
    quantity: sessionCount,
    discount: service.form.discount,
    treatmentCount: sessionCount,
    expiryDate: service.form.expiryDate ?? "",
    note: service.note,
  }
}
