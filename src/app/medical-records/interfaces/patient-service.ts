import type { PatientServiceFormDataApi } from "@/app/medical-records/interfaces/patient-service-api"

export interface PatientServicePerson {
  name: string
  initials: string
}

export interface PatientServiceAmount {
  listPrice?: number
  otherDiscount?: {
    amount: number
    percent: number
  }
  finalAmount: number
}

export interface PatientServiceProgress {
  current: number
  total: number
}

export interface PatientService {
  id: string
  serviceCode: string
  serviceName: string
  progress: PatientServiceProgress
  amount: PatientServiceAmount
  consultant: PatientServicePerson
  note: string
  finalizedBy: PatientServicePerson
  finalizedAt: string
  form: PatientServiceFormDataApi
}
