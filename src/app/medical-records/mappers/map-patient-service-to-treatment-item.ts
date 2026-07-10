import { formatDateVi, formatDatetimeVi } from "@/lib/date-vi"
import { isPatientServiceActive } from "../constants/patient-service-status"
import type { PatientService } from "../interfaces/patient-service"

export interface TreatmentServiceItem {
  id: string
  time: string
  progress: string
  name: string
  consultant: string
  date: string
  totalSessions: number
  completedSession: number
  activeSession: number
}

export function isPatientServicePaid(service: PatientService): boolean {
  return (service.amount.paidAmount ?? 0) > 0
}

export function isPatientServiceTreatmentInProgress(
  service: PatientService
): boolean {
  const { current, total } = service.progress
  return total <= 0 || current < total
}

export function mapPatientServiceToTreatmentItem(
  service: PatientService
): TreatmentServiceItem {
  const { current, total } = service.progress
  // số lần hoàn thành
  const completedSession = Math.min(current, total)
  // số lần đang diễn ra
  const activeSession =
    total > 0 ? Math.min(completedSession + 1, total) : 1

  return {
    id: service.id,
    time: formatDatetimeVi(service.finalizedAt),
    progress: `${completedSession} | ${total}`,
    name: service.serviceName,
    consultant: service.consultant.name,
    date: formatDateVi(service.finalizedAt),
    totalSessions: total,
    completedSession,
    activeSession,
  }
}

export function mapPatientServicesToTreatmentItems(
  services: PatientService[]
): TreatmentServiceItem[] {
  return services
    .filter(
      (service) =>
        isPatientServiceActive(service.status) && isPatientServicePaid(service)
    )
    .map(mapPatientServiceToTreatmentItem)
}
