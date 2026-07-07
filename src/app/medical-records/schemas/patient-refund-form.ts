import { z } from "zod"

import {
  PAYMENT_METHOD,
  patientPaymentFormSchema,
} from "@/app/medical-records/schemas/patient-payment-form"

export const REFUND_REASON = {
  CANNOT_TREAT: "cannot_treat",
  CHANGE_PLAN: "change_plan",
  OVERPAID: "overpaid",
  OTHER: "other",
} as const

export type RefundReason = (typeof REFUND_REASON)[keyof typeof REFUND_REASON]

export const patientRefundFormSchema = patientPaymentFormSchema.extend({
  reason: z.enum([
    REFUND_REASON.CANNOT_TREAT,
    REFUND_REASON.CHANGE_PLAN,
    REFUND_REASON.OVERPAID,
    REFUND_REASON.OTHER,
  ]),
})

export type PatientRefundFormInput = z.input<typeof patientRefundFormSchema>
export type PatientRefundFormValues = z.output<typeof patientRefundFormSchema>

export const patientRefundFormDefaultValues: PatientRefundFormInput = {
  paymentMethod: PAYMENT_METHOD.CASH,
  paymentDetail: "",
  bankCode: "",
  createdAt: "",
  branch: "",
  content: "",
  reason: REFUND_REASON.CANNOT_TREAT,
}
