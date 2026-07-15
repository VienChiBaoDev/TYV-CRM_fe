import { cn } from "@/lib/utils"

import { CALENDAR_HOUR_ROW_CLASS } from "../constants/calendar"

interface TimeSlotCellProps {
  isPast: boolean
  isToday: boolean
  onEmptyClick: () => void
}

export function TimeSlotCell({
  isPast,
  isToday,
  onEmptyClick,
}: TimeSlotCellProps) {
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
        "group relative border-b border-border transition-colors",
        CALENDAR_HOUR_ROW_CLASS,
        isToday && "bg-primary/5",
        isPast
          ? "cursor-default bg-muted/40"
          : "cursor-pointer hover:bg-primary/10 hover:ring-1 hover:ring-primary/20 hover:ring-inset"
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-border/35" />
      <span className="sr-only">Đặt lịch</span>
    </div>
  )
}
