import type { PatientServiceApi } from "@/app/medical-records/interfaces/patient-service-api"
import type { PatientService } from "@/app/medical-records/interfaces/patient-service"
import type { PatientServiceStatus } from "@/app/medical-records/constants/patient-service-status"

export function mapPatientServiceFromApi(api: PatientServiceApi): PatientService {
  return {
    id: api.id,
    status: api.status as PatientServiceStatus,
    cancelledAt: api.cancelledAt,
    hasPaymentHistory: api.hasPaymentHistory,
    serviceCode: api.serviceCode,
    serviceName: api.serviceName,
    progress: api.progress,
    amount: api.amount,
    consultant: api.consultant,
    note: api.note,
    finalizedBy: api.finalizedBy,
    finalizedAt: api.finalizedAt,
    form: api.form,
  }
}
