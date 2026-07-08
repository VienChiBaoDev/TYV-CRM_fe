import httpService from "@/services/httpService"
import API_PATHS from "@/constants/apiPaths"
import type { PatientPaymentsListApi } from "@/app/medical-records/interfaces/patient-payment-api"
import type { CreatePatientPaymentPayload } from "@/app/medical-records/mappers/map-patient-payment-request"
import type { PatientPaymentApi } from "@/app/medical-records/interfaces/patient-payment-api"

export async function fetchPatientPayments(
  patientId: string
): Promise<PatientPaymentsListApi> {
  const { data } = await httpService.get<PatientPaymentsListApi>(
    API_PATHS.patientPayments.list(patientId)
  )
  return data
}

export async function createPatientPayment(
  patientId: string,
  payload: CreatePatientPaymentPayload
): Promise<PatientPaymentApi> {
  const { data } = await httpService.post<PatientPaymentApi>(
    API_PATHS.patientPayments.create(patientId),
    payload
  )
  return data
}
