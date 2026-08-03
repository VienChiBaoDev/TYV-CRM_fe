import { queryOptions } from "@tanstack/react-query"
import {
  fetchStaffShifts,
  type StaffShift,
} from "../services/staffShiftService"

export const staffShiftKeys = {
  all: ["staff-shifts"] as const,
  week: (
    staffId: string,
    clinicId: string | undefined,
    from: string,
    to: string
  ) => [...staffShiftKeys.all, "week", staffId, clinicId, from, to] as const,
}

export function weekStaffShiftsQueryOptions(params: {
  staffId: string
  clinicId?: string
  from: string
  to: string
}) {
  return queryOptions({
    queryKey: staffShiftKeys.week(
      params.staffId,
      params.clinicId,
      params.from,
      params.to
    ),
    queryFn: (): Promise<StaffShift[]> => fetchStaffShifts(params),
    enabled: Boolean(params.staffId),
    staleTime: 30_000,
  })
}
