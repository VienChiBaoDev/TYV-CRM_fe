import httpService from "@/services/httpService"

import type { ClinicBranchCode } from "./patientService"

export interface CreateAppointmentPayload {
  patientId: string
  scheduledAt: string
  doctorName?: string
  note?: string
  clinicBranch?: ClinicBranchCode
}

export interface Appointment {
  id: string
  patientId: string
  scheduledAt: string
  doctorName: string | null
  clinicBranch: ClinicBranchCode
  status: string
  note: string | null
  createdAt: string
}

export async function createAppointment(
  payload: CreateAppointmentPayload,
): Promise<Appointment> {
  const { data } = await httpService.post<Appointment>("/appointments", payload)
  return data
}
