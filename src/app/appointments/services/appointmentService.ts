import httpService from "@/services/httpService"

import type { ClinicBranchCode } from "../../medical-records/data/patientService"
import API_PATHS from "@/constants/apiPaths"

export const APPOINTMENT_STATUSES = [
  "BOOKED",
  "CONFIRMED",
  "CHECKED_IN",
  "DONE",
  "NO_SHOW",
  "CANCELLED",
] as const

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number]

export interface AppointmentPatient {
  id: string
  fullName: string
  patientCode: string
  phone: string
}

export interface CreateAppointmentPayload {
  patientId: string
  scheduledAt: string
  endedAt: string
  doctorName?: string
  note?: string
  clinicBranch?: ClinicBranchCode
}

export interface UpdateAppointmentPayload {
  scheduledAt?: string
  endedAt?: string
  doctorName?: string
  clinicBranch?: ClinicBranchCode
  status?: AppointmentStatus
  note?: string
}

export interface Appointment {
  id: string
  patientId: string
  scheduledAt: string
  endedAt: string
  doctorName: string | null
  clinicBranch: ClinicBranchCode
  status: AppointmentStatus
  note: string | null
  visitId: string | null
  createdAt: string
  updatedAt: string
  patient?: AppointmentPatient
}

interface FetchAppointmentsParams {
  branch?: ClinicBranchCode
  from: string
  to: string
  status?: AppointmentStatus
}

export async function fetchAppointments(
  params: FetchAppointmentsParams
): Promise<Appointment[]> {
  const { data } = await httpService.get<Appointment[]>(
    API_PATHS.appointments.list,
    {
      params,
    }
  )
  return data
}

export async function createAppointment(
  payload: CreateAppointmentPayload
): Promise<Appointment> {
  const { data } = await httpService.post<Appointment>(
    API_PATHS.appointments.create,
    payload
  )
  return data
}

export async function updateAppointment(
  id: string,
  payload: UpdateAppointmentPayload
): Promise<Appointment> {
  const { data } = await httpService.patch<Appointment>(
    API_PATHS.appointments.update(id),
    payload
  )
  return data
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  const { data } = await httpService.patch<Appointment>(
    API_PATHS.appointments.cancel(id),
    { status: "CANCELLED" }
  )
  return data
}
