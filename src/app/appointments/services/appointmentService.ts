import httpService from "@/services/httpService"
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
  doctorId: string
  assistantId?: string
  doctorName?: string
  assistantName?: string
  note?: string
  clinicId?: string
}

export interface UpdateAppointmentPayload {
  scheduledAt?: string
  endedAt?: string
  doctorId?: string
  assistantId?: string
  doctorName?: string
  assistantName?: string
  clinicId?: string
  status?: AppointmentStatus
  note?: string
}

export interface Appointment {
  id: string
  patientId: string
  scheduledAt: string
  endedAt: string
  doctorId: string | null
  assistantId: string | null
  doctorName: string | null
  assistantName: string | null
  clinicId: string
  status: AppointmentStatus
  note: string | null
  visitId: string | null
  createdAt: string
  updatedAt: string
  patient?: AppointmentPatient
}

interface FetchAppointmentsParams {
  clinicId?: string
  from: string
  to: string
  status?: AppointmentStatus
  doctorId?: string
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
    API_PATHS.appointments.update(id),
    { status: "CANCELLED" }
  )
  return data
}

export async function checkInAppointment(id: string): Promise<Appointment> {
  const { data } = await httpService.post<Appointment>(
    API_PATHS.appointments.checkIn(id)
  )
  return data
}
