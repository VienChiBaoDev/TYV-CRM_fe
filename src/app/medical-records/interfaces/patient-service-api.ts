export interface PatientServiceFormDataApi {
  readonly consultantId: string
  readonly telesaleId: string | null
  readonly groupId: string
  readonly catalogServiceId: string
  readonly unitPrice: number
  readonly vatPercent: number
  readonly vatAmount: number
  readonly unitPriceAfterVat: number
  readonly quantity: number
  readonly discount: number
  readonly treatmentCount: number
  readonly expiryDate: string | null
}

export interface PatientServicePersonApi {
  readonly name: string
  readonly initials: string
}

export interface PatientServiceAmountApi {
  readonly listPrice?: number
  readonly otherDiscount?: {
    readonly amount: number
    readonly percent: number
  }
  readonly finalAmount: number
  readonly paidAmount: number
  readonly unpaidAmount: number
}

export interface PatientServiceApi {
  readonly id: string
  readonly status: string
  readonly cancelledAt: string | null
  readonly hasPaymentHistory: boolean
  readonly serviceCode: string
  readonly serviceName: string
  readonly progress: {
    readonly current: number
    readonly total: number
    readonly maxAllowed: number
  }
  readonly amount: PatientServiceAmountApi
  readonly consultant: PatientServicePersonApi
  readonly note: string
  readonly finalizedBy: PatientServicePersonApi
  readonly finalizedAt: string
  readonly form: PatientServiceFormDataApi
}
