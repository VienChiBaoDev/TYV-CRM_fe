export interface UnpaidPaymentItem {
  id: string
  name: string
  patientName: string
  date: string
  totalAmount: number
  paidAmount: number
  unpaidAmount: number
}
