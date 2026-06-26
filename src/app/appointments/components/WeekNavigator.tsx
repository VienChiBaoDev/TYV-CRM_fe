import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/UiCustom/PageHeader"
import { formatWeekTitle, shiftWeek } from "../utils/week-range"

interface WeekNavigatorProps {
  anchorDate: Date
  onAnchorChange: (date: Date) => void
}

export function WeekNavigator({
  anchorDate,
  onAnchorChange,
}: WeekNavigatorProps) {
  return (
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
  )
}
