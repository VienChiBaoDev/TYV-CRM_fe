export const CLINIC_BRANCHES = [
  { code: "HANG_BONG", label: "Hàng Bông", emoji: "🌸" },
  { code: "CAU_GIAY", label: "Cầu Giấy", emoji: "🌿" },
] as const

export type ClinicBranchCode = (typeof CLINIC_BRANCHES)[number]["code"]
export type ClinicBranchLabel = (typeof CLINIC_BRANCHES)[number]["label"]
