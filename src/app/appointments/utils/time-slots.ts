import {
  DAY_END_HOUR,
  DAY_START_HOUR,
  SLOT_MINUTES,
} from "../constants/calendar"
import {
  buildClinicTimeSlotOptions,
  slotToFormDatetime,
  splitFormDatetime,
  toFormDatetimeValue,
  parseFormDatetime,
} from "@/lib/date-vi"

export interface TimeSlot {
  hour: number
  minute: number
  label: string
}

export function buildTimeSlots(): TimeSlot[] {
  return buildClinicTimeSlotOptions(
    DAY_START_HOUR,
    DAY_END_HOUR,
    SLOT_MINUTES,
  ).map(({ hour, minute, label }) => ({ hour, minute, label }))
}

export function slotToDatetimeLocal(
  day: Date,
  hour: number,
  minute: number,
): string {
  return slotToFormDatetime(day, hour, minute)
}

export function toDatetimeLocalValue(iso: string): string {
  const parsed = parseFormDatetime(iso)
  return parsed ? toFormDatetimeValue(parsed) : ""
}

export { SLOT_MINUTES, splitFormDatetime }
