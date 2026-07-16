import { z } from "zod"

import { SERVICE_ITEM_TYPE } from "../types/treatment-service"

export const serviceGroupFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập mã nhóm")
    .max(10, "Mã nhóm tối đa 10 ký tự"),
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên nhóm")
    .max(200, "Tên nhóm tối đa 200 ký tự"),
  itemType: z.enum([SERVICE_ITEM_TYPE.SERVICE, SERVICE_ITEM_TYPE.PRODUCT], {
    message: "Vui lòng chọn loại",
  }),
})

export type ServiceGroupFormValues = z.infer<typeof serviceGroupFormSchema>

export const serviceGroupFormDefaultValues: ServiceGroupFormValues = {
  code: "",
  name: "",
  itemType: SERVICE_ITEM_TYPE.SERVICE,
}
