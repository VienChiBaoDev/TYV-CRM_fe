import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/UiCustom/PageHeader"

import {
  DAY_END_HOUR,
  DAY_START_HOUR,
  SLOT_MINUTES,
} from "@/app/appointments/constants/calendar"

import { formatWeekTitle, shiftWeek } from "@/app/appointments/utils/week-range"

interface StaffScheduleNavigatorProps {
  anchorDate: Date
  onAnchorChange: (date: Date) => void
  activeClinicName: string
  shiftCount: number
}
/**Thanh điều hướng lịch làm việc của nhân viên. Header tuần + meta cơ sở*/
export function StaffScheduleNavigator({
  anchorDate,
  onAnchorChange,
  activeClinicName,
  shiftCount,
}: StaffScheduleNavigatorProps) {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <PageHeader
        title="Lịch làm việc"
        description={formatWeekTitle(anchorDate)}
        actions={
          <div className="flex flex-wrap items-center gap-2 lg:ml-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
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
              onClick={() => onAnchorChange(shiftWeek(anchorDate, 1))}
            >
              <span className="hidden sm:inline">Tuần sau</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2 pt-1 text-sm text-muted-foreground">
        <CalendarDays className="size-4 shrink-0" />

        <span>
          Cơ sở: <strong className="text-foreground">{activeClinicName}</strong>
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

        <Badge variant="secondary">{shiftCount} ca trong tuần</Badge>
      </div>
    </div>
  )
}
