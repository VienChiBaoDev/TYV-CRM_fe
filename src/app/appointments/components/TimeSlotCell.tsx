import type { Appointment } from "@/app/medical-records/data/appointmentService"

import { Badge } from "@/components/ui/badge"

import { cn } from "@/lib/utils"

import type { TimeSlot } from "../utils/time-slots"

import { getSlotKey } from "../utils/map-appointments-to-grid"

import { AppointmentCard } from "./AppointmentCard"

interface TimeSlotCellProps {
  day: Date

  slot: TimeSlot

  appointments: Appointment[]

  isPast: boolean

  isToday: boolean

  onEmptyClick: () => void

  onAppointmentClick: (appointment: Appointment) => void
}

const MAX_VISIBLE_APPOINTMENTS = 2

export function TimeSlotCell({
  day,

  slot,

  appointments,

  isPast,

  isToday,

  onEmptyClick,

  onAppointmentClick,
}: TimeSlotCellProps) {
  const slotKey = getSlotKey(day, slot.hour, slot.minute)

  const visible = appointments.slice(0, MAX_VISIBLE_APPOINTMENTS)

  const hiddenCount = appointments.length - visible.length

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEmptyClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()

          onEmptyClick()
        }
      }}
      className={cn(
        "group min-h-14 border-r border-b border-border p-1 transition-colors",

        isToday && "bg-primary/5",

        isPast
          ? "cursor-default bg-muted/40"
          : "cursor-pointer hover:bg-primary/10",

        appointments.length === 0 &&
          !isPast &&
          "hover:ring-1 hover:ring-primary/20 hover:ring-inset"
      )}
      data-slot-key={slotKey}
    >
      <div className="flex h-full flex-col gap-1">
        {visible.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onClick={() => onAppointmentClick(appointment)}
          />
        ))}

        {hiddenCount > 0 ? (
          <Badge variant="secondary" className="w-fit text-[10px]">
            +{hiddenCount} lịch
          </Badge>
        ) : null}

        {appointments.length === 0 && !isPast ? (
          <span className="mt-auto hidden px-1 text-[10px] text-muted-foreground group-hover:inline">
            + Đặt lịch
          </span>
        ) : null}
      </div>
    </div>
  )
}
