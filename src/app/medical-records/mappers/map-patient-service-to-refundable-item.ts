// src/app/medical-records/mappers/map-patient-service-to-refundable-item.ts
import { formatDateVi } from "@/lib/date-vi"
import { isPatientServiceActive } from "../constants/patient-service-status"
import type { PatientService } from "../interfaces/patient-service"
import type { RefundablePaymentItem } from "../interfaces/refundable-payment-item"

function calcTreatedAmount(service: PatientService): number {
  const { finalAmount } = service.amount
  const { current, total } = service.progress
  if (total <= 0) return 0
  return Math.round((finalAmount * current) / total)
}

export function mapPatientServiceToRefundableItem(
  service: PatientService,
  patientName: string
): RefundablePaymentItem {
  const paidAmount = service.amount.paidAmount ?? 0
  return {
    id: service.id,
    name: service.serviceName,
    patientName,
    date: formatDateVi(service.finalizedAt),
    totalAmount: service.amount.finalAmount,
    paidAmount,
    treatedAmount: calcTreatedAmount(service),
  }
}

export function mapPatientServicesToRefundableItems(
  services: PatientService[],
  patientName: string
): RefundablePaymentItem[] {
  return services
    .filter((service) => isPatientServiceActive(service.status))
    .map((s) => mapPatientServiceToRefundableItem(s, patientName))
    .filter((item) => item.paidAmount - item.treatedAmount > 0)
}
