import type { PatientServiceFormDataApi } from "@/app/medical-records/interfaces/patient-service-api"
import type { PatientServiceStatus } from "@/app/medical-records/constants/patient-service-status"

export interface PatientServicePerson {
  name: string
  initials: string
}

export interface PatientServiceAmount {
  listPrice?: number
  otherDiscount?: { amount: number; percent: number }
  finalAmount: number
  paidAmount?: number
  unpaidAmount?: number
}

export interface PatientServiceProgress {
  current: number
  total: number
}

export interface PatientService {
  id: string
  status: PatientServiceStatus
  cancelledAt: string | null
  hasPaymentHistory: boolean
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
