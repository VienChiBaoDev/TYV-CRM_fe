import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"

import { Card, CardContent } from "@/components/ui/card"

import { cn } from "@/lib/utils"

import type { Appointment } from "@/app/appointments/services/appointmentService"

import { formatDayHeader, getWeekDays, isSameDay } from "../utils/week-range"

import { buildTimeSlots } from "../utils/time-slots"

import { groupAppointmentsByDay } from "../utils/appointment-position"

import { CALENDAR_HOUR_ROW_CLASS } from "../constants/calendar"

import { DayTimeColumn } from "./DayTimeColumn"

import { WeeklyCalendarSkeleton } from "./WeeklyCalendarSkeleton"

interface WeeklyCalendarGridProps {
  anchorDate: Date

  appointments: Appointment[]

  loading: boolean

  onSlotClick: (day: Date, hour: number, minute: number) => void

  onAppointmentClick: (appointment: Appointment) => void

  className?: string
}

const TIME_SLOTS = buildTimeSlots()

const GRID_STYLE = {
  gridTemplateColumns: "72px repeat(7, minmax(120px, 1fr))",
  gridTemplateRows: "auto minmax(0, 1fr)",
} as const

/** ponytail: min-height ≈ viewport minus header chrome; overflow-y if taller */
const CALENDAR_MIN_HEIGHT = "min-h-[calc(100dvh-10.5rem)]"

export function WeeklyCalendarGrid({
  anchorDate,

  appointments,

  loading,

  onSlotClick,

  onAppointmentClick,

  className,
}: WeeklyCalendarGridProps) {
  const weekDays = getWeekDays(anchorDate)

  const dayMap = groupAppointmentsByDay(appointments)

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
            <WeeklyCalendarSkeleton />
          ) : (
            <div
              className={cn("grid h-full min-w-[900px]", CALENDAR_MIN_HEIGHT)}
              style={GRID_STYLE}
            >
                <div className="sticky left-0 z-20 border-r border-b border-border bg-muted" />

                {weekDays.map((day) => {
                  const today = isSameDay(day, now)

                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "sticky top-0 z-10 border-r border-b border-border bg-muted p-2 text-center text-xs font-semibold",

                        today && "bg-primary/10 text-primary"
                      )}
                    >
                      <div>{formatDayHeader(day)}</div>

                      {today ? (
                        <Badge variant="secondary" className="mt-1">
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
                  <DayTimeColumn
                    key={day.toISOString()}
                    className="row-start-2"
                    day={day}
                    slots={TIME_SLOTS}
                    appointments={dayMap.get(format(day, "yyyy-MM-dd")) ?? []}
                    isToday={isSameDay(day, now)}
                    now={now}
                    onSlotClick={(hour, minute) =>
                      onSlotClick(day, hour, minute)
                    }
                    onAppointmentClick={onAppointmentClick}
                  />
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
