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

import { toClinicBranchCode } from "@/lib/clinic-branch"
import { useClinicStore } from "@/stores/clinic-store"
import { useStaffPickerOptions } from "@/hooks/use-staff-picker-options"

import type { Appointment } from "@/app/appointments/services/appointmentService"

import { weekAppointmentsQueryOptions } from "../queries/appointment-query"

import { getWeekRange, toApiRangeIso } from "../utils/week-range"

import { WeekNavigator } from "./WeekNavigator"

import { WeeklyCalendarGrid } from "./WeeklyCalendarGrid"

import {
  AppointmentDialog,
  type AppointmentDialogContext,
} from "./AppointmentDialog"

const ALL_DOCTORS_VALUE = "all"

export function AppointmentsPage() {
  const activeBranch = useClinicStore((state) => state.activeBranch)

  const branch = toClinicBranchCode(activeBranch)

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
        .filter((staff) => !staff.clinicBranch || staff.clinicBranch === branch)
        .map((staff) => ({ value: staff.id, label: staff.fullName })),
    [staffOptions, branch]
  )

  const { start, end } = getWeekRange(anchorDate)

  const { from, to } = toApiRangeIso(start, end)

  const { data: appointments = [], isLoading } = useQuery(
    weekAppointmentsQueryOptions({
      branch,
      from,
      to,
      doctorId: doctorId || undefined,
    })
  )

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
          activeBranch={activeBranch}
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

      <WeeklyCalendarGrid
        anchorDate={anchorDate}
        appointments={appointments}
        loading={isLoading}
        onSlotClick={(day, hour, minute) => openCreateDialog(day, hour, minute)}
        onAppointmentClick={openEditDialog}
      />

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        branch={branch}
        context={dialogContext}
      />
    </div>
  )
}
