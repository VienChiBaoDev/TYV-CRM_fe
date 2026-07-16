import type { AppointmentStatus } from "@/app/appointments/services/appointmentService"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_STYLES,
} from "@/app/appointments/constants/calendar"

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus
  className?: string
}

export function AppointmentStatusBadge({
  status,
  className,
}: AppointmentStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto rounded-md px-1.5 py-0 text-[10px] font-medium",
        APPOINTMENT_STATUS_STYLES[status],
        className
      )}
    >
      {APPOINTMENT_STATUS_LABELS[status]}
    </Badge>
  )
}
