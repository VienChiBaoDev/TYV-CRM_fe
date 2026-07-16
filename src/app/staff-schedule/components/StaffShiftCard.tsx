import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatAppointmentTimeRangeVi } from "@/lib/date-vi"
import type { StaffShift } from "../services/staffShiftService"
import {
  STAFF_SHIFT_STYLES,
  STAFF_SHIFT_TYPE_LABELS,
} from "../constants/shift-styles"

interface StaffShiftCardProps {
  shift: StaffShift
  variant?: "default" | "overlay"
  onClick: () => void
}

/**Thẻ ca làm việc của nhân viên.*/
export function StaffShiftCard({
  shift,
  variant = "default",
  onClick,
}: StaffShiftCardProps) {
  const isOverlay = variant === "overlay"

  return (
    <Card
      size="sm"
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        "cursor-pointer shadow-none ring-0 transition-colors hover:brightness-95",
        isOverlay ? "h-full min-h-0 overflow-hidden py-1" : "py-1.5",
        STAFF_SHIFT_STYLES[shift.type]
      )}
    >
      <p className="truncate px-1.5 text-[11px] font-semibold sm:px-2">
        {STAFF_SHIFT_TYPE_LABELS[shift.type]}
      </p>
      <p className="truncate px-1.5 text-[10px] opacity-80 sm:px-2">
        {formatAppointmentTimeRangeVi(shift.startAt, shift.endAt)}
      </p>
      {shift.note ? (
        <p className="truncate px-1.5 text-[10px] opacity-70 sm:px-2">
          {shift.note}
        </p>
      ) : null}
    </Card>
  )
}
