import httpService from "@/services/httpService"
import API_PATHS from "@/constants/apiPaths"
import type { ClinicBranchCode } from "@/app/medical-records/data/patientService"

export const STAFF_SHIFT_TYPES = ["WORK", "OFF"] as const
export type StaffShiftType = (typeof STAFF_SHIFT_TYPES)[number]

export interface StaffShiftStaff {
  id: string
  fullName: string
  role: string
  clinicBranch: ClinicBranchCode | null
}

export interface StaffShift {
  id: string
  staffId: string
  clinicBranch: ClinicBranchCode
  type: StaffShiftType
  startAt: string
  endAt: string
  note: string | null
  staff?: StaffShiftStaff
}

export interface CreateStaffShiftPayload {
  staffId: string
  clinicBranch: ClinicBranchCode
  type: StaffShiftType
  startAt: string
  endAt: string
  note?: string
}

export type UpdateStaffShiftPayload = Partial<
  Omit<CreateStaffShiftPayload, "staffId">
>

interface FetchStaffShiftsParams {
  staffId: string
  branch?: ClinicBranchCode
  from: string
  to: string
}

export async function fetchStaffShifts(
  params: FetchStaffShiftsParams
): Promise<StaffShift[]> {
  const { data } = await httpService.get<StaffShift[]>(
    API_PATHS.staffShifts.list,
    { params }
  )
  return data
}

export async function createStaffShift(
  payload: CreateStaffShiftPayload
): Promise<StaffShift> {
  const { data } = await httpService.post<StaffShift>(
    API_PATHS.staffShifts.create,
    payload
  )
  return data
}

export async function updateStaffShift(
  id: string,
  payload: UpdateStaffShiftPayload
): Promise<StaffShift> {
  const { data } = await httpService.patch<StaffShift>(
    API_PATHS.staffShifts.update(id),
    payload
  )
  return data
}

export async function deleteStaffShift(id: string): Promise<void> {
  await httpService.delete(API_PATHS.staffShifts.delete(id))
}
