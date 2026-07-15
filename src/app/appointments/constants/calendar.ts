import type { AppointmentStatus } from "@/app/appointments/services/appointmentService"

export const SLOT_MINUTES = 60 as const
export const DAY_START_HOUR = 7
export const DAY_END_HOUR = 18
/** flex-1 + min height — rows stretch to fill viewport (see WeeklyCalendarGrid). */
export const CALENDAR_HOUR_ROW_CLASS = "min-h-14 flex-1" as const
export const DEFAULT_APPOINTMENT_DURATION_MINUTES = 30 as const

export function getCalendarRowCount(): number {
  return ((DAY_END_HOUR - DAY_START_HOUR) * 60) / SLOT_MINUTES
}

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

/**
 * Mirror of BE `appointment-status.rules.ts` — keep in sync when rules change.
 */
const CHECK_IN_ALLOWED_STATUSES = new Set<AppointmentStatus>([
  "BOOKED",
  "CONFIRMED",
])

const CANCEL_ALLOWED_STATUSES = new Set<AppointmentStatus>([
  "BOOKED",
  "CONFIRMED",
])

const PRE_CHECK_IN_EDITABLE_STATUSES = new Set<AppointmentStatus>([
  "BOOKED",
  "CONFIRMED",
  "NO_SHOW",
])

const POST_CHECK_IN_EDITABLE_STATUSES = new Set<AppointmentStatus>([
  "CHECKED_IN",
  "DONE",
])

const TERMINAL_STATUSES = new Set<AppointmentStatus>([
  "DONE",
  "NO_SHOW",
  "CANCELLED",
])

export function canCheckInAppointment(
  status: AppointmentStatus,
  visitId: string | null,
): boolean {
  return !visitId && CHECK_IN_ALLOWED_STATUSES.has(status)
}

export function canCancelAppointment(status: AppointmentStatus): boolean {
  return CANCEL_ALLOWED_STATUSES.has(status)
}

/** Dropdown options — excludes CHECKED_IN (check-in) and CANCELLED (cancel button). */
export function getEditableStatusOptions(
  currentStatus: AppointmentStatus,
  visitId: string | null,
) {
  if (TERMINAL_STATUSES.has(currentStatus)) {
    return []
  }

  const allowed =
    visitId || currentStatus === "CHECKED_IN"
      ? POST_CHECK_IN_EDITABLE_STATUSES
      : PRE_CHECK_IN_EDITABLE_STATUSES

  return APPOINTMENT_STATUS_OPTIONS.filter((o) => allowed.has(o.value))
}

export function isStatusFieldReadOnly(status: AppointmentStatus): boolean {
  return TERMINAL_STATUSES.has(status)
}

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
