import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { DialogCommon } from "@/components/UiCustom/DialogCommon"
import { Form } from "@/components/ui/form"
import { FormInput } from "@/components/FieldCustom/FormInput"
import { FormDatetime } from "@/components/FieldCustom/FormDatetime"
import { parseIsoDate, slotToFormDatetime } from "@/lib/date-vi"
import { useScheduleFollowUpMutation } from "../hooks/use-follow-up-mutations"
import type { FollowUpSchedule } from "../interfaces/StandardMedicalRecord"

const schema = z.object({
  scheduledAt: z.string().min(1, "Vui lòng chọn ngày giờ"),
  doctorName: z.string().optional(),
  note: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface QuickScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  row: FollowUpSchedule
}

function getDefaultScheduledAt(followUpDateIso: string): string {
  const date = parseIsoDate(followUpDateIso)
  return date ? slotToFormDatetime(date, 9, 0) : ""
}

export function QuickScheduleDialog({
  open,
  onOpenChange,
  row,
}: QuickScheduleDialogProps) {
  const mutation = useScheduleFollowUpMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      scheduledAt: getDefaultScheduledAt(row.followUpAppointmentDate),
      doctorName: row.physicianInCharge,
      note: "",
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync({
      followUpId: row.id,
      payload: {
        scheduledAt: new Date(values.scheduledAt).toISOString(),
        doctorName: values.doctorName,
        note: values.note,
      },
    })
    onOpenChange(false)
  })

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
          <FormDatetime
            control={form.control}
            name="scheduledAt"
            label="Ngày giờ hẹn"
            required
          />
          <FormInput control={form.control} name="doctorName" label="Bác sĩ" />
          <FormInput control={form.control} name="note" label="Ghi chú" />
        </div>
      </Form>
    </DialogCommon>
  )
}
