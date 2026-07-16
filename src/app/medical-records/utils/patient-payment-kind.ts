import type { PatientPayment } from "@/app/medical-records/interfaces/patient-payment"
import { formatPrice } from "@/app/treatment-services/utils/format-price"

export type PatientPaymentKind = "payment" | "refund"

export function getPatientPaymentKind(
  payment: Pick<PatientPayment, "totalAmount" | "voucherCode">
): PatientPaymentKind {
  if (payment.totalAmount < 0) return "refund"
  if (payment.voucherCode.startsWith("HTTYV")) return "refund"
  return "payment"
}

export function isRefundPayment(payment: PatientPayment): boolean {
  return getPatientPaymentKind(payment) === "refund"
}

export function formatSignedPrice(amount: number): string {
  const abs = Math.abs(amount)
  const formatted = formatPrice(abs)
  if (amount < 0) return `−${formatted} đ`
  if (amount > 0) return `+${formatted} đ`
  return `${formatted} đ`
}

export function getPaymentKindLabel(kind: PatientPaymentKind): string {
  return kind === "refund" ? "Hoàn tiền" : "Thu tiền"
}
