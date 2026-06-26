import {
  addWeeks,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  startOfWeek,
} from "date-fns"

import { viLocale, VI_WEEK_STARTS_ON } from "@/lib/date-vi"

const WEEK_OPTS = { weekStartsOn: VI_WEEK_STARTS_ON }

export function getWeekRange(anchorDate: Date) {
  const start = startOfWeek(anchorDate, WEEK_OPTS)
  const end = endOfWeek(anchorDate, WEEK_OPTS)
  return { start, end }
}

export function getWeekDays(anchorDate: Date): Date[] {
  const { start, end } = getWeekRange(anchorDate)
  return eachDayOfInterval({ start, end })
}

export function formatWeekTitle(anchorDate: Date): string {
  const { start, end } = getWeekRange(anchorDate)
  return `${format(start, "dd/MM", { locale: viLocale })} – ${format(end, "dd/MM/yyyy", { locale: viLocale })}`
}

export function formatDayHeader(day: Date): string {
  const weekdayIndex = (day.getDay() + 6) % 7
  const labels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
  return `${labels[weekdayIndex]}, ${format(day, "dd/MM", { locale: viLocale })}`
}

export function toApiRangeIso(start: Date, end: Date) {
  const from = new Date(start)
  from.setHours(0, 0, 0, 0)
  const to = new Date(end)
  to.setHours(23, 59, 59, 999)
  return { from: from.toISOString(), to: to.toISOString() }
}

export function shiftWeek(anchorDate: Date, weeks: number): Date {
  return addWeeks(anchorDate, weeks)
}

export { isSameDay }
