import type { StaffShiftType } from "../services/staffShiftService"

export const STAFF_SHIFT_TYPE_LABELS: Record<StaffShiftType, string> = {
  WORK: "Ca làm",
  OFF: "Nghỉ",
}

export const STAFF_SHIFT_STYLES: Record<StaffShiftType, string> = {
  WORK: "border-emerald-200 bg-emerald-50 text-emerald-900",
  OFF: "border-slate-200 bg-slate-100 text-slate-600",
}
