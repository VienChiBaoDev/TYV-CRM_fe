import { z } from "zod"
import { parseFormDatetime } from "@/lib/date-vi"
import { STAFF_SHIFT_TYPES } from "../services/staffShiftService"

export const staffShiftFormSchema = z
  .object({
    type: z.enum(STAFF_SHIFT_TYPES),
    startAt: z.string().min(1, "Vui lòng chọn giờ bắt đầu"),
    endAt: z.string().min(1, "Vui lòng chọn giờ kết thúc"),
    note: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const start = parseFormDatetime(data.startAt)
    const end = parseFormDatetime(data.endAt)
    if (!start || !end) return
    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Giờ kết thúc phải sau giờ bắt đầu",
        path: ["endAt"],
      })
    }
  })

export type StaffShiftFormValues = z.infer<typeof staffShiftFormSchema>
