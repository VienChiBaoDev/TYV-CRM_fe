export const SLOT_MINUTES = 30 as const
export const DAY_START_HOUR = 7
export const DAY_END_HOUR = 18

export const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const

export const APPOINTMENT_STATUS_LABELS = {
  BOOKED: "Đã đặt",
  CONFIRMED: "Xác nhận",
  CHECKED_IN: "Đã đến",
  DONE: "Hoàn tất",
  NO_SHOW: "Không đến",
  CANCELLED: "Đã hủy",
} as const

export const APPOINTMENT_STATUS_OPTIONS = [
  { value: "BOOKED", label: APPOINTMENT_STATUS_LABELS.BOOKED },
  { value: "CONFIRMED", label: APPOINTMENT_STATUS_LABELS.CONFIRMED },
  { value: "CHECKED_IN", label: APPOINTMENT_STATUS_LABELS.CHECKED_IN },
  { value: "DONE", label: APPOINTMENT_STATUS_LABELS.DONE },
  { value: "NO_SHOW", label: APPOINTMENT_STATUS_LABELS.NO_SHOW },
  { value: "CANCELLED", label: APPOINTMENT_STATUS_LABELS.CANCELLED },
] as const

export const APPOINTMENT_STATUS_STYLES: Record<
  keyof typeof APPOINTMENT_STATUS_LABELS,
  string
> = {
  BOOKED: "border-emerald-200 bg-emerald-50 text-emerald-900",
  CONFIRMED: "border-blue-200 bg-blue-50 text-blue-900",
  CHECKED_IN: "border-violet-200 bg-violet-50 text-violet-900",
  DONE: "border-slate-200 bg-slate-100 text-slate-600",
  NO_SHOW: "border-orange-200 bg-orange-50 text-orange-900",
  CANCELLED: "border-red-200 bg-red-50 text-red-700 line-through opacity-70",
}
