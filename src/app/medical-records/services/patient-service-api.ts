import httpService from "@/services/httpService"
import type { PatientServiceApi } from "@/app/medical-records/interfaces/patient-service-api"
import type {
  CreatePatientServicePayload,
  UpdatePatientServicePayload,
} from "@/app/medical-records/mappers/map-patient-service-request"
import API_PATHS from "@/constants/apiPaths"

export async function fetchPatientServices(
  patientId: string
): Promise<PatientServiceApi[]> {
  const { data } = await httpService.get<PatientServiceApi[]>(
    API_PATHS.patientServices.list(patientId)
  )
  return data
}

export async function createPatientService(
  patientId: string,
  payload: CreatePatientServicePayload
): Promise<PatientServiceApi> {
  const { data } = await httpService.post<PatientServiceApi>(
    API_PATHS.patientServices.create(patientId),
    payload
  )
  return data
}

export async function deletePatientService(
  patientId: string,
  serviceId: string
): Promise<void> {
  await httpService.delete(
    API_PATHS.patientServices.delete(patientId, serviceId)
  )
}

export async function updatePatientService(
  patientId: string,
  serviceId: string,
  payload: UpdatePatientServicePayload
): Promise<PatientServiceApi> {
  const { data } = await httpService.patch<PatientServiceApi>(
    API_PATHS.patientServices.update(patientId, serviceId),
    payload
  )
  return data
}
