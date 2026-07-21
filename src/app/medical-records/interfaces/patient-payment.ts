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
  /** Tài khoản đã nhận tiền — null khi thu bằng tiền mặt. */
  bankAccount: {
    id: string | null
    bankName: string
    accountHolder: string
    accountNumber: string
    label: string
  } | null
  totalAmount: number
  details: PatientPaymentDetail[]
}

export interface PatientPaymentSummary {
  servicesTotal: number
  productsTotal: number
  depositTotal: number
}
