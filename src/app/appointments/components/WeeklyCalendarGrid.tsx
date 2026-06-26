import { Badge } from "@/components/ui/badge"

import { Card, CardContent } from "@/components/ui/card"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { cn } from "@/lib/utils"

import type { Appointment } from "@/app/medical-records/data/appointmentService"

import { formatDayHeader, getWeekDays, isSameDay } from "../utils/week-range"

import { buildTimeSlots } from "../utils/time-slots"

import {
  getSlotKey,
  groupAppointmentsBySlot,
} from "../utils/map-appointments-to-grid"

import { TimeSlotCell } from "./TimeSlotCell"

import { WeeklyCalendarSkeleton } from "./WeeklyCalendarSkeleton"

interface WeeklyCalendarGridProps {
  anchorDate: Date

  appointments: Appointment[]

  loading: boolean

  onSlotClick: (day: Date, hour: number, minute: number) => void

  onAppointmentClick: (appointment: Appointment) => void
}

const TIME_SLOTS = buildTimeSlots()

export function WeeklyCalendarGrid({
  anchorDate,

  appointments,

  loading,

  onSlotClick,

  onAppointmentClick,
}: WeeklyCalendarGridProps) {
  const weekDays = getWeekDays(anchorDate)

  const slotMap = groupAppointmentsBySlot(appointments)

  const now = new Date()

  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          {loading ? (
            <WeeklyCalendarSkeleton />
          ) : (
            <div
              className="grid min-w-[900px]"
              style={{
                gridTemplateColumns: "72px repeat(7, minmax(120px, 1fr))",
              }}
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

              {TIME_SLOTS.map((slot) => (
                <div key={slot.label} className="contents">
                  <div className="sticky left-0 z-10 border-r border-b border-border bg-muted px-2 py-3 text-xs text-muted-foreground">
                    {slot.label}
                  </div>

                  {weekDays.map((day) => {
                    const slotDate = new Date(day)

                    slotDate.setHours(slot.hour, slot.minute, 0, 0)

                    const isPast = slotDate < now

                    const isToday = isSameDay(day, now)

                    const key = getSlotKey(day, slot.hour, slot.minute)

                    return (
                      <TimeSlotCell
                        key={`${key}-${slot.label}`}
                        day={day}
                        slot={slot}
                        appointments={slotMap.get(key) ?? []}
                        isPast={isPast}
                        isToday={isToday}
                        onEmptyClick={() =>
                          onSlotClick(day, slot.hour, slot.minute)
                        }
                        onAppointmentClick={onAppointmentClick}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          )}

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
