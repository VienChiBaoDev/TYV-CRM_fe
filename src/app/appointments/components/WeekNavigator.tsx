import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/UiCustom/PageHeader"

import {
  DAY_END_HOUR,
  DAY_START_HOUR,
  SLOT_MINUTES,
} from "../constants/calendar"
import { formatWeekTitle, shiftWeek } from "../utils/week-range"

interface WeekNavigatorProps {
  anchorDate: Date
  onAnchorChange: (date: Date) => void
  activeClinicName: string
  appointmentCount: number
}

export function WeekNavigator({
  anchorDate,
  onAnchorChange,
  activeClinicName,
  appointmentCount,
}: WeekNavigatorProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:gap-10">
      <PageHeader
        title="Lịch hẹn"
        description={formatWeekTitle(anchorDate)}
        actions={
          <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center lg:ml-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="px-2 sm:px-3"
              aria-label="Tuần trước"
              onClick={() => onAnchorChange(shiftWeek(anchorDate, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Tuần trước</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAnchorChange(new Date())}
            >
              Hôm nay
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="px-2 sm:px-3"
              aria-label="Tuần sau"
              onClick={() => onAnchorChange(shiftWeek(anchorDate, 1))}
            >
              <span className="hidden sm:inline">Tuần sau</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="flex min-w-0 flex-col gap-2 border-t border-border/60 pt-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2 lg:border-t-0 lg:pt-1">
        <div className="flex min-w-0 items-center gap-2">
          <CalendarDays className="size-4 shrink-0" />
          <span className="truncate">
            Cơ sở:{" "}
            <strong className="text-foreground">{activeClinicName}</strong>
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            {String(DAY_START_HOUR).padStart(2, "0")}:00 –{" "}
            {String(DAY_END_HOUR).padStart(2, "0")}:00
          </Badge>

          <Badge variant="outline">
            Lưới{" "}
            {SLOT_MINUTES >= 60
              ? `${SLOT_MINUTES / 60} giờ`
              : `${SLOT_MINUTES} phút`}
          </Badge>

          <Badge variant="secondary">{appointmentCount} lịch trong tuần</Badge>
        </div>
      </div>
    </div>
  )
}
