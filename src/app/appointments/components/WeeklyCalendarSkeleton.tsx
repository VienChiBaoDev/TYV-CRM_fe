import { Skeleton } from "@/components/ui/skeleton"

import { getCalendarRowCount } from "../constants/calendar"

const SKELETON_ROWS = getCalendarRowCount()
const SKELETON_DAYS = 7

export function WeeklyCalendarSkeleton() {
  return (
    <div
      className="grid min-w-[900px] bg-white p-4"
      style={{ gridTemplateColumns: "72px repeat(7, minmax(120px, 1fr))" }}
    >
      <Skeleton className="h-10 rounded-none" />
      {Array.from({ length: SKELETON_DAYS }).map((_, index) => (
        <Skeleton key={`header-${index}`} className="h-10 rounded-none" />
      ))}

      {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="contents">
          <Skeleton className="mt-2 min-h-10 rounded-none" />
          {Array.from({ length: SKELETON_DAYS }).map((__, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="mt-2 min-h-10 rounded-none"
            />
          ))}
        </div>
      ))}
    </div>
  )
}
