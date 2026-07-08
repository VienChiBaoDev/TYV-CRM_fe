import { formatDateVi } from "@/lib/date-vi"
import { isPatientServiceActive } from "../constants/patient-service-status"
import type { PatientService } from "../interfaces/patient-service"
import type { UnpaidPaymentItem } from "../interfaces/patient-unpaid-item"

// Dùng để map service chưa thanh toán thành item trong dialog thanh toán
export function mapPatientServiceToUnpaidItem(
  service: PatientService,
  patientName: string
): UnpaidPaymentItem {
  const totalAmount = service.amount.finalAmount
  const paidAmount = service.amount.paidAmount ?? 0

  return {
    id: service.id,
    name: service.serviceName,
    patientName,
    date: formatDateVi(service.finalizedAt),
    totalAmount,
    paidAmount,
    unpaidAmount: Math.max(0, totalAmount - paidAmount),
  }
}

// Dùng để map các service chưa thanh toán thành các item trong dialog thanh toán
export function mapPatientServicesToUnpaidItems(
  services: PatientService[],
  patientName: string
): UnpaidPaymentItem[] {
  return services
    .filter((service) => isPatientServiceActive(service.status))
    .map((service) => mapPatientServiceToUnpaidItem(service, patientName))
    .filter((item) => item.unpaidAmount > 0)
}
