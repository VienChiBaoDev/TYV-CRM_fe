import { Skeleton } from "@/components/ui/skeleton"

import { cn } from "@/lib/utils"

import {
  CALENDAR_HOUR_ROW_CLASS,
  getCalendarRowCount,
} from "../constants/calendar"

const SKELETON_ROWS = getCalendarRowCount()
const SKELETON_DAYS = 7

const GRID_STYLE = {
  gridTemplateColumns: "72px repeat(7, minmax(120px, 1fr))",
  gridTemplateRows: "auto minmax(0, 1fr)",
} as const

const CALENDAR_MIN_HEIGHT = "min-h-[calc(100dvh-10.5rem)]"

export function WeeklyCalendarSkeleton() {
  return (
    <div
      className={cn("grid h-full min-w-[900px] bg-white", CALENDAR_MIN_HEIGHT)}
      style={GRID_STYLE}
    >
      <Skeleton className="h-10 rounded-none" />
      {Array.from({ length: SKELETON_DAYS }).map((_, index) => (
        <Skeleton key={`header-${index}`} className="h-10 rounded-none" />
      ))}

      <div className="row-start-2 flex h-full min-h-0 flex-col border-r border-border">
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <Skeleton
            key={`time-${index}`}
            className={cn("rounded-none", CALENDAR_HOUR_ROW_CLASS)}
          />
        ))}
      </div>

      {Array.from({ length: SKELETON_DAYS }).map((_, dayIndex) => (
        <div
          key={`day-${dayIndex}`}
          className="row-start-2 flex h-full min-h-0 flex-col"
        >
          {Array.from({ length: SKELETON_ROWS }).map((__, rowIndex) => (
            <Skeleton
              key={`cell-${dayIndex}-${rowIndex}`}
              className={cn("rounded-none", CALENDAR_HOUR_ROW_CLASS)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
