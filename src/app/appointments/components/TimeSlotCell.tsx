import { cn } from "@/lib/utils"

import { CALENDAR_HOUR_ROW_CLASS } from "../constants/calendar"

interface TimeSlotCellProps {
  isPast: boolean
  onEmptyClick: () => void
}

export function TimeSlotCell({ isPast, onEmptyClick }: TimeSlotCellProps) {
  return (
    <div
      role={isPast ? undefined : "button"}
      tabIndex={isPast ? -1 : 0}
      aria-disabled={isPast || undefined}
      onClick={isPast ? undefined : onEmptyClick}
      onKeyDown={
        isPast
          ? undefined
          : (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onEmptyClick()
              }
            }
      }
      className={cn(
        "group relative border-b border-border transition-colors",
        CALENDAR_HOUR_ROW_CLASS,
        isPast
          ? "cursor-not-allowed bg-muted/30"
          : "cursor-pointer hover:bg-primary/10 hover:ring-1 hover:ring-primary/25 hover:ring-inset"
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-border/35" />
      {!isPast ? <span className="sr-only">Đặt lịch</span> : null}
    </div>
  )
}
