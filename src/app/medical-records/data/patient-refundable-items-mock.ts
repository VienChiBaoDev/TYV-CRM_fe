import type { RefundablePaymentItem } from "@/app/medical-records/interfaces/refundable-payment-item"

export const MOCK_REFUNDABLE_PAYMENT_ITEMS: RefundablePaymentItem[] = [
  {
    id: "refund-1",
    name: "Tái khám BS Thu Hương",
    patientName: "NhatAnh",
    date: "15-06-2026",
    totalAmount: 300_000,
    paidAmount: 300_000,
    treatedAmount: 300_000,
  },
  {
    id: "refund-2",
    name: "COMBO KHỚP LỚN",
    patientName: "NhatAnh",
    date: "10-06-2026",
    totalAmount: 6_000_000,
    paidAmount: 6_000_000,
    treatedAmount: 3_600_000,
  },
  {
    id: "refund-3",
    name: "Điện châm",
    patientName: "NhatAnh",
    date: "18-06-2026",
    totalAmount: 737_000,
    paidAmount: 737_000,
    treatedAmount: 0,
  },
]
