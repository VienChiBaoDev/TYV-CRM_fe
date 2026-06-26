import { queryOptions } from "@tanstack/react-query"

import {
  fetchAppointments,
  type Appointment,
} from "@/app/medical-records/data/appointmentService"
import type { ClinicBranchCode } from "@/app/medical-records/data/patientService"

export const appointmentKeys = {
  all: ["appointments"] as const,
  week: (branch: ClinicBranchCode | undefined, from: string, to: string) =>
    [...appointmentKeys.all, "week", branch, from, to] as const,
}

export function weekAppointmentsQueryOptions(params: {
  branch?: ClinicBranchCode
  from: string
  to: string
}) {
  return queryOptions({
    queryKey: appointmentKeys.week(params.branch, params.from, params.to),
    queryFn: (): Promise<Appointment[]> => fetchAppointments(params),
    staleTime: 30_000,
  })
}
