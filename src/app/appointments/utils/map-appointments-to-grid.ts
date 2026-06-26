import type { Appointment } from "@/app/medical-records/data/appointmentService"
import { SLOT_MINUTES } from "../constants/calendar"

export type SlotKey = string

function pad(value: number): string {
  return String(value).padStart(2, "0")
}

export function getSlotKey(date: Date, hour: number, minute: number): SlotKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}|${pad(hour)}:${pad(minute)}`
}

function snapToSlot(date: Date): { hour: number; minute: number } {
  const totalMinutes = date.getHours() * 60 + date.getMinutes()
  const snapped = Math.floor(totalMinutes / SLOT_MINUTES) * SLOT_MINUTES
  return {
    hour: Math.floor(snapped / 60),
    minute: snapped % 60,
  }
}

export function groupAppointmentsBySlot(
  appointments: Appointment[],
): Map<SlotKey, Appointment[]> {
  const map = new Map<SlotKey, Appointment[]>()

  for (const appointment of appointments) {
    const scheduled = new Date(appointment.scheduledAt)
    const { hour, minute } = snapToSlot(scheduled)
    const key = getSlotKey(scheduled, hour, minute)
    const list = map.get(key) ?? []
    list.push(appointment)
    map.set(key, list)
  }

  return map
}
