import { format, isBefore, startOfDay } from "date-fns"

import { Badge } from "@/components/ui/badge"

import { Card, CardContent } from "@/components/ui/card"

import { cn } from "@/lib/utils"

import { CALENDAR_HOUR_ROW_CLASS } from "@/app/appointments/constants/calendar"

import {
  formatDayHeader,
  getWeekDays,
  isSameDay,
} from "@/app/appointments/utils/week-range"

import { buildTimeSlots } from "@/app/appointments/utils/time-slots"

import type { StaffShift } from "../services/staffShiftService"

import { groupShiftsByDay } from "../utils/shift-position"

import { DayShiftColumn } from "./DayShiftColumn"

import { StaffScheduleSkeleton } from "./StaffScheduleSkeleton"

interface StaffScheduleGridProps {
  anchorDate: Date
  shifts: StaffShift[]
  loading: boolean
  onSlotClick: (day: Date, hour: number, minute: number) => void
  onShiftClick: (shift: StaffShift) => void
  className?: string
}

const TIME_SLOTS = buildTimeSlots()

const GRID_STYLE = {
  gridTemplateColumns: "72px repeat(7, minmax(120px, 1fr))",
  gridTemplateRows: "auto minmax(0, 1fr)",
} as const

const CALENDAR_MIN_HEIGHT = "min-h-[calc(100dvh-12rem)]"

/**Lưới lịch làm việc của nhân viên. Grid tuần + tuần được chọn.*/
export function StaffScheduleGrid({
  anchorDate,
  shifts,
  loading,
  onSlotClick,
  onShiftClick,
  className,
}: StaffScheduleGridProps) {
  const weekDays = getWeekDays(anchorDate)
  const dayMap = groupShiftsByDay(shifts)
  const now = new Date()

  return (
    <Card
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden py-0",
        className
      )}
    >
      <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
        <div className="h-full overflow-x-auto overflow-y-auto">
          {loading ? (
            <StaffScheduleSkeleton />
          ) : (
            <div
              className={cn("grid h-full min-w-[900px]", CALENDAR_MIN_HEIGHT)}
              style={GRID_STYLE}
            >
              <div className="sticky left-0 z-20 border-r border-b border-border bg-muted" />

              {weekDays.map((day) => {
                const today = isSameDay(day, now)
                const pastDay = isBefore(day, startOfDay(now))

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "sticky top-0 z-10 border-r border-b border-border bg-muted p-2 text-center text-xs font-semibold",
                      today &&
                        "border-b-2 border-b-primary bg-primary/10 text-primary",
                      !today && pastDay && "text-muted-foreground"
                    )}
                  >
                    <div>{formatDayHeader(day)}</div>

                    {today ? (
                      <Badge className="mt-1 border-primary/20 bg-primary text-primary-foreground">
                        Hôm nay
                      </Badge>
                    ) : null}
                  </div>
                )
              })}

              <div className="sticky left-0 z-10 row-start-2 flex h-full min-h-0 flex-col border-r border-border bg-muted">
                {TIME_SLOTS.map((slot) => (
                  <div
                    key={slot.label}
                    className={cn(
                      "flex items-start border-b border-border px-2 pt-1.5 text-[11px] font-medium text-foreground",
                      CALENDAR_HOUR_ROW_CLASS
                    )}
                  >
                    {slot.label}
                  </div>
                ))}
              </div>

              {weekDays.map((day) => (
                <DayShiftColumn
                  key={day.toISOString()}
                  className="row-start-2"
                  day={day}
                  slots={TIME_SLOTS}
                  shifts={dayMap.get(format(day, "yyyy-MM-dd")) ?? []}
                  isToday={isSameDay(day, now)}
                  now={now}
                  onSlotClick={(hour, minute) => onSlotClick(day, hour, minute)}
                  onShiftClick={onShiftClick}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
