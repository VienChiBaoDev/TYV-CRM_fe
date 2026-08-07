import type { StaffRole } from "@/interfaces/auth"

/** Permission codes — fixed catalog (not admin-created). */
export const PERMISSIONS = {
  PATIENTS_READ: "patients:read",
  PATIENTS_WRITE: "patients:write",
  VISITS_WRITE: "visits:write",
  APPOINTMENTS_READ: "appointments:read",
  APPOINTMENTS_WRITE: "appointments:write",
  SERVICES_READ: "services:read",
  SERVICES_WRITE: "services:write",
  PAYMENTS_READ: "payments:read",
  PAYMENTS_WRITE: "payments:write",
  TREATMENT_WRITE: "treatment:write",
  FOLLOWUPS_WRITE: "followups:write",
  CATALOG_READ: "catalog:read",
  CATALOG_WRITE: "catalog:write",
  MEDICINES_READ: "medicines:read",
  MEDICINES_WRITE: "medicines:write",
  FORMULAS_READ: "formulas:read",
  FORMULAS_WRITE: "formulas:write",
  CONSUMABLES_READ: "consumables:read",
  CONSUMABLES_WRITE: "consumables:write",
  SHIFTS_READ: "shifts:read",
  SHIFTS_WRITE: "shifts:write",
  REFERRERS_WRITE: "referrers:write",
  SETTINGS_STAFF: "settings:staff",
  SETTINGS_CLINICS: "settings:clinics",
  SETTINGS_BANKS: "settings:banks",
} as const

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export interface PermissionDef {
  code: PermissionCode
  label: string
}

export interface PermissionGroup {
  id: string
  label: string
  items: PermissionDef[]
}

/** Grouped for Settings checklist UI. */
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "patients",
    label: "Khách hàng & bệnh án",
    items: [
      { code: PERMISSIONS.PATIENTS_READ, label: "Xem khách hàng / hồ sơ" },
      { code: PERMISSIONS.PATIENTS_WRITE, label: "Tạo / sửa khách hàng" },
      { code: PERMISSIONS.VISITS_WRITE, label: "Ghi lần khám / bệnh án" },
      { code: PERMISSIONS.TREATMENT_WRITE, label: "Buổi điều trị" },
      { code: PERMISSIONS.FOLLOWUPS_WRITE, label: "Follow-up" },
    ],
  },
  {
    id: "schedule",
    label: "Lịch hẹn & lịch làm việc",
    items: [
      { code: PERMISSIONS.APPOINTMENTS_READ, label: "Xem lịch hẹn" },
      { code: PERMISSIONS.APPOINTMENTS_WRITE, label: "Tạo / sửa / check-in lịch hẹn" },
      { code: PERMISSIONS.SHIFTS_READ, label: "Xem lịch làm việc" },
      { code: PERMISSIONS.SHIFTS_WRITE, label: "Sửa lịch làm việc" },
    ],
  },
  {
    id: "billing",
    label: "Dịch vụ & thanh toán",
    items: [
      { code: PERMISSIONS.SERVICES_READ, label: "Xem dịch vụ khách hàng" },
      { code: PERMISSIONS.SERVICES_WRITE, label: "Thêm / sửa / hủy dịch vụ" },
      { code: PERMISSIONS.PAYMENTS_READ, label: "Xem thanh toán" },
      { code: PERMISSIONS.PAYMENTS_WRITE, label: "Thu tiền / hoàn tiền" },
    ],
  },
  {
    id: "catalog",
    label: "Danh mục",
    items: [
      { code: PERMISSIONS.CATALOG_READ, label: "Xem dịch vụ điều trị" },
      { code: PERMISSIONS.CATALOG_WRITE, label: "Sửa dịch vụ điều trị" },
      { code: PERMISSIONS.MEDICINES_READ, label: "Xem dược liệu & sản phẩm" },
      { code: PERMISSIONS.MEDICINES_WRITE, label: "Sửa dược liệu & sản phẩm" },
      { code: PERMISSIONS.FORMULAS_READ, label: "Xem công thức đơn" },
      { code: PERMISSIONS.FORMULAS_WRITE, label: "Sửa công thức đơn" },
      { code: PERMISSIONS.CONSUMABLES_READ, label: "Xem vật tư tiêu hao" },
      { code: PERMISSIONS.CONSUMABLES_WRITE, label: "Nhập / điều chỉnh kho VTTH" },
      { code: PERMISSIONS.REFERRERS_WRITE, label: "Quản lý người giới thiệu" },
    ],
  },
  {
    id: "settings",
    label: "Cài đặt hệ thống",
    items: [
      { code: PERMISSIONS.SETTINGS_STAFF, label: "Quản lý tài khoản nhân sự" },
      { code: PERMISSIONS.SETTINGS_CLINICS, label: "Quản lý cơ sở" },
      { code: PERMISSIONS.SETTINGS_BANKS, label: "Quản lý tài khoản ngân hàng" },
    ],
  },
]

export const ALL_PERMISSION_CODES: PermissionCode[] = PERMISSION_GROUPS.flatMap(
  (group) => group.items.map((item) => item.code)
)

const OPS_READ_WRITE: PermissionCode[] = [
  PERMISSIONS.PATIENTS_READ,
  PERMISSIONS.PATIENTS_WRITE,
  PERMISSIONS.VISITS_WRITE,
  PERMISSIONS.APPOINTMENTS_READ,
  PERMISSIONS.APPOINTMENTS_WRITE,
  PERMISSIONS.SERVICES_READ,
  PERMISSIONS.SERVICES_WRITE,
  PERMISSIONS.PAYMENTS_READ,
  PERMISSIONS.TREATMENT_WRITE,
  PERMISSIONS.FOLLOWUPS_WRITE,
  PERMISSIONS.CATALOG_READ,
  PERMISSIONS.MEDICINES_READ,
  PERMISSIONS.FORMULAS_READ,
  PERMISSIONS.CONSUMABLES_READ,
  PERMISSIONS.SHIFTS_READ,
]

/** Default snapshot when picking a role (before per-staff tweaks). */
export const ROLE_DEFAULT_PERMISSIONS: Record<StaffRole, PermissionCode[]> = {
  ADMIN: [...ALL_PERMISSION_CODES],
  DOCTOR: [...OPS_READ_WRITE],
  ASSISTANT: [...OPS_READ_WRITE],
  STAFF: [
    PERMISSIONS.PATIENTS_READ,
    PERMISSIONS.PATIENTS_WRITE,
    PERMISSIONS.APPOINTMENTS_READ,
    PERMISSIONS.APPOINTMENTS_WRITE,
    PERMISSIONS.SERVICES_READ,
    PERMISSIONS.SERVICES_WRITE,
    PERMISSIONS.PAYMENTS_READ,
    PERMISSIONS.PAYMENTS_WRITE,
    PERMISSIONS.FOLLOWUPS_WRITE,
    PERMISSIONS.CATALOG_READ,
    PERMISSIONS.MEDICINES_READ,
    PERMISSIONS.FORMULAS_READ,
    PERMISSIONS.CONSUMABLES_READ,
    PERMISSIONS.CONSUMABLES_WRITE,
    PERMISSIONS.SHIFTS_READ,
    PERMISSIONS.REFERRERS_WRITE,
  ],
}

export function getRoleDefaultPermissions(role: StaffRole): PermissionCode[] {
  return [...ROLE_DEFAULT_PERMISSIONS[role]]
}

export function isPermissionCode(value: string): value is PermissionCode {
  return ALL_PERMISSION_CODES.includes(value as PermissionCode)
}
