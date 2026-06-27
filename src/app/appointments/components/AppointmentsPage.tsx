import { useState } from "react"

import { useQuery } from "@tanstack/react-query"

import { CalendarDays, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

import { Card, CardContent } from "@/components/ui/card"

import { toClinicBranchCode } from "@/lib/clinic-branch"
import { useClinicStore } from "@/stores/clinic-store"

import type { Appointment } from "@/app/appointments/services/appointmentService"

import { weekAppointmentsQueryOptions } from "../queries/appointment-query"

import {
  DAY_END_HOUR,
  DAY_START_HOUR,
  SLOT_MINUTES,
} from "../constants/calendar"

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
    <div className="flex h-full flex-col gap-4 overflow-hidden bg-background p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <WeekNavigator anchorDate={anchorDate} onAnchorChange={setAnchorDate} />

        <Button type="button" onClick={() => openCreateDialog()}>
          <Plus className="mr-1.5 h-4 w-4" />
          Đặt lịch mới
        </Button>
      </div>

      <Card size="sm" className="py-3">
        <CardContent className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />

          <span>
            Cơ sở: <strong className="text-foreground">{activeBranch}</strong>
          </span>

          <Badge variant="outline">
            {String(DAY_START_HOUR).padStart(2, "0")}:00 –{" "}
            {String(DAY_END_HOUR).padStart(2, "0")}:00
          </Badge>

          <Badge variant="outline">Lưới {SLOT_MINUTES} phút</Badge>

          <Badge variant="secondary">
            {appointments.length} lịch trong tuần
          </Badge>
        </CardContent>
      </Card>

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
