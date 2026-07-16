import { queryOptions } from "@tanstack/react-query"
import {
  fetchStaffShifts,
  type StaffShift,
} from "../services/staffShiftService"
import type { ClinicBranchCode } from "@/app/medical-records/data/patientService"

export const staffShiftKeys = {
  all: ["staff-shifts"] as const,
  week: (
    staffId: string,
    branch: ClinicBranchCode | undefined,
    from: string,
    to: string
  ) => [...staffShiftKeys.all, "week", staffId, branch, from, to] as const,
}

export function weekStaffShiftsQueryOptions(params: {
  staffId: string
  branch?: ClinicBranchCode
  from: string
  to: string
}) {
  return queryOptions({
    queryKey: staffShiftKeys.week(
      params.staffId,
      params.branch,
      params.from,
      params.to
    ),
    queryFn: (): Promise<StaffShift[]> => fetchStaffShifts(params),
    enabled: Boolean(params.staffId),
    staleTime: 30_000,
  })
}
