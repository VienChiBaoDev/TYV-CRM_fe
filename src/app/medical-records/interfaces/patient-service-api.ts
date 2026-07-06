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
}

export interface PatientServiceApi {
  readonly id: string
  readonly serviceCode: string
  readonly serviceName: string
  readonly progress: {
    readonly current: number
    readonly total: number
  }
  readonly amount: PatientServiceAmountApi
  readonly consultant: PatientServicePersonApi
  readonly note: string
  readonly finalizedBy: PatientServicePersonApi
  readonly finalizedAt: string
}
