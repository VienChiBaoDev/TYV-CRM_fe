import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { DialogCommon } from "@/components/UiCustom/DialogCommon"
import { Form } from "@/components/ui/form"
import { FormDate } from "@/components/FieldCustom/FormDate"
import { FormInput } from "@/components/FieldCustom/FormInput"
import { formatIsoDateToVi } from "@/app/medical-records/constants/visit-form"
import { useRescheduleFollowUpMutation } from "../hooks/use-follow-up-mutations"
import type { FollowUpSchedule } from "../interfaces/StandardMedicalRecord"

const schema = z.object({
  rescheduledFollowUpDate: z.string().min(1, "Vui lòng chọn ngày"),
  note: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface RescheduleFollowUpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  row: FollowUpSchedule
}

export function RescheduleFollowUpDialog({
  open,
  onOpenChange,
  row,
}: RescheduleFollowUpDialogProps) {
  const mutation = useRescheduleFollowUpMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      rescheduledFollowUpDate:
        row.rescheduledFollowUpDate ?? row.followUpAppointmentDate,
      note: row.rescheduleNote ?? "",
    },
  })

  useEffect(() => {
    if (!open) return
    form.reset({
      rescheduledFollowUpDate:
        row.rescheduledFollowUpDate ?? row.followUpAppointmentDate,
      note: row.rescheduleNote ?? "",
    })
  }, [open, row, form])

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync({
      followUpId: row.id,
      payload: {
        rescheduledFollowUpDate: values.rescheduledFollowUpDate,
        note: values.note,
      },
    })
    onOpenChange(false)
  })

  return (
    <DialogCommon
      open={open}
      onOpenChange={onOpenChange}
      title="Đổi lịch tái khám"
      onSubmit={onSubmit}
      loading={mutation.isPending}
    >
      <Form {...form}>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Bệnh nhân: <strong>{row.name}</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Hạn tái khám gốc:{" "}
            <strong>{formatIsoDateToVi(row.followUpAppointmentDate)}</strong>{" "}
            (không thay đổi)
          </p>
          <FormDate
            control={form.control}
            name="rescheduledFollowUpDate"
            label="Ngày tái khám mới"
            required
          />
          <FormInput
            control={form.control}
            name="note"
            label="Ghi chú"
            placeholder="VD: BN đi công tác, hẹn lại tuần sau"
          />
        </div>
      </Form>
    </DialogCommon>
  )
}
