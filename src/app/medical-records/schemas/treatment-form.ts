import { z } from "zod"

const consumableLineSchema = z.object({
  consumableId: z.string(),
  quantity: z.number(),
})

export const treatmentFormSchema = z.object({
  doctorId: z.string().optional(),
  ptKtvId: z.string().optional(),
  professionalSupport: z.string().optional(),
  nextTreatmentDate: z.string().optional(),
  nextContent: z.string().optional(),
  note: z.string().optional(),
  treatmentContent: z.string().min(1, "Vui lòng nhập nội dung điều trị"),
  currentSession: z.number().min(1),
  consumables: z.array(consumableLineSchema),
})

export type TreatmentFormInput = z.input<typeof treatmentFormSchema>
export type TreatmentFormValues = z.output<typeof treatmentFormSchema>

export const treatmentFormDefaultValues: TreatmentFormInput = {
  doctorId: "",
  ptKtvId: "",
  professionalSupport: "",
  nextTreatmentDate: "",
  nextContent: "",
  note: "",
  treatmentContent: "",
  currentSession: 1,
  consumables: [],
}
