import httpService from "@/services/httpService"
import type {
  CreateStaffPayload,
  Staff,
  StaffRole,
  UpdateStaffPayload,
} from "@/interfaces/auth"

export async function fetchStaffList(): Promise<Staff[]> {
  const { data } = await httpService.get<Staff[]>("/staff")
  return data
}

export interface StaffOption {
  id: string
  fullName: string
  role: StaffRole
  clinicIds: string[]
}

export async function fetchStaffOptions(): Promise<StaffOption[]> {
  const { data } = await httpService.get<StaffOption[]>("/staff/options")
  return data
}

export async function createStaff(payload: CreateStaffPayload): Promise<Staff> {
  const { data } = await httpService.post<Staff>("/staff", payload)
  return data
}

export async function updateStaff(
  id: string,
  payload: UpdateStaffPayload
): Promise<Staff> {
  const { data } = await httpService.patch<Staff>(`/staff/${id}`, payload)
  return data
}

export async function deleteStaff(id: string): Promise<void> {
  await httpService.delete(`/staff/${id}`)
}
