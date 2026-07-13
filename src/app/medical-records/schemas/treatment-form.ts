import { z } from "zod"

export const treatmentFormSchema = z.object({
  doctorId: z.string().optional(),
  ptKtvId: z.string().optional(),
  professionalSupport: z.string().optional(),
  nextTreatmentDate: z.string().optional(),
  nextContent: z.string().optional(),
  note: z.string().optional(),
  treatmentContent: z.string().min(1, "Vui lòng nhập nội dung điều trị"),
  currentSession: z.number().min(1),
})

export type TreatmentFormValues = z.infer<typeof treatmentFormSchema>

export const treatmentFormDefaultValues: TreatmentFormValues = {
  doctorId: "",
  ptKtvId: "",
  professionalSupport: "",
  nextTreatmentDate: "",
  nextContent: "",
  note: "",
  treatmentContent: "",
  currentSession: 1,
}
