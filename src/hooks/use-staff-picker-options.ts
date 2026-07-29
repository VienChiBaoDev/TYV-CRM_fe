import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchStaffOptions, type StaffOption } from "@/services/staffService"
import type { FormSelectOption } from "@/components/FieldCustom/FormSelect"

function matchesClinic(staff: StaffOption, clinicId?: string): boolean {
  if (!clinicId) return true
  return !staff.clinicId || staff.clinicId === clinicId
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
  clinicId?: string
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
        .filter((staff) => matchesClinic(staff, clinicId))
        .map((staff: StaffOption) => ({
          value: staff.id,
          label: staff.fullName,
        })),
    [staffOptions, clinicId]
  )

  const assistantOptions = useMemo<FormSelectOption[]>(
    () =>
      staffOptions
        .filter((staff: StaffOption) => staff.role === "ASSISTANT")
        .filter((staff) => matchesClinic(staff, clinicId))
        .map((staff: StaffOption) => ({
          value: staff.id,
          label: staff.fullName,
        })),
    [staffOptions, clinicId]
  )

  return { staffOptions, doctorOptions, assistantOptions, isLoading }
}
