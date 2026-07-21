export interface PatientPaymentDetailApi {
  readonly amount: number
  readonly serviceCode: string
  readonly serviceName: string
}

export interface PatientPaymentBankAccountApi {
  readonly id: string | null
  readonly bankName: string
  readonly accountHolder: string
  readonly accountNumber: string
  readonly label: string
}

export interface PatientPaymentApi {
  readonly id: string
  readonly voucherCode: string
  readonly voucherDate: string
  readonly processedBy: { readonly initials: string; readonly name: string }
  readonly paymentMethod: string
  readonly bankAccount: PatientPaymentBankAccountApi | null
  readonly totalAmount: number
  readonly details: PatientPaymentDetailApi[]
}

export interface PatientPaymentSummaryApi {
  readonly total: number
  readonly paid: number
  readonly remaining: number
  readonly deposit: number
  readonly products: number
  readonly services: number
  readonly refund: number
}

export interface PatientPaymentsListApi {
  readonly summary: PatientPaymentSummaryApi
  readonly payments: PatientPaymentApi[]
}
