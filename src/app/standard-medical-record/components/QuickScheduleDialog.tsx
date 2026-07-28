import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { DialogCommon } from "@/components/UiCustom/DialogCommon"
import { Form } from "@/components/ui/form"
import { FormInput } from "@/components/FieldCustom/FormInput"
import { FormSelect } from "@/components/FieldCustom/FormSelect"
import { FormAppointmentTimeRange } from "@/components/FieldCustom/FormAppointmentTimeRange"
import { DEFAULT_APPOINTMENT_DURATION_MINUTES } from "@/app/appointments/constants/calendar"
import {
  addMinutesToFormDatetime,
  formatIsoDateToVi,
  parseFormDatetime,
  parseIsoDate,
  slotToFormDatetime,
} from "@/lib/date-vi"
import { useScheduleFollowUpMutation } from "../hooks/use-follow-up-mutations"
import type { FollowUpSchedule } from "../interfaces/StandardMedicalRecord"
import { useEffect } from "react"
import {
  findStaffIdByName,
  staffNameById,
  useStaffPickerOptions,
} from "@/hooks/use-staff-picker-options"

const schema = z
  .object({
    scheduledAt: z.string().min(1, "Vui lòng chọn ngày và giờ bắt đầu"),
    endedAt: z.string().min(1, "Vui lòng chọn giờ kết thúc"),
    doctorId: z.string().min(1, "Vui lòng chọn bác sĩ"),
    assistantId: z.string().optional(),
    note: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const start = parseFormDatetime(data.scheduledAt)
    const end = parseFormDatetime(data.endedAt)

    if (!start || !end) return

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Giờ kết thúc phải sau giờ bắt đầu",
        path: ["endedAt"],
      })
    }
  })

type FormValues = z.infer<typeof schema>

interface QuickScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  row: FollowUpSchedule
}

function getDefaultTimes(followUpDateIso: string): {
  scheduledAt: string
  endedAt: string
} {
  const date = parseIsoDate(followUpDateIso)
  if (!date) {
    return { scheduledAt: "", endedAt: "" }
  }

  const scheduledAt = slotToFormDatetime(date, 9, 0)
  return {
    scheduledAt,
    endedAt: addMinutesToFormDatetime(
      scheduledAt,
      DEFAULT_APPOINTMENT_DURATION_MINUTES
    ),
  }
}

export function QuickScheduleDialog({
  open,
  onOpenChange,
  row,
}: QuickScheduleDialogProps) {
  const mutation = useScheduleFollowUpMutation()
  const defaults = getDefaultTimes(row.effectiveFollowUpDate)
  const { staffOptions, doctorOptions, assistantOptions } =
    useStaffPickerOptions(open)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      scheduledAt: defaults.scheduledAt,
      endedAt: defaults.endedAt,
      doctorId: "",
      assistantId: "",
      note: "",
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync({
      followUpId: row.id,
      payload: {
        scheduledAt: new Date(values.scheduledAt).toISOString(),
        endedAt: new Date(values.endedAt).toISOString(),
        doctorId: values.doctorId,
        assistantId: values.assistantId || undefined,
        doctorName: staffNameById(staffOptions, values.doctorId),
        assistantName: staffNameById(staffOptions, values.assistantId),
        note: values.note,
      },
    })
    onOpenChange(false)
  })

  useEffect(() => {
    if (!open || staffOptions.length === 0) return
    const times = getDefaultTimes(row.effectiveFollowUpDate)
    form.reset({
      scheduledAt: times.scheduledAt,
      endedAt: times.endedAt,
      doctorId: findStaffIdByName(staffOptions, row.physicianInCharge),
      assistantId: "",
      note: "",
    })
  }, [open, row, form, staffOptions])

  return (
    <DialogCommon
      open={open}
      onOpenChange={onOpenChange}
      title="Đặt lịch tái khám nhanh"
      onSubmit={onSubmit}
      loading={mutation.isPending}
    >
      <Form {...form}>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Bệnh nhân: <strong>{row.name}</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Hạn gốc: {formatIsoDateToVi(row.followUpAppointmentDate)}
            {row.rescheduledFollowUpDate
              ? ` · Lịch đổi: ${formatIsoDateToVi(row.rescheduledFollowUpDate)}`
              : null}
          </p>
          <FormAppointmentTimeRange
            control={form.control}
            startName="scheduledAt"
            endName="endedAt"
            label="Thời gian hẹn"
            required
            defaultDurationMinutes={DEFAULT_APPOINTMENT_DURATION_MINUTES}
          />
          <FormSelect
            control={form.control}
            name="doctorId"
            label="Bác sĩ"
            placeholder="Chọn bác sĩ"
            options={doctorOptions}
            required
          />
          <FormSelect
            control={form.control}
            name="assistantId"
            label="Trợ lý"
            placeholder="Chọn trợ lý (tuỳ chọn)"
            options={assistantOptions}
          />
          <FormInput control={form.control} name="note" label="Ghi chú" />
        </div>
      </Form>
    </DialogCommon>
  )
}
