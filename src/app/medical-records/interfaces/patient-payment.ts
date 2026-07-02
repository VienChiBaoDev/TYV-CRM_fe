export interface PatientPaymentDetail {
  amount: number
  serviceCode: string
  serviceName: string
}

export interface PatientPayment {
  id: string
  voucherCode: string
  voucherDate: string
  processedBy: { initials: string }
  paymentMethod: string
  totalAmount: number
  details: PatientPaymentDetail[]
}

export interface PatientPaymentSummary {
  servicesTotal: number
  productsTotal: number
  depositTotal: number
}
