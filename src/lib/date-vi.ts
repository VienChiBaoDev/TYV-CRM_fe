import { format, isValid, parse } from "date-fns"
import { vi } from "date-fns/locale"

/** Hiển thị: 26/06/2026 */
export const VI_DATE_FORMAT = "dd/MM/yyyy"

/** Hiển thị: 26/06/2026 09:30 */
export const VI_DATETIME_FORMAT = "dd/MM/yyyy HH:mm"

/** Giá trị form/API: 2026-06-26 */
export const ISO_DATE_FORMAT = "yyyy-MM-dd"

/** Giá trị form datetime local: 2026-06-26T09:30 */
export const FORM_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm"

/** BE display: `09:30 26-06-2026` */
export const BE_DISPLAY_DATETIME_FORMAT = "HH:mm dd-MM-yyyy"

export const VI_WEEK_STARTS_ON = 1 as const

export const DEFAULT_CLINIC_START_HOUR = 7
export const DEFAULT_CLINIC_END_HOUR = 18
export const DEFAULT_SLOT_MINUTES = 30

export interface TimeSlotOption {
  hour: number
  minute: number
  label: string
  value: string
}
/**Hàm này dùng để tạo các time slot cho lịch làm việc.*/
export function buildClinicTimeSlotOptions(
  startHour = DEFAULT_CLINIC_START_HOUR,
  endHour = DEFAULT_CLINIC_END_HOUR,
  stepMinutes = DEFAULT_SLOT_MINUTES
): TimeSlotOption[] {
  const slots: TimeSlotOption[] = []

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += stepMinutes) {
      const label = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
      slots.push({ hour, minute, label, value: label })
    }
  }

  return slots
}

export function parseDisplayDatetime(value: string): Date | undefined {
  if (!value) return undefined

  const fromDisplay = parse(value, BE_DISPLAY_DATETIME_FORMAT, new Date())
  if (isValid(fromDisplay)) return fromDisplay

  return parseFormDatetime(value)
}

export function formatDateVi(input: Date | string): string {
  const date = typeof input === "string" ? parseDisplayDatetime(input) : input
  if (!date || !isValid(date)) return ""
  return format(date, VI_DATE_FORMAT, { locale: vi })
}

export function formatDatetimeVi(input: Date | string): string {
  const date = typeof input === "string" ? parseDisplayDatetime(input) : input
  if (!date || !isValid(date)) return ""
  return format(date, VI_DATETIME_FORMAT, { locale: vi })
}

export function formatIsoDateToVi(isoDate: string): string {
  const [year, month, day] = isoDate.split("-")
  if (!year || !month || !day) return isoDate
  return `${day}/${month}/${year}`
}

export function toIsoDate(date: Date): string {
  return format(date, ISO_DATE_FORMAT)
}

export function parseIsoDate(isoDate: string): Date | undefined {
  const parsed = parse(isoDate, ISO_DATE_FORMAT, new Date())
  return isValid(parsed) ? parsed : undefined
}

export function toFormDatetimeValue(date: Date): string {
  return format(date, FORM_DATETIME_FORMAT)
}

export function parseFormDatetime(value: string): Date | undefined {
  if (!value) return undefined

  const fromForm = parse(value, FORM_DATETIME_FORMAT, new Date())
  if (isValid(fromForm)) return fromForm

  const fromIso = new Date(value)
  return isValid(fromIso) ? fromIso : undefined
}

export function combineDateAndTime(
  date: Date,
  hour: number,
  minute: number
): Date {
  const combined = new Date(date)
  combined.setHours(hour, minute, 0, 0)
  return combined
}

export function splitFormDatetime(value: string): {
  date: Date | undefined
  timeValue: string
} {
  const parsed = parseFormDatetime(value)
  if (!parsed) {
    return { date: undefined, timeValue: "09:00" }
  }

  const hour = String(parsed.getHours()).padStart(2, "0")
  const minute = String(parsed.getMinutes()).padStart(2, "0")

  return {
    date: parsed,
    timeValue: `${hour}:${minute}`,
  }
}

// Chuyển đổi slot thành giá trị form datetime
export function slotToFormDatetime(
  day: Date,
  hour: number,
  minute: number
): string {
  // Kết hợp ngày và thời gian
  return toFormDatetimeValue(combineDateAndTime(day, hour, minute))
}

export function addMinutesToFormDatetime(
  value: string,
  minutes: number
): string {
  const parsed = parseFormDatetime(value)
  if (!parsed) return ""
  const next = new Date(parsed)
  next.setMinutes(next.getMinutes() + minutes)
  return toFormDatetimeValue(next)
}

export function formatTimeVi(input: Date | string): string {
  const date = typeof input === "string" ? parseDisplayDatetime(input) : input
  if (!date || !isValid(date)) return ""
  return format(date, "HH:mm")
}

export function formatAppointmentTimeRangeVi(
  start: string,
  end: string
): string {
  return `${formatTimeVi(start)} – ${formatTimeVi(end)}`
}

/** BE display: `09:30 26-06-2026` → form ISO date `2026-06-26` */
export function parseDisplayDatetimeToIsoDate(value: string): string {
  if (!value) return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  const parsed = parseDisplayDatetime(value)
  return parsed ? toIsoDate(parsed) : ""
}

/** Form ISO date → ISO8601 datetime for API */
export function isoDateToApiDatetime(isoDate: string): string {
  return `${isoDate}T00:00:00.000Z`
}

/** Form ISO date → ISO8601 datetime for API (end of day) */
export function isoDateToApiDatetimeEndOfDay(isoDate: string): string {
  return `${isoDate}T23:59:59.999Z`
}

export { vi as viLocale }
