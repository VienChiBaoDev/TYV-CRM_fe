import { z } from "zod"

export const PAYMENT_METHOD = {
  CASH: "cash",
  BANK_TRANSFER: "bank_transfer",
} as const

export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD]

export const patientPaymentFormSchema = z
  .object({
    paymentMethod: z.enum([PAYMENT_METHOD.CASH, PAYMENT_METHOD.BANK_TRANSFER]),
    /** Id tài khoản ngân hàng khai báo ở màn Cài đặt. */
    bankAccountId: z.string(),
    bankCode: z.string(),
    createdAt: z.string().min(1, "Vui lòng chọn ngày tạo"),
    branch: z.string().min(1, "Vui lòng chọn chi nhánh"),
    content: z.string(),
  })
  .superRefine((values, ctx) => {
    // Chuyển khoản thì bắt buộc biết tiền vào tài khoản nào.
    if (
      values.paymentMethod === PAYMENT_METHOD.BANK_TRANSFER &&
      !values.bankAccountId
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["bankAccountId"],
        message: "Vui lòng chọn tài khoản nhận tiền",
      })
    }
  })

export type PatientPaymentFormInput = z.input<typeof patientPaymentFormSchema>
export type PatientPaymentFormValues = z.output<typeof patientPaymentFormSchema>

export const patientPaymentFormDefaultValues: PatientPaymentFormInput = {
  paymentMethod: PAYMENT_METHOD.CASH,
  bankAccountId: "",
  bankCode: "",
  createdAt: "",
  branch: "",
  content: "",
}
