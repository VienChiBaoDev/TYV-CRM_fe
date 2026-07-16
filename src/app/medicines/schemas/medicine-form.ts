import { z } from "zod"

export const medicineFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên thuốc")
    .max(200, "Tên tối đa 200 ký tự"),
  unit: z.string().min(1, "Vui lòng chọn đơn vị"),
  unitPrice: z.coerce.number().min(0, "Giá không được âm"),
  category: z
    .string()
    .trim()
    .max(100, "Loại thuốc tối đa 100 ký tự")
    .optional(),
})

export type MedicineFormInput = z.input<typeof medicineFormSchema>
export type MedicineFormValues = z.output<typeof medicineFormSchema>

export const medicineFormDefaultValues: MedicineFormInput = {
  name: "",
  unit: "g",
  unitPrice: 0,
  category: "",
}
