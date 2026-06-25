export type StaffRole = "ADMIN" | "DOCTOR" | "ASSISTANT" | "STAFF"

export type ClinicBranchValue = "HANG_BONG" | "CAU_GIAY"

export const ROLE_LABEL: Record<StaffRole, string> = {
  ADMIN: "Quản trị viên",
  DOCTOR: "Bác sĩ",
  ASSISTANT: "Trợ lý",
  STAFF: "Nhân viên",
}

export const CLINIC_BRANCH_LABEL: Record<ClinicBranchValue, string> = {
  HANG_BONG: "Hàng Bông",
  CAU_GIAY: "Cầu Giấy",
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: StaffRole
  clinicBranch: ClinicBranchValue | null
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}

export interface Staff {
  id: string
  email: string
  fullName: string
  role: StaffRole
  clinicBranch: ClinicBranchValue | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateStaffPayload {
  email: string
  password: string
  fullName: string
  role: StaffRole
  clinicBranch?: ClinicBranchValue | null
  isActive?: boolean
}

export interface UpdateStaffPayload {
  email?: string
  password?: string
  fullName?: string
  role?: StaffRole
  clinicBranch?: ClinicBranchValue | null
  isActive?: boolean
}
