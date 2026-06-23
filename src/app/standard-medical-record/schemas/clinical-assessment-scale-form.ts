import { z } from "zod"

export const clinicalAssessmentScaleFormSchema = z.object({
  name: z.string().min(1),
  appointmentDate: z.string().min(1),
  physicianInCharge: z.string().min(1),
  result: z.union([
    z.string().min(1, "Vui lòng chọn kết quả"),
    z.number(),
  ]),
  note: z.string(),
})

export type ClinicalAssessmentScaleFormValues = z.infer<
  typeof clinicalAssessmentScaleFormSchema
>

export const clinicalAssessmentScaleFormDefaultValues: ClinicalAssessmentScaleFormValues =
  {
    name: "",
    appointmentDate: "",
    physicianInCharge: "",
    result: "",
    note: "",
  }
