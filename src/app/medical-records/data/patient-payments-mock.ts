import type {
  PatientPayment,
  PatientPaymentSummary,
} from "@/app/medical-records/interfaces/patient-payment"

export const MOCK_PAYMENT_SUMMARY: PatientPaymentSummary = {
  servicesTotal: 13_500_000,
  productsTotal: 0,
  depositTotal: 0,
}

export const MOCK_PATIENT_PAYMENTS: PatientPayment[] = [
  {
    id: "1",
    voucherCode: "PTSTYV20260618.57",
    voucherDate: "18-06-2026",
    processedBy: { initials: "NA" },
    paymentMethod: "Chuyển Khoản - MB Đặng Hữu Phúc",
    totalAmount: 300_000,
    details: [
      {
        amount: 300_000,
        serviceCode: "SP20260618.3503",
        serviceName: "Tái khám BS Thu Hương",
      },
    ],
  },
  {
    id: "2",
    voucherCode: "PTSTYV20260615.42",
    voucherDate: "15-06-2026",
    processedBy: { initials: "NH" },
    paymentMethod: "Tiền mặt",
    totalAmount: 6_000_000,
    details: [
      {
        amount: 6_000_000,
        serviceCode: "SP20260615.3488",
        serviceName: "COMBO KHỚP LỚN",
      },
    ],
  },
  {
    id: "3",
    voucherCode: "PTSTYV20260610.31",
    voucherDate: "10-06-2026",
    processedBy: { initials: "HD" },
    paymentMethod: "Chuyển Khoản - Vietcombank",
    totalAmount: 1_200_000,
    details: [
      {
        amount: 463_000,
        serviceCode: "SP20260610.3451",
        serviceName: "KÊ ĐƠN",
      },
      {
        amount: 737_000,
        serviceCode: "SP20260610.3452",
        serviceName: "Điện châm",
      },
    ],
  },
]
