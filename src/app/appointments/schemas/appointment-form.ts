import { z } from "zod"

import { APPOINTMENT_STATUSES } from "@/app/medical-records/data/appointmentService"

export const appointmentFormSchema = z.object({
  patientId: z.string().uuid("Vui lòng chọn bệnh nhân"),
  scheduledAt: z.string().min(1, "Vui lòng chọn ngày và giờ hẹn"),
  doctorName: z.string().optional(),
  note: z.string().optional(),
  status: z.enum(APPOINTMENT_STATUSES).optional(),
})

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>
