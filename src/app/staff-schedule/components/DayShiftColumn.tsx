import { format } from "date-fns"

import { cn } from "@/lib/utils"

import { TimeSlotCell } from "@/app/appointments/components/TimeSlotCell"

import type { TimeSlot } from "@/app/appointments/utils/time-slots"

import type { StaffShift } from "../services/staffShiftService"

import { layoutShiftsForDay } from "../utils/shift-position"

import { StaffShiftCard } from "./StaffShiftCard"

const LANE_GAP_PX = 2

interface DayShiftColumnProps {
  day: Date
  slots: TimeSlot[]
  shifts: StaffShift[]
  isToday: boolean
  now: Date
  className?: string
  onSlotClick: (hour: number, minute: number) => void
  onShiftClick: (shift: StaffShift) => void
}

/**Cột lịch làm việc của nhân viên.*/
export function DayShiftColumn({
  day,
  slots,
  shifts,
  isToday,
  now,
  className,
  onSlotClick,
  onShiftClick,
}: DayShiftColumnProps) {
  const dayKey = format(day, "yyyy-MM-dd")
  const layouts = layoutShiftsForDay(shifts)

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
            key={layout.shift.id}
            className="pointer-events-auto absolute min-h-[18px] overflow-hidden"
            style={{
              top: `${layout.topPercent}%`,
              height: `${layout.heightPercent}%`,
              left: `calc(${layout.leftPercent}% + ${LANE_GAP_PX / 2}px)`,
              width: `calc(${layout.widthPercent}% - ${LANE_GAP_PX}px)`,
            }}
          >
            <StaffShiftCard
              shift={layout.shift}
              variant="overlay"
              onClick={() => onShiftClick(layout.shift)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
