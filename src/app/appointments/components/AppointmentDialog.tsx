import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { toast } from "sonner"

import { FormDialog } from "@/components/UiCustom/FormDialog"
import { AppointmentStatusBadge } from "@/components/UiCustom/AppointmentStatusBadge"
import { FormAppointmentTimeRange } from "@/components/FieldCustom/FormAppointmentTimeRange"
import { FormInput } from "@/components/FieldCustom/FormInput"
import { FormPatientSearch } from "@/components/FieldCustom/FormPatientSearch"
import { FormSelect } from "@/components/FieldCustom/FormSelect"
import { FormTextarea } from "@/components/FieldCustom/FormTextarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import type { Appointment } from "@/app/appointments/services/appointmentService"
import type { ClinicBranchCode } from "@/app/medical-records/data/patientService"
import {
  APPOINTMENT_STATUS_OPTIONS,
  DEFAULT_APPOINTMENT_DURATION_MINUTES,
} from "../constants/calendar"
import {
  useCancelAppointmentMutation,
  useCheckInAppointmentMutation,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
} from "../hooks/use-appointment-mutations"
import {
  appointmentFormSchema,
  type AppointmentFormValues,
} from "../schemas/appointment-form"
import { addMinutesToFormDatetime, parseFormDatetime } from "@/lib/date-vi"
import { slotToDatetimeLocal, toDatetimeLocalValue } from "../utils/time-slots"
import { urlPaths } from "@/constants/urlPaths"
import { Link } from "react-router-dom"
import { ArrowRightIcon } from "lucide-react"

export interface AppointmentDialogContext {
  mode: "create" | "edit"
  day?: Date
  hour?: number
  minute?: number
  appointment?: Appointment
  /** BN cố định khi đặt lịch từ hồ sơ */
  fixedPatient?: {
    id: string
    fullName: string
    patientCode: string
    phone: string
  }
}

interface AppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branch: ClinicBranchCode
  context: AppointmentDialogContext | null
  /** UUID bệnh nhân — ưu tiên hơn context.fixedPatient.id */
  fixedPatientId?: string
}

function buildDefaultValues(
  context: AppointmentDialogContext | null
): AppointmentFormValues {
  if (context?.mode === "edit" && context.appointment) {
    const scheduledAt = toDatetimeLocalValue(context.appointment.scheduledAt)
    return {
      patientId: context.appointment.patientId,
      scheduledAt,
      endedAt: toDatetimeLocalValue(context.appointment.endedAt),
      doctorName: context.appointment.doctorName ?? "",
      note: context.appointment.note ?? "",
      status: context.appointment.status,
    }
  }

  if (context?.mode === "create" && context.day != null) {
    const scheduledAt = slotToDatetimeLocal(
      context.day,
      context.hour ?? 9,
      context.minute ?? 0
    )
    return {
      patientId: context.fixedPatient?.id ?? "",
      scheduledAt,
      endedAt: addMinutesToFormDatetime(
        scheduledAt,
        DEFAULT_APPOINTMENT_DURATION_MINUTES
      ),
      doctorName: "",
      note: "",
      status: "BOOKED",
    }
  }

  return {
    patientId: "",
    scheduledAt: "",
    endedAt: "",
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
  fixedPatientId,
}: AppointmentDialogProps) {
  const createMutation = useCreateAppointmentMutation()
  const updateMutation = useUpdateAppointmentMutation()
  const cancelMutation = useCancelAppointmentMutation()
  const checkInMutation = useCheckInAppointmentMutation()

  const isEdit = context?.mode === "edit"
  const appointment = context?.appointment
  const fixedPatient = context?.fixedPatient
  const lockedPatientId = fixedPatientId ?? fixedPatient?.id

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
    cancelMutation.isPending ||
    checkInMutation.isPending
  const canCheckIn =
    isEdit &&
    appointment &&
    !appointment.visitId &&
    (appointment.status === "BOOKED" || appointment.status === "CONFIRMED")
  const handleCheckIn = async () => {
    if (!appointment) return
    await checkInMutation.mutateAsync(appointment.id)
    onOpenChange(false)
  }
  const submitCreate = async (
    patientId: string,
    values: AppointmentFormValues
  ) => {
    if (!patientId) {
      toast.error("Thiếu mã bệnh nhân")
      return
    }

    const start = parseFormDatetime(values.scheduledAt)
    const end = parseFormDatetime(values.endedAt)
    if (!start || !end) {
      toast.error("Thời gian không hợp lệ")
      return
    }

    await createMutation.mutateAsync({
      patientId,
      scheduledAt: start.toISOString(),
      endedAt: end.toISOString(),
      doctorName: values.doctorName?.trim() || undefined,
      note: values.note?.trim() || undefined,
      clinicBranch: branch,
    })
    onOpenChange(false)
  }

  const onSubmit = form.handleSubmit(async (values) => {
    const start = parseFormDatetime(values.scheduledAt)
    const end = parseFormDatetime(values.endedAt)
    if (!start || !end) {
      toast.error("Thời gian không hợp lệ")
      return
    }

    const scheduledAt = start.toISOString()
    const endedAt = end.toISOString()

    if (isEdit && appointment) {
      await updateMutation.mutateAsync({
        id: appointment.id,
        payload: {
          scheduledAt,
          endedAt,
          doctorName: values.doctorName?.trim() || undefined,
          note: values.note?.trim() || undefined,
          status: values.status,
        },
      })
      onOpenChange(false)
      return
    }

    await submitCreate(values.patientId, values)
  })

  const handleSubmitClick = async () => {
    if (lockedPatientId && !isEdit) {
      const isTimeValid = await form.trigger(["scheduledAt", "endedAt"])
      if (!isTimeValid) return
      await submitCreate(lockedPatientId, form.getValues())
      return
    }
    await onSubmit()
  }

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
          : lockedPatientId
            ? "Chọn thời gian khám"
            : "Chọn bệnh nhân và thời gian khám"
      }
      footerClassName="w-full sm:justify-between"
      footer={
        <>
          <div className="flex justify-end gap-2">
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
            {canCheckIn ? (
              <Button
                type="button"
                disabled={isPending}
                onClick={() => void handleCheckIn()}
                className="bg-green-500 hover:bg-green-600"
              >
                {checkInMutation.isPending ? "Đang tiếp nhận..." : "Tiếp nhận"}
              </Button>
            ) : null}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={() => void handleSubmitClick()}
            >
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
                {appointment.visitId && appointment.patient?.id ? (
                  <Link to={urlPaths.medicalRecords(appointment.patient.id)}>
                    <span className="mt-2 flex items-center gap-1 text-sm text-blue-500 underline-offset-2 hover:text-blue-600">
                      <ArrowRightIcon className="h-4 w-4" /> Mở hồ sơ khám
                    </span>
                  </Link>
                ) : null}
              </AlertDescription>
            </Alert>
          ) : fixedPatient || lockedPatientId ? (
            <Alert>
              <AlertTitle>{fixedPatient?.fullName ?? "Bệnh nhân"}</AlertTitle>
              <AlertDescription>
                Mã BN: {fixedPatient?.patientCode ?? "—"} ·{" "}
                {fixedPatient?.phone ?? "—"}
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

          <FormAppointmentTimeRange
            control={form.control}
            startName="scheduledAt"
            endName="endedAt"
            label="Thời gian hẹn"
            required
            defaultDurationMinutes={DEFAULT_APPOINTMENT_DURATION_MINUTES}
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
