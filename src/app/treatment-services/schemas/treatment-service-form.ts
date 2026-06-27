import { z } from "zod"

import { SERVICE_ITEM_TYPE } from "../types/treatment-service"

export const treatmentServiceFormSchema = z.object({
  code: z.string(),
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên dịch vụ/sản phẩm")
    .max(200, "Tên tối đa 200 ký tự"),
  itemType: z.enum([SERVICE_ITEM_TYPE.SERVICE, SERVICE_ITEM_TYPE.PRODUCT], {
    message: "Vui lòng chọn loại",
  }),
  unit: z.string().min(1, "Vui lòng chọn đơn vị"),
  groupId: z.string().min(1, "Vui lòng chọn nhóm"),
  minPrice: z.coerce.number().min(0, "Giá không được âm"),
  maxPrice: z.coerce.number().min(0, "Giá không được âm"),
  minPriceVat: z.coerce.number().min(0, "Giá không được âm"),
  maxPriceVat: z.coerce.number().min(0, "Giá không được âm"),
  expiryDays: z.coerce
    .number()
    .int("Hạn sử dụng phải là số nguyên")
    .min(0, "Không được âm"),
  note: z.string(),
})

export type TreatmentServiceFormInput = z.input<typeof treatmentServiceFormSchema>
export type TreatmentServiceFormValues = z.output<
  typeof treatmentServiceFormSchema
>

export const treatmentServiceFormDefaultValues: TreatmentServiceFormInput = {
  code: "",
  name: "",
  itemType: SERVICE_ITEM_TYPE.SERVICE,
  unit: "Buổi",
  groupId: "",
  minPrice: 0,
  maxPrice: 0,
  minPriceVat: 0,
  maxPriceVat: 0,
  expiryDays: 0,
  note: "",
}
