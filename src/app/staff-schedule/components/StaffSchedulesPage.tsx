import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { CalendarOff, Plus } from "lucide-react"
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
import {
  getWeekRange,
  toApiRangeIso,
} from "@/app/appointments/utils/week-range"
import { weekStaffShiftsQueryOptions } from "../queries/staff-shift-query"
import type { StaffShift } from "../services/staffShiftService"
import { StaffScheduleGrid } from "./StaffScheduleGrid"
import { StaffScheduleNavigator } from "./StaffScheduleNavigator"
import {
  StaffShiftDialog,
  type StaffShiftDialogContext,
} from "./StaffShiftDialog"
/**Trang lịch làm việc của nhân viên.*/
export function StaffSchedulesPage() {
  const { activeClinicId, activeClinic } = useActiveClinic()
  const [anchorDate, setAnchorDate] = useState(() => new Date())
  const [staffId, setStaffId] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogContext, setDialogContext] =
    useState<StaffShiftDialogContext | null>(null)

  const { staffOptions } = useStaffPickerOptions()

  const staffSelectOptions = useMemo(
    () =>
      staffOptions
        .filter(
          (staff) =>
            activeClinicId !== null &&
            (staff.clinicIds ?? []).includes(activeClinicId)
        )
        .map((staff) => ({ value: staff.id, label: staff.fullName })),
    [staffOptions, activeClinicId]
  )

  const { start, end } = getWeekRange(anchorDate)
  const { from, to } = toApiRangeIso(start, end)

  const { data: shifts = [], isLoading } = useQuery(
    weekStaffShiftsQueryOptions({
      staffId,
      clinicId: activeClinicId ?? undefined,
      from,
      to,
    })
  )

  const openCreate = (day?: Date, hour?: number, minute?: number) => {
    if (!staffId) return

    if (day != null && hour != null && minute != null) {
      const slotDate = new Date(day)
      slotDate.setHours(hour, minute, 0, 0)
      if (slotDate < new Date()) return
    }

    setDialogContext({
      mode: "create",
      staffId,
      day: day ?? new Date(),
      hour: hour ?? 9,
      minute: minute ?? 0,
    })
    setDialogOpen(true)
  }

  const openEdit = (shift: StaffShift) => {
    setDialogContext({
      mode: "edit",
      staffId: shift.staffId,
      shift,
    })
    setDialogOpen(true)
  }

  const markTodayOff = () => {
    if (!staffId) return
    setDialogContext({
      mode: "create",
      staffId,
      day: new Date(),
      presetType: "OFF",
    })
    setDialogOpen(true)
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3 overflow-hidden bg-background p-3 md:p-4">
      <StaffScheduleNavigator
        anchorDate={anchorDate}
        onAnchorChange={setAnchorDate}
        activeClinicName={activeClinic?.name ?? "Chưa chọn cơ sở"}
        shiftCount={shifts.length}
      />
      <div className="flex shrink-0 flex-wrap items-end gap-3">
        <div className="min-w-[220px] space-y-1.5">
          <Label htmlFor="staff-schedule-picker">Nhân viên</Label>
          <Select value={staffId} onValueChange={setStaffId}>
            <SelectTrigger id="staff-schedule-picker" className="w-full">
              <SelectValue placeholder="Chọn nhân viên" />
            </SelectTrigger>
            <SelectContent>
              {staffSelectOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="button" disabled={!staffId} onClick={() => openCreate()}>
          <Plus className="mr-1.5 h-4 w-4" />
          Thêm ca
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={!staffId}
          onClick={markTodayOff}
        >
          <CalendarOff className="mr-1.5 h-4 w-4" />
          Nghỉ hôm nay
        </Button>
      </div>
      {!staffId ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
          Chọn nhân viên để xem lịch làm việc
        </div>
      ) : (
        <StaffScheduleGrid
          anchorDate={anchorDate}
          shifts={shifts}
          loading={isLoading}
          onSlotClick={(day, hour, minute) => openCreate(day, hour, minute)}
          onShiftClick={openEdit}
        />
      )}
      <StaffShiftDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        clinicId={activeClinicId}
        context={dialogContext}
      />
    </div>
  )
}
