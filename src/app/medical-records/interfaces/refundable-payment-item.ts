export interface RefundablePaymentItem {
  id: string
  name: string
  patientName: string
  date: string
  totalAmount: number
  paidAmount: number
  treatedAmount: number
}

export function getRefundableAmount(item: RefundablePaymentItem): number {
  return Math.max(0, item.paidAmount - item.treatedAmount)
}
