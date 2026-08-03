import { queryOptions } from "@tanstack/react-query"

import {
  fetchAppointments,
  type Appointment,
} from "@/app/appointments/services/appointmentService"

export const appointmentKeys = {
  all: ["appointments"] as const,
  week: (
    clinicId: string | undefined,
    from: string,
    to: string,
    doctorId?: string
  ) =>
    [
      ...appointmentKeys.all,
      "week",
      clinicId,
      from,
      to,
      doctorId ?? "all",
    ] as const,
}

export function weekAppointmentsQueryOptions(params: {
  clinicId?: string
  from: string
  to: string
  doctorId?: string
}) {
  return queryOptions({
    queryKey: appointmentKeys.week(
      params.clinicId,
      params.from,
      params.to,
      params.doctorId
    ),
    queryFn: (): Promise<Appointment[]> => fetchAppointments(params),
    staleTime: 30_000,
  })
}
