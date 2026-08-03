import { useMemo, useState } from "react"

import { useQuery } from "@tanstack/react-query"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useActiveClinic } from "@/hooks/use-active-clinic"
import { useStaffPickerOptions } from "@/hooks/use-staff-picker-options"

import type { Appointment } from "@/app/appointments/services/appointmentService"

import { weekAppointmentsQueryOptions } from "../queries/appointment-query"

import { getWeekRange, toApiRangeIso } from "../utils/week-range"

import { WeekNavigator } from "./WeekNavigator"

import { WeeklyCalendarGrid } from "./WeeklyCalendarGrid"

import { DoctorColorLegend } from "./DoctorColorLegend"

import {
  AppointmentDialog,
  type AppointmentDialogContext,
} from "./AppointmentDialog"

const ALL_DOCTORS_VALUE = "all"

export function AppointmentsPage() {
  const { activeClinicId, activeClinic } = useActiveClinic()

  const [anchorDate, setAnchorDate] = useState(() => new Date())
  const [doctorId, setDoctorId] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)

  const [dialogContext, setDialogContext] =
    useState<AppointmentDialogContext | null>(null)

  const { staffOptions } = useStaffPickerOptions()

  const doctorSelectOptions = useMemo(
    () =>
      staffOptions
        .filter((staff) => staff.role === "DOCTOR")
        .filter(
          (staff) =>
            activeClinicId !== null &&
            (staff.clinicIds ?? []).includes(activeClinicId)
        )
        .map((staff) => ({ value: staff.id, label: staff.fullName })),
    [staffOptions, activeClinicId]
  )

  const showAllDoctors = !doctorId

  const { start, end } = getWeekRange(anchorDate)

  const { from, to } = toApiRangeIso(start, end)

  const { data: appointments = [], isLoading } = useQuery(
    weekAppointmentsQueryOptions({
      clinicId: activeClinicId ?? undefined,
      from,
      to,
      doctorId: doctorId || undefined,
    })
  )

  const legendDoctors = useMemo(() => {
    const counts = new Map(
      doctorSelectOptions.map((option) => [option.label, 0])
    )

    for (const appointment of appointments) {
      if (!appointment.doctorName) continue
      counts.set(
        appointment.doctorName,
        (counts.get(appointment.doctorName) ?? 0) + 1
      )
    }

    return doctorSelectOptions.map((option) => ({
      name: option.label,
      count: counts.get(option.label) ?? 0,
    }))
  }, [doctorSelectOptions, appointments])

  const openCreateDialog = (day?: Date, hour?: number, minute?: number) => {
    if (day != null && hour != null && minute != null) {
      const slotDate = new Date(day)
      slotDate.setHours(hour, minute, 0, 0)
      if (slotDate < new Date()) return
    }

    setDialogContext({
      mode: "create",

      day: day ?? new Date(),

      hour: hour ?? 9,

      minute: minute ?? 0,

      defaultDoctorId: doctorId || undefined,
    })

    setDialogOpen(true)
  }

  const openEditDialog = (appointment: Appointment) => {
    setDialogContext({ mode: "edit", appointment })

    setDialogOpen(true)
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3 overflow-hidden bg-background p-3 md:p-4">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3">
        <WeekNavigator
          anchorDate={anchorDate}
          onAnchorChange={setAnchorDate}
          activeClinicName={activeClinic?.name ?? "Chưa chọn cơ sở"}
          appointmentCount={appointments.length}
        />

        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] space-y-1.5">
            <Label htmlFor="appointment-doctor-filter">Bác sĩ</Label>
            <Select
              value={doctorId || ALL_DOCTORS_VALUE}
              onValueChange={(value) =>
                setDoctorId(value === ALL_DOCTORS_VALUE ? "" : value)
              }
            >
              <SelectTrigger id="appointment-doctor-filter" className="w-full">
                <SelectValue placeholder="Tất cả bác sĩ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_DOCTORS_VALUE}>Tất cả bác sĩ</SelectItem>
                {doctorSelectOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="button" onClick={() => openCreateDialog()}>
            <Plus className="mr-1.5 h-4 w-4" />
            Đặt lịch mới
          </Button>
        </div>
      </div>

      {showAllDoctors ? <DoctorColorLegend doctors={legendDoctors} /> : null}

      <WeeklyCalendarGrid
        anchorDate={anchorDate}
        appointments={appointments}
        loading={isLoading}
        showDoctor={showAllDoctors}
        onSlotClick={(day, hour, minute) => openCreateDialog(day, hour, minute)}
        onAppointmentClick={openEditDialog}
      />

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        clinicId={activeClinicId}
        context={dialogContext}
      />
    </div>
  )
}
