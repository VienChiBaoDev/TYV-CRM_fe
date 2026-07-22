import { z } from "zod"

export const consumableFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên vật tư"),
  unit: z.string().min(1, "Vui lòng nhập đơn vị"),
  note: z.string().optional(),
  sessionQuotaText: z.string().optional(),
  isActive: z.boolean(),
})

export type ConsumableFormInput = z.input<typeof consumableFormSchema>
export type ConsumableFormValues = z.output<typeof consumableFormSchema>

export const consumableFormDefaultValues: ConsumableFormInput = {
  name: "",
  unit: "",
  note: "",
  sessionQuotaText: "",
  isActive: true,
}

export const stockInFormSchema = z.object({
  quantity: z.coerce.number().positive("Số lượng phải > 0"),
  note: z.string().optional(),
})

export type StockInFormInput = z.input<typeof stockInFormSchema>
export type StockInFormValues = z.output<typeof stockInFormSchema>

export const stockInFormDefaultValues: StockInFormInput = {
  quantity: 1,
  note: "",
}
