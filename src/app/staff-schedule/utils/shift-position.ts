import { format } from "date-fns"

import {
  DAY_END_HOUR,
  DAY_START_HOUR,
  DEFAULT_APPOINTMENT_DURATION_MINUTES,
} from "@/app/appointments/constants/calendar"

import type { StaffShift } from "../services/staffShiftService"

const DAY_START_MINUTES = DAY_START_HOUR * 60
const DAY_END_MINUTES = DAY_END_HOUR * 60
const DAY_SPAN_MINUTES = DAY_END_MINUTES - DAY_START_MINUTES

export interface ShiftPosition {
  topPercent: number
  heightPercent: number
}

export interface ShiftLayout extends ShiftPosition {
  shift: StaffShift
  leftPercent: number
  widthPercent: number
}

interface TimedShift {
  shift: StaffShift
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

/**Hàm này dùng để tính toán khoảng thời gian của một ca làm sau khi cắt giới hạn.*/
function getClippedRange(
  startAt: string,
  endAt?: string | null
): { startMin: number; endMin: number } | null {
  const startMin = minutesSinceMidnight(new Date(startAt))
  const endMin = endAt
    ? minutesSinceMidnight(new Date(endAt))
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

/**Hàm này dùng để tính toán vị trí của một ca làm trên một ngày.*/
function getShiftPosition(
  startAt: string,
  endAt?: string | null
): ShiftPosition | null {
  const range = getClippedRange(startAt, endAt)
  if (!range) return null

  return {
    topPercent: ((range.startMin - DAY_START_MINUTES) / DAY_SPAN_MINUTES) * 100,
    heightPercent: ((range.endMin - range.startMin) / DAY_SPAN_MINUTES) * 100,
  }
}

/**Hàm này dùng để chuyển đổi một ca làm thành một đối tượng TimedShift.*/
function toTimedShift(shift: StaffShift): TimedShift | null {
  const range = getClippedRange(shift.startAt, shift.endAt)
  const position = getShiftPosition(shift.startAt, shift.endAt)

  if (!range || !position) return null

  return {
    shift,
    startMin: range.startMin,
    endMin: range.endMin,
    topPercent: position.topPercent,
    heightPercent: position.heightPercent,
    column: 0,
    columnSpan: 1,
  }
}

/**Hàm này dùng để tạo các cluster của các ca làm trong cùng một ngày.*/
function buildOverlapClusters(events: TimedShift[]): TimedShift[][] {
  const sorted = [...events].sort((a, b) => a.startMin - b.startMin)
  const clusters: TimedShift[][] = []
  let current: TimedShift[] = []
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

/**Hàm này dùng để gán cột cho các ca làm trong cùng một cluster.*/
function assignOverlapColumns(cluster: TimedShift[]): number {
  const sorted = [...cluster].sort(
    (a, b) =>
      a.startMin - b.startMin || b.endMin - b.startMin - (a.endMin - a.startMin)
  )
  const columns: TimedShift[][] = []

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

/**Hàm này dùng để tính toán vị trí của các ca làm trên một ngày.*/
export function layoutShiftsForDay(shifts: StaffShift[]): ShiftLayout[] {
  const timed = shifts
    .map(toTimedShift)
    .filter((event): event is TimedShift => event !== null)

  const layouts: ShiftLayout[] = []

  for (const cluster of buildOverlapClusters(timed)) {
    const totalColumns = assignOverlapColumns(cluster)

    for (const event of cluster) {
      layouts.push({
        shift: event.shift,
        topPercent: event.topPercent,
        heightPercent: event.heightPercent,
        leftPercent: (event.column / totalColumns) * 100,
        widthPercent: (event.columnSpan / totalColumns) * 100,
      })
    }
  }

  return layouts
}

/**Hàm này dùng để nhóm các ca làm theo ngày.*/
export function groupShiftsByDay(
  shifts: StaffShift[]
): Map<string, StaffShift[]> {
  const map = new Map<string, StaffShift[]>()

  for (const shift of shifts) {
    const key = format(new Date(shift.startAt), "yyyy-MM-dd")
    const list = map.get(key) ?? []
    list.push(shift)
    map.set(key, list)
  }

  return map
}
