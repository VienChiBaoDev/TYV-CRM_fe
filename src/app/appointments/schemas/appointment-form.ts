import { z } from "zod"

import { APPOINTMENT_STATUSES } from "@/app/appointments/services/appointmentService"
import { parseFormDatetime } from "@/lib/date-vi"

export const appointmentFormSchema = z
  .object({
    patientId: z.string().uuid("Vui lòng chọn bệnh nhân"),
    scheduledAt: z.string().min(1, "Vui lòng chọn ngày và giờ bắt đầu"),
    endedAt: z.string().min(1, "Vui lòng chọn giờ kết thúc"),
    doctorId: z.string().min(1, "Vui lòng chọn bác sĩ"),
    assistantId: z.string().optional(),
    note: z.string().optional(),
    status: z.enum(APPOINTMENT_STATUSES).optional(),
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

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>
