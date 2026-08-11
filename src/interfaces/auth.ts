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
  clinicIds: string[]
  allClinics: boolean
  permissions: string[]
}

export interface LoginResponse {
  user: AuthUser
}

export interface Staff {
  id: string
  email: string
  fullName: string
  role: StaffRole
  clinicIds: string[]
  permissionCodes: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateStaffPayload {
  email: string
  password: string
  fullName: string
  role: StaffRole
  clinicIds?: string[]
  isActive?: boolean
  permissionCodes?: string[]
}

export interface UpdateStaffPayload {
  email?: string
  password?: string
  fullName?: string
  role?: StaffRole
  clinicIds?: string[]
  isActive?: boolean
  permissionCodes?: string[]
}
