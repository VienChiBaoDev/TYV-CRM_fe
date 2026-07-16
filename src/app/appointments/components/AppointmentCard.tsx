import { Link } from "react-router-dom"

import type { Appointment } from "@/app/appointments/services/appointmentService"

import { AppointmentStatusBadge } from "@/components/UiCustom/AppointmentStatusBadge"

import { Card } from "@/components/ui/card"

import { urlPaths } from "@/constants/urlPaths"

import { cn } from "@/lib/utils"

import { formatAppointmentTimeRangeVi } from "@/lib/date-vi"

import { APPOINTMENT_STATUS_STYLES } from "../constants/calendar"

interface AppointmentCardProps {
  appointment: Appointment
  variant?: "default" | "overlay"
  onClick: () => void
}

export function AppointmentCard({
  appointment,
  variant = "default",
  onClick,
}: AppointmentCardProps) {
  const patientName =
    appointment.patient?.fullName ?? `BN #${appointment.patientId.slice(0, 8)}`

  const statusStyle =
    APPOINTMENT_STATUS_STYLES[appointment.status] ??
    APPOINTMENT_STATUS_STYLES.BOOKED

  const isOverlay = variant === "overlay"

  return (
    <Card
      size="sm"
      role="button"
      tabIndex={0}
      onClick={(event) => {
        event.stopPropagation()

        onClick()
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()

          event.stopPropagation()

          onClick()
        }
      }}
      className={cn(
        "cursor-pointer gap-0.5 shadow-none ring-0 transition-colors hover:brightness-95",
        isOverlay ? "h-full min-h-0 overflow-hidden py-1" : "gap-1 py-1.5",
        statusStyle
      )}
    >
      <div className="flex items-start justify-between gap-1 px-1.5 sm:px-2">
        <p className="truncate text-[11px] leading-tight font-semibold">
          {patientName}
        </p>

        {!isOverlay ? (
          <AppointmentStatusBadge
            status={appointment.status}
            className="hidden shrink-0 sm:inline-flex"
          />
        ) : null}
      </div>

      <p className="truncate px-1.5 text-[10px] opacity-80 sm:px-2">
        {formatAppointmentTimeRangeVi(
          appointment.scheduledAt,
          appointment.endedAt
        )}
      </p>

      {!isOverlay && appointment.doctorName ? (
        <p className="truncate px-2 text-[10px] opacity-80">
          {appointment.doctorName}
        </p>
      ) : null}

      {!isOverlay && appointment.patient?.id ? (
        <Link
          to={urlPaths.medicalRecords(appointment.patient.id)}
          onClick={(event) => event.stopPropagation()}
          className="px-2 text-[10px] text-primary underline-offset-2 hover:underline"
        >
          Xem hồ sơ
        </Link>
      ) : null}
    </Card>
  )
}
