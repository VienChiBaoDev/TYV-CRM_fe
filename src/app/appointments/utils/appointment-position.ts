import { format } from "date-fns"

import type { Appointment } from "@/app/appointments/services/appointmentService"

import {
  DAY_END_HOUR,
  DAY_START_HOUR,
  DEFAULT_APPOINTMENT_DURATION_MINUTES,
} from "../constants/calendar"

const DAY_START_MINUTES = DAY_START_HOUR * 60
const DAY_END_MINUTES = DAY_END_HOUR * 60
const DAY_SPAN_MINUTES = DAY_END_MINUTES - DAY_START_MINUTES

export interface AppointmentPosition {
  topPercent: number
  heightPercent: number
}

export interface AppointmentLayout extends AppointmentPosition {
  appointment: Appointment
  leftPercent: number
  widthPercent: number
}

interface TimedAppointment {
  appointment: Appointment
  startMin: number
  endMin: number
  topPercent: number
  heightPercent: number
  column: number
  columnSpan: number
}

function minutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes()
}

function getClippedRange(
  scheduledAt: string,
  endedAt?: string | null
): { startMin: number; endMin: number } | null {
  const startMin = minutesSinceMidnight(new Date(scheduledAt))
  const endMin = endedAt
    ? minutesSinceMidnight(new Date(endedAt))
    : startMin + DEFAULT_APPOINTMENT_DURATION_MINUTES

  const clippedStart = Math.max(startMin, DAY_START_MINUTES)
  const clippedEnd = Math.min(endMin, DAY_END_MINUTES)

  if (clippedEnd <= clippedStart) return null

  return { startMin: clippedStart, endMin: clippedEnd }
}

function overlaps(
  a: { startMin: number; endMin: number },
  b: { startMin: number; endMin: number }
): boolean {
  return a.startMin < b.endMin && b.startMin < a.endMin
}

export function getAppointmentPosition(
  scheduledAt: string,
  endedAt?: string | null
): AppointmentPosition | null {
  const range = getClippedRange(scheduledAt, endedAt)
  if (!range) return null

  return {
    topPercent:
      ((range.startMin - DAY_START_MINUTES) / DAY_SPAN_MINUTES) * 100,
    heightPercent: ((range.endMin - range.startMin) / DAY_SPAN_MINUTES) * 100,
  }
}

function toTimedAppointment(appointment: Appointment): TimedAppointment | null {
  const range = getClippedRange(appointment.scheduledAt, appointment.endedAt)
  const position = getAppointmentPosition(
    appointment.scheduledAt,
    appointment.endedAt
  )

  if (!range || !position) return null

  return {
    appointment,
    startMin: range.startMin,
    endMin: range.endMin,
    topPercent: position.topPercent,
    heightPercent: position.heightPercent,
    column: 0,
    columnSpan: 1,
  }
}

function buildOverlapClusters(events: TimedAppointment[]): TimedAppointment[][] {
  const sorted = [...events].sort((a, b) => a.startMin - b.startMin)
  const clusters: TimedAppointment[][] = []
  let current: TimedAppointment[] = []
  let clusterEnd = -1

  for (const event of sorted) {
    if (current.length === 0 || event.startMin < clusterEnd) {
      current.push(event)
      clusterEnd = Math.max(clusterEnd, event.endMin)
    } else {
      clusters.push(current)
      current = [event]
      clusterEnd = event.endMin
    }
  }

  if (current.length > 0) clusters.push(current)

  return clusters
}

function assignOverlapColumns(cluster: TimedAppointment[]): number {
  const sorted = [...cluster].sort(
    (a, b) =>
      a.startMin - b.startMin ||
      b.endMin - b.startMin - (a.endMin - a.startMin)
  )
  const columns: TimedAppointment[][] = []

  for (const event of sorted) {
    let lane = 0
    while (
      lane < columns.length &&
      columns[lane].some((other) => overlaps(other, event))
    ) {
      lane++
    }

    if (!columns[lane]) columns[lane] = []
    columns[lane].push(event)
    event.column = lane
  }

  const totalColumns = columns.length

  for (const event of cluster) {
    let span = 1
    for (let col = event.column + 1; col < totalColumns; col++) {
      const blocked = cluster.some(
        (other) => other.column === col && overlaps(other, event)
      )
      if (blocked) break
      span++
    }
    event.columnSpan = span
  }

  return totalColumns
}

/** Google Calendar-style side-by-side lanes for overlapping appointments. */
export function layoutAppointmentsForDay(
  appointments: Appointment[]
): AppointmentLayout[] {
  const timed = appointments
    .map(toTimedAppointment)
    .filter((event): event is TimedAppointment => event !== null)

  const layouts: AppointmentLayout[] = []

  for (const cluster of buildOverlapClusters(timed)) {
    const totalColumns = assignOverlapColumns(cluster)

    for (const event of cluster) {
      layouts.push({
        appointment: event.appointment,
        topPercent: event.topPercent,
        heightPercent: event.heightPercent,
        leftPercent: (event.column / totalColumns) * 100,
        widthPercent: (event.columnSpan / totalColumns) * 100,
      })
    }
  }

  return layouts
}

export function groupAppointmentsByDay(
  appointments: Appointment[]
): Map<string, Appointment[]> {
  const map = new Map<string, Appointment[]>()

  for (const appointment of appointments) {
    const key = format(new Date(appointment.scheduledAt), "yyyy-MM-dd")
    const list = map.get(key) ?? []
    list.push(appointment)
    map.set(key, list)
  }

  return map
}
