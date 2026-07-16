import { z } from "zod"

export const PATIENT_SERVICE_MODE = {
  SERVICE: "service",
  COMBO: "combo",
} as const

export type PatientServiceMode =
  (typeof PATIENT_SERVICE_MODE)[keyof typeof PATIENT_SERVICE_MODE]

export const patientServiceFormSchema = z.object({
  consultantId: z.string().min(1, "Vui lòng chọn người tư vấn"),
  telesaleId: z.string(),
  serviceMode: z.enum([
    PATIENT_SERVICE_MODE.SERVICE,
    PATIENT_SERVICE_MODE.COMBO,
  ]),
  groupId: z.string().min(1, "Vui lòng chọn nhóm dịch vụ"),
  serviceId: z.string().min(1, "Vui lòng chọn dịch vụ"),
  unitPrice: z.coerce.number().min(0, "Đơn giá không được âm"),
  vatPercent: z.coerce.number().min(0, "VAT không được âm"),
  vatAmount: z.coerce.number().min(0),
  unitPriceAfterVat: z.coerce.number().min(0, "Giá sau VAT không được âm"),
  quantity: z.coerce
    .number()
    .int("Số buổi phải là số nguyên")
    .min(1, "Số buổi tối thiểu là 1"),
  discount: z.coerce.number().min(0, "Chiết khấu không được âm"),
  treatmentCount: z.coerce.number().int().min(0),
  expiryDate: z.string(),
  note: z.string(),
})

export type PatientServiceFormInput = z.input<typeof patientServiceFormSchema>
export type PatientServiceFormValues = z.output<typeof patientServiceFormSchema>

export const patientServiceFormDefaultValues: PatientServiceFormInput = {
  consultantId: "",
  telesaleId: "",
  serviceMode: PATIENT_SERVICE_MODE.SERVICE,
  groupId: "",
  serviceId: "",
  unitPrice: 0,
  vatPercent: 0,
  vatAmount: 0,
  unitPriceAfterVat: 0,
  quantity: 1,
  discount: 0,
  treatmentCount: 0,
  expiryDate: "",
  note: "",
}
