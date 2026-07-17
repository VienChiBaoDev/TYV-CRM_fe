import { queryOptions } from "@tanstack/react-query"

import {
  fetchAppointments,
  type Appointment,
} from "@/app/appointments/services/appointmentService"
import type { ClinicBranchCode } from "@/app/medical-records/data/patientService"

export const appointmentKeys = {
  all: ["appointments"] as const,
  week: (
    branch: ClinicBranchCode | undefined,
    from: string,
    to: string,
    doctorId?: string
  ) =>
    [
      ...appointmentKeys.all,
      "week",
      branch,
      from,
      to,
      doctorId ?? "all",
    ] as const,
}

export function weekAppointmentsQueryOptions(params: {
  branch?: ClinicBranchCode
  from: string
  to: string
  doctorId?: string
}) {
  return queryOptions({
    queryKey: appointmentKeys.week(
      params.branch,
      params.from,
      params.to,
      params.doctorId
    ),
    queryFn: (): Promise<Appointment[]> => fetchAppointments(params),
    staleTime: 30_000,
  })
}
