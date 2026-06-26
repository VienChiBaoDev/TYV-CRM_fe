import { Link } from "react-router-dom"

import type { Appointment } from "@/app/medical-records/data/appointmentService"

import { AppointmentStatusBadge } from "@/components/UiCustom/AppointmentStatusBadge"

import { Card } from "@/components/ui/card"

import { urlPaths } from "@/constants/urlPaths"

import { cn } from "@/lib/utils"

import { APPOINTMENT_STATUS_STYLES } from "../constants/calendar"

interface AppointmentCardProps {
  appointment: Appointment

  onClick: () => void
}

export function AppointmentCard({
  appointment,
  onClick,
}: AppointmentCardProps) {
  const patientName =
    appointment.patient?.fullName ?? `BN #${appointment.patientId.slice(0, 8)}`

  const statusStyle =
    APPOINTMENT_STATUS_STYLES[appointment.status] ??
    APPOINTMENT_STATUS_STYLES.BOOKED

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
        "cursor-pointer gap-1 py-1.5 shadow-none ring-0 transition-colors hover:brightness-95",

        statusStyle
      )}
    >
      <div className="flex items-start justify-between gap-1 px-2">
        <p className="truncate text-[11px] leading-tight font-semibold">
          {patientName}
        </p>

        <AppointmentStatusBadge
          status={appointment.status}
          className="hidden shrink-0 sm:inline-flex"
        />
      </div>

      {appointment.doctorName ? (
        <p className="truncate px-2 text-[10px] opacity-80">
          {appointment.doctorName}
        </p>
      ) : null}

      {appointment.patient?.id ? (
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
