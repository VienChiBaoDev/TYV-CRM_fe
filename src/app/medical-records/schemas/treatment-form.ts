import { z } from "zod"

export const treatmentFormSchema = z.object({
  doctor: z.string(),
  ptKtv: z.string(),
  professionalSupport: z.string(),
  nextTreatmentDate: z.string().min(1, "Vui lòng nhập ngày điều trị kế tiếp"),
  nextContent: z.string(),
  note: z.string(),
  treatmentContent: z.string(),
  currentSession: z.number().min(1),
})

export type TreatmentFormValues = z.infer<typeof treatmentFormSchema>

export const treatmentFormDefaultValues: TreatmentFormValues = {
  doctor: "",
  ptKtv: "",
  professionalSupport: "",
  nextTreatmentDate: "22-06-2026 13:31:52",
  nextContent: "",
  note: "",
  treatmentContent: "",
  currentSession: 9,
}
