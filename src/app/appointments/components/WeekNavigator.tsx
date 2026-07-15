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
  activeBranch: string
  appointmentCount: number
}

export function WeekNavigator({
  anchorDate,
  onAnchorChange,
  activeBranch,
  appointmentCount,
}: WeekNavigatorProps) {
  return (
    <div className="space-y-2">
      <PageHeader
        title="Lịch hẹn"
        description={formatWeekTitle(anchorDate)}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAnchorChange(shiftWeek(anchorDate, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Tuần trước
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
              onClick={() => onAnchorChange(shiftWeek(anchorDate, 1))}
            >
              Tuần sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="size-4 shrink-0" />

        <span>
          Cơ sở: <strong className="text-foreground">{activeBranch}</strong>
        </span>

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
  )
}
