import httpService from "@/services/httpService"
import type { PatientServiceApi } from "@/app/medical-records/interfaces/patient-service-api"
import type { CreatePatientServicePayload } from "@/app/medical-records/mappers/map-patient-service-request"

export async function fetchPatientServices(
  patientId: string
): Promise<PatientServiceApi[]> {
  const { data } = await httpService.get<PatientServiceApi[]>(
    `/patients/${patientId}/services`
  )
  return data
}

export async function createPatientService(
  patientId: string,
  payload: CreatePatientServicePayload
): Promise<PatientServiceApi> {
  const { data } = await httpService.post<PatientServiceApi>(
    `/patients/${patientId}/services`,
    payload
  )
  return data
}
