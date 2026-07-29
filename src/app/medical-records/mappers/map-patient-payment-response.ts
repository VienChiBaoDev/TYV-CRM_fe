import type { PatientPayment } from "@/app/medical-records/interfaces/patient-payment"
import type {
  PatientPaymentApi,
  PatientPaymentsListApi,
} from "@/app/medical-records/interfaces/patient-payment-api"

export function mapPatientPaymentFromApi(
  api: PatientPaymentApi
): PatientPayment {
  return {
    id: api.id,
    voucherCode: api.voucherCode,
    voucherDate: api.voucherDate,
    processedBy: { initials: api.processedBy.initials },
    paymentMethod: api.paymentMethod,
    bankAccount: api.bankAccount ?? null,
    totalAmount: api.totalAmount,
    details: api.details.map((detail) => ({
      amount: detail.amount,
      serviceCode: detail.serviceCode,
      serviceName: detail.serviceName,
    })),
  }
}

export function mapPatientPaymentsListFromApi(api: PatientPaymentsListApi) {
  return {
    summary: api.summary,
    payments: api.payments.map(mapPatientPaymentFromApi),
    meta: api.meta,
  }
}
