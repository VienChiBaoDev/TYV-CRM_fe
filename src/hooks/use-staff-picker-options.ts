import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import type { ClinicBranchCode } from "@/constants/clinic-branches"
import { fetchStaffOptions, type StaffOption } from "@/services/staffService"
import type { FormSelectOption } from "@/components/FieldCustom/FormSelect"

function matchesBranch(staff: StaffOption, branch?: ClinicBranchCode): boolean {
  if (!branch) return true
  return !staff.clinicBranch || staff.clinicBranch === branch
}

export function findStaffIdByName(
  staffList: StaffOption[],
  name: string
): string {
  return staffList.find((staff) => staff.fullName === name)?.id ?? ""
}

export function staffNameById(
  staffList: StaffOption[],
  id: string | undefined
): string | undefined {
  if (!id) return undefined
  return staffList.find((staff) => staff.id === id)?.fullName
}

export function useStaffPickerOptions(
  enabled = true,
  branch?: ClinicBranchCode
) {
  const { data: staffOptions = [], isLoading } = useQuery<StaffOption[]>({
    queryKey: ["staff", "options"],
    queryFn: fetchStaffOptions,
    enabled,
  })

  const doctorOptions = useMemo<FormSelectOption[]>(
    () =>
      staffOptions
        .filter((staff: StaffOption) => staff.role === "DOCTOR")
        .filter((staff) => matchesBranch(staff, branch))
        .map((staff: StaffOption) => ({
          value: staff.id,
          label: staff.fullName,
        })),
    [staffOptions, branch]
  )

  const assistantOptions = useMemo<FormSelectOption[]>(
    () =>
      staffOptions
        .filter((staff: StaffOption) => staff.role === "ASSISTANT")
        .filter((staff) => matchesBranch(staff, branch))
        .map((staff: StaffOption) => ({
          value: staff.id,
          label: staff.fullName,
        })),
    [staffOptions, branch]
  )

  return { staffOptions, doctorOptions, assistantOptions, isLoading }
}
