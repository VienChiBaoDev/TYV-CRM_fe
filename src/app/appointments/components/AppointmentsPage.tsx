import { useState } from "react"

import { useQuery } from "@tanstack/react-query"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import { toClinicBranchCode } from "@/lib/clinic-branch"
import { useClinicStore } from "@/stores/clinic-store"

import type { Appointment } from "@/app/appointments/services/appointmentService"

import { weekAppointmentsQueryOptions } from "../queries/appointment-query"

import { getWeekRange, toApiRangeIso } from "../utils/week-range"

import { WeekNavigator } from "./WeekNavigator"

import { WeeklyCalendarGrid } from "./WeeklyCalendarGrid"

import {
  AppointmentDialog,
  type AppointmentDialogContext,
} from "./AppointmentDialog"

export function AppointmentsPage() {
  const activeBranch = useClinicStore((state) => state.activeBranch)

  const branch = toClinicBranchCode(activeBranch)

  const [anchorDate, setAnchorDate] = useState(() => new Date())

  const [dialogOpen, setDialogOpen] = useState(false)

  const [dialogContext, setDialogContext] =
    useState<AppointmentDialogContext | null>(null)

  const { start, end } = getWeekRange(anchorDate)

  const { from, to } = toApiRangeIso(start, end)

  const { data: appointments = [], isLoading } = useQuery(
    weekAppointmentsQueryOptions({ branch, from, to })
  )

  const openCreateDialog = (day?: Date, hour?: number, minute?: number) => {
    setDialogContext({
      mode: "create",

      day: day ?? new Date(),

      hour: hour ?? 9,

      minute: minute ?? 0,
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

        <Button type="button" onClick={() => openCreateDialog()}>
          <Plus className="mr-1.5 h-4 w-4" />
          Đặt lịch mới
        </Button>
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
