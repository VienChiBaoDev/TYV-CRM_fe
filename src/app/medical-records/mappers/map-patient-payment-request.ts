import type { PatientPaymentFormValues } from "@/app/medical-records/schemas/patient-payment-form"
import type { UnpaidPaymentItem } from "@/app/medical-records/interfaces/patient-unpaid-item"

export interface CreatePatientPaymentPayload {
  paymentMethod: string
  bankAccountId?: string
  bankCode?: string
  branch: string
  content?: string
  createdAt?: string
  items: { patientServiceRecordId: string; amount: number }[]
}

export function mapPatientPaymentFormToCreatePayload(
  values: PatientPaymentFormValues,
  selectedItems: { item: UnpaidPaymentItem; collectAmount: number }[]
): CreatePatientPaymentPayload {
  return {
    paymentMethod: values.paymentMethod,
    bankAccountId: values.bankAccountId || undefined,
    bankCode: values.bankCode || undefined,
    branch: values.branch,
    content: values.content || undefined,
    createdAt: values.createdAt || undefined,
    items: selectedItems.map((entry) => ({
      patientServiceRecordId: entry.item.id,
      amount: entry.collectAmount,
    })),
  }
}
