import type { RefundablePaymentItem } from "../interfaces/refundable-payment-item"
import type { PatientRefundFormValues } from "../schemas/patient-refund-form"

export interface CreatePatientRefundPayload {
  paymentMethod: string
  reason: string
  bankAccountId?: string
  bankCode?: string
  branch: string
  content?: string
  createdAt?: string
  items: {
    patientServiceRecordId: string
    amount: number
    lockService?: boolean
  }[]
}

export function mapPatientRefundFormToCreatePayload(
  values: PatientRefundFormValues,
  selectedItems: {
    item: RefundablePaymentItem
    refundAmount: number
    lockService: boolean
  }[]
): CreatePatientRefundPayload {
  return {
    paymentMethod: values.paymentMethod,
    bankAccountId: values.bankAccountId || undefined,
    bankCode: values.bankCode || undefined,
    branch: values.branch,
    content: values.content || undefined,
    createdAt: values.createdAt || undefined,
    items: selectedItems.map((entry) => ({
      patientServiceRecordId: entry.item.id,
      amount: entry.refundAmount,
      lockService: entry.lockService,
    })),
    reason: values.reason,
  }
}
