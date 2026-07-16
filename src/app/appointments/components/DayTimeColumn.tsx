import { format } from "date-fns"

import type { Appointment } from "@/app/appointments/services/appointmentService"

import { cn } from "@/lib/utils"

import { layoutAppointmentsForDay } from "../utils/appointment-position"

import type { TimeSlot } from "../utils/time-slots"

import { AppointmentCard } from "./AppointmentCard"

import { TimeSlotCell } from "./TimeSlotCell"

const LANE_GAP_PX = 2

interface DayTimeColumnProps {
  day: Date
  slots: TimeSlot[]
  appointments: Appointment[]
  isToday: boolean
  now: Date
  className?: string
  onSlotClick: (hour: number, minute: number) => void
  onAppointmentClick: (appointment: Appointment) => void
}

export function DayTimeColumn({
  day,
  slots,
  appointments,
  isToday,
  now,
  className,
  onSlotClick,
  onAppointmentClick,
}: DayTimeColumnProps) {
  const dayKey = format(day, "yyyy-MM-dd")
  const layouts = layoutAppointmentsForDay(appointments)

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col border-r border-border",
        isToday && "bg-primary/[0.07]",
        className
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {slots.map((slot) => {
          const slotDate = new Date(day)
          slotDate.setHours(slot.hour, slot.minute, 0, 0)

          return (
            <TimeSlotCell
              key={`${dayKey}-${slot.label}`}
              isPast={slotDate < now}
              onEmptyClick={() => onSlotClick(slot.hour, slot.minute)}
            />
          )
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 z-1 px-0.5">
        {layouts.map((layout) => (
          <div
            key={layout.appointment.id}
            className="pointer-events-auto absolute min-h-[18px] overflow-hidden"
            style={{
              top: `${layout.topPercent}%`,
              height: `${layout.heightPercent}%`,
              left: `calc(${layout.leftPercent}% + ${LANE_GAP_PX / 2}px)`,
              width: `calc(${layout.widthPercent}% - ${LANE_GAP_PX}px)`,
            }}
          >
            <AppointmentCard
              appointment={layout.appointment}
              variant="overlay"
              onClick={() => onAppointmentClick(layout.appointment)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
