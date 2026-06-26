import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { FormDialog } from "@/components/UiCustom/FormDialog"
import { AppointmentStatusBadge } from "@/components/UiCustom/AppointmentStatusBadge"
import { FormDatetime } from "@/components/FieldCustom/FormDatetime"
import { FormInput } from "@/components/FieldCustom/FormInput"
import { FormPatientSearch } from "@/components/FieldCustom/FormPatientSearch"
import { FormSelect } from "@/components/FieldCustom/FormSelect"
import { FormTextarea } from "@/components/FieldCustom/FormTextarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import type { Appointment } from "@/app/medical-records/data/appointmentService"
import type { ClinicBranchCode } from "@/app/medical-records/data/patientService"
import { APPOINTMENT_STATUS_OPTIONS } from "../constants/calendar"
import {
  useCancelAppointmentMutation,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
} from "../hooks/use-appointment-mutations"
import {
  appointmentFormSchema,
  type AppointmentFormValues,
} from "../schemas/appointment-form"
import { slotToDatetimeLocal, toDatetimeLocalValue } from "../utils/time-slots"

export interface AppointmentDialogContext {
  mode: "create" | "edit"
  day?: Date
  hour?: number
  minute?: number
  appointment?: Appointment
}

interface AppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branch: ClinicBranchCode
  context: AppointmentDialogContext | null
}

function buildDefaultValues(
  context: AppointmentDialogContext | null
): AppointmentFormValues {
  if (context?.mode === "edit" && context.appointment) {
    return {
      patientId: context.appointment.patientId,
      scheduledAt: toDatetimeLocalValue(context.appointment.scheduledAt),
      doctorName: context.appointment.doctorName ?? "",
      note: context.appointment.note ?? "",
      status: context.appointment.status,
    }
  }

  if (context?.mode === "create" && context.day != null) {
    return {
      patientId: "",
      scheduledAt: slotToDatetimeLocal(
        context.day,
        context.hour ?? 9,
        context.minute ?? 0
      ),
      doctorName: "",
      note: "",
      status: "BOOKED",
    }
  }

  return {
    patientId: "",
    scheduledAt: "",
    doctorName: "",
    note: "",
    status: "BOOKED",
  }
}

export function AppointmentDialog({
  open,
  onOpenChange,
  branch,
  context,
}: AppointmentDialogProps) {
  const createMutation = useCreateAppointmentMutation()
  const updateMutation = useUpdateAppointmentMutation()
  const cancelMutation = useCancelAppointmentMutation()

  const isEdit = context?.mode === "edit"
  const appointment = context?.appointment

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: buildDefaultValues(context),
  })

  useEffect(() => {
    if (!open) return
    form.reset(buildDefaultValues(context))
  }, [open, context, form])

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    cancelMutation.isPending

  const onSubmit = form.handleSubmit(async (values) => {
    const scheduledAt = new Date(values.scheduledAt).toISOString()

    if (isEdit && appointment) {
      await updateMutation.mutateAsync({
        id: appointment.id,
        payload: {
          scheduledAt,
          doctorName: values.doctorName || undefined,
          note: values.note,
          status: values.status,
        },
      })
    } else {
      await createMutation.mutateAsync({
        patientId: values.patientId,
        scheduledAt,
        doctorName: values.doctorName || undefined,
        note: values.note,
        clinicBranch: branch,
      })
    }

    onOpenChange(false)
  })

  const handleCancelAppointment = async () => {
    if (!appointment) return
    await cancelMutation.mutateAsync(appointment.id)
    onOpenChange(false)
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chi tiết lịch hẹn" : "Đặt lịch hẹn mới"}
      description={
        isEdit
          ? "Cập nhật thông tin hoặc hủy lịch hẹn"
          : "Chọn bệnh nhân và thời gian khám"
      }
      footerClassName="w-full sm:justify-between"
      footer={
        <>
          {isEdit && appointment?.status !== "CANCELLED" ? (
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={handleCancelAppointment}
            >
              Hủy lịch
            </Button>
          ) : (
            <span />
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>
            <Button type="button" disabled={isPending} onClick={onSubmit}>
              {isPending ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Đặt lịch"}
            </Button>
          </div>
        </>
      }
    >
      <Form {...form}>
        <div className="flex flex-col gap-4">
          {isEdit && appointment ? (
            <Alert>
              <AlertTitle className="flex items-center gap-2">
                {appointment.patient?.fullName ?? "Bệnh nhân"}
                <AppointmentStatusBadge status={appointment.status} />
              </AlertTitle>
              <AlertDescription>
                Mã BN: {appointment.patient?.patientCode ?? "—"} ·{" "}
                {appointment.patient?.phone ?? "—"}
              </AlertDescription>
            </Alert>
          ) : (
            <FormPatientSearch
              control={form.control}
              name="patientId"
              branch={branch}
              required
            />
          )}

          <Separator />

          <FormDatetime
            control={form.control}
            name="scheduledAt"
            label="Ngày giờ hẹn"
            required
          />
          <FormInput control={form.control} name="doctorName" label="Bác sĩ" />
          <FormTextarea control={form.control} name="note" label="Ghi chú" />

          {isEdit ? (
            <FormSelect
              control={form.control}
              name="status"
              label="Trạng thái"
              options={APPOINTMENT_STATUS_OPTIONS}
            />
          ) : null}
        </div>
      </Form>
    </FormDialog>
  )
}
