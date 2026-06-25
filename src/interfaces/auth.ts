export type StaffRole = "ADMIN" | "DOCTOR" | "ASSISTANT" | "STAFF"

export const ROLE_LABEL: Record<StaffRole, string> = {
  ADMIN: "Quản trị viên",
  DOCTOR: "Bác sĩ",
  ASSISTANT: "Trợ lý",
  STAFF: "Nhân viên",
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
  clinicBranch: "HANG_BONG" | "CAU_GIAY" | null
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}
