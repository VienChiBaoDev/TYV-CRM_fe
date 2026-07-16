import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { FormDialog } from "@/components/UiCustom/FormDialog"
import { FormAppointmentTimeRange } from "@/components/FieldCustom/FormAppointmentTimeRange"
import { FormSelect } from "@/components/FieldCustom/FormSelect"
import { FormTextarea } from "@/components/FieldCustom/FormTextarea"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import type { ClinicBranchCode } from "@/app/medical-records/data/patientService"

import {
  DAY_END_HOUR,
  DAY_START_HOUR,
  DEFAULT_APPOINTMENT_DURATION_MINUTES,
} from "@/app/appointments/constants/calendar"

import { slotToDatetimeLocal } from "@/app/appointments/utils/time-slots"

import { addMinutesToFormDatetime } from "@/lib/date-vi"

import {
  staffShiftFormSchema,
  type StaffShiftFormValues,
} from "../schemas/staff-shift-form"

import {
  useCreateStaffShiftMutation,
  useDeleteStaffShiftMutation,
  useUpdateStaffShiftMutation,
} from "../hooks/use-staff-shift-mutations"

import type { StaffShift, StaffShiftType } from "../services/staffShiftService"

import { STAFF_SHIFT_TYPE_LABELS } from "../constants/shift-styles"

export interface StaffShiftDialogContext {
  mode: "create" | "edit"
  staffId: string
  day?: Date
  hour?: number
  minute?: number
  presetType?: StaffShiftType
  shift?: StaffShift
}

interface StaffShiftDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branch: ClinicBranchCode
  context: StaffShiftDialogContext | null
}

const SHIFT_TYPE_OPTIONS = [
  { value: "WORK", label: STAFF_SHIFT_TYPE_LABELS.WORK },
  { value: "OFF", label: STAFF_SHIFT_TYPE_LABELS.OFF },
] as const

function toFormDatetime(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function buildDefaultValues(
  context: StaffShiftDialogContext | null
): StaffShiftFormValues {
  if (context?.mode === "edit" && context.shift) {
    return {
      type: context.shift.type,
      startAt: toFormDatetime(context.shift.startAt),
      endAt: toFormDatetime(context.shift.endAt),
      note: context.shift.note ?? "",
    }
  }

  if (context?.mode === "create" && context.day) {
    if (context.presetType === "OFF") {
      const startAt = slotToDatetimeLocal(
        context.day,
        DAY_START_HOUR,
        0
      )
      const endAt = slotToDatetimeLocal(context.day, DAY_END_HOUR, 0)
      return { type: "OFF", startAt, endAt, note: "" }
    }

    const startAt = slotToDatetimeLocal(
      context.day,
      context.hour ?? 9,
      context.minute ?? 0
    )
    return {
      type: context.presetType ?? "WORK",
      startAt,
      endAt: addMinutesToFormDatetime(
        startAt,
        DEFAULT_APPOINTMENT_DURATION_MINUTES
      ),
      note: "",
    }
  }

  return { type: "WORK", startAt: "", endAt: "", note: "" }
}

export function StaffShiftDialog({
  open,
  onOpenChange,
  branch,
  context,
}: StaffShiftDialogProps) {
  const form = useForm<StaffShiftFormValues>({
    resolver: zodResolver(staffShiftFormSchema),
    defaultValues: buildDefaultValues(context),
  })

  const createMutation = useCreateStaffShiftMutation()
  const updateMutation = useUpdateStaffShiftMutation()
  const deleteMutation = useDeleteStaffShiftMutation()

  const isEdit = context?.mode === "edit"
  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  useEffect(() => {
    if (open) form.reset(buildDefaultValues(context))
  }, [open, context, form])

  const onSubmit = form.handleSubmit(async (values) => {
    if (!context) return

    const payload = {
      type: values.type,
      startAt: new Date(values.startAt).toISOString(),
      endAt: new Date(values.endAt).toISOString(),
      note: values.note || undefined,
    }

    if (isEdit && context.shift) {
      await updateMutation.mutateAsync({
        id: context.shift.id,
        payload: { ...payload, clinicBranch: branch },
      })
    } else {
      await createMutation.mutateAsync({
        staffId: context.staffId,
        clinicBranch: branch,
        ...payload,
      })
    }
    onOpenChange(false)
  })

  const handleDelete = async () => {
    if (!context?.shift) return
    await deleteMutation.mutateAsync(context.shift.id)
    onOpenChange(false)
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Sửa ca làm" : "Thêm ca làm"}
      description={
        isEdit ? "Cập nhật khung giờ làm việc" : "Tạo ca làm cho nhân viên"
      }
      footer={
        <div className="flex w-full flex-wrap justify-end gap-2">
          {isEdit ? (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              Xóa ca
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button type="button" onClick={onSubmit} disabled={isPending}>
            {isEdit ? "Lưu" : "Tạo ca"}
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <div className="space-y-4">
          <FormSelect
            control={form.control}
            name="type"
            label="Loại ca"
            options={SHIFT_TYPE_OPTIONS}
            required
          />
          <FormAppointmentTimeRange
            control={form.control}
            startName="startAt"
            endName="endAt"
            label="Thời gian"
            required
            defaultDurationMinutes={DEFAULT_APPOINTMENT_DURATION_MINUTES}
          />
          <FormTextarea control={form.control} name="note" label="Ghi chú" />
        </div>
      </Form>
    </FormDialog>
  )
}
