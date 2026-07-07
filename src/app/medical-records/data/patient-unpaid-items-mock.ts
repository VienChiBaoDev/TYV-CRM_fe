import type { UnpaidPaymentItem } from "@/app/medical-records/interfaces/patient-unpaid-item"

export const MOCK_UNPAID_PAYMENT_ITEMS: UnpaidPaymentItem[] = [
  {
    id: "unpaid-1",
    name: "KÊ ĐƠN THUỐC YHCT",
    patientName: "NhatAnh",
    date: "22-06-2026",
    totalAmount: 463_000,
    paidAmount: 0,
    unpaidAmount: 463_000,
  },
  {
    id: "unpaid-3",
    name: "KÊ ĐƠN THUỐC YHCT",
    patientName: "NhatAnh",
    date: "20-06-2026",
    totalAmount: 280_000,
    paidAmount: 100_000,
    unpaidAmount: 180_000,
  },
  {
    id: "unpaid-4",
    name: "Điện châm",
    patientName: "NhatAnh",
    date: "18-06-2026",
    totalAmount: 737_000,
    paidAmount: 0,
    unpaidAmount: 737_000,
  },
  {
    id: "unpaid-5",
    name: "Tái khám BS Thu Hương",
    patientName: "NhatAnh",
    date: "15-06-2026",
    totalAmount: 300_000,
    paidAmount: 0,
    unpaidAmount: 300_000,
  },
]
