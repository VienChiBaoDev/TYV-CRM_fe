import type { PatientService } from "@/app/medical-records/interfaces/patient-service"
import type { PatientServiceFormValues } from "@/app/medical-records/schemas/patient-service-form"
import { PATIENT_SERVICE_STATUS } from "@/app/medical-records/constants/patient-service-status"
import { calculatePatientServiceTotal } from "@/app/medical-records/utils/patient-service-pricing"
import type { TreatmentService } from "@/app/treatment-services/types/treatment-service"

interface PersonRef {
  fullName: string
}

interface MapPatientServiceFormParams {
  values: PatientServiceFormValues
  service: TreatmentService
  consultant: PersonRef
  finalizedBy: PersonRef
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase()
}

function formatFinalizedAt(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${hours}:${minutes} ${day}-${month}-${year}`
}

export function mapPatientServiceFormToRow({
  values,
  service,
  consultant,
  finalizedBy,
}: MapPatientServiceFormParams): PatientService {
  const finalAmount = calculatePatientServiceTotal({
    unitPriceAfterVat: values.unitPriceAfterVat,
    quantity: values.quantity,
    discount: values.discount,
  })

  const hasDiscount = values.discount > 0
  const listPrice = values.unitPriceAfterVat * values.quantity

  return {
    id: crypto.randomUUID(),
    status: PATIENT_SERVICE_STATUS.ACTIVE,
    cancelledAt: null,
    hasPaymentHistory: false,
    serviceCode: service.code,
    serviceName: service.name,
    progress: {
      current: 0,
      total: values.quantity,
      maxAllowed: values.quantity,
    },
    amount: hasDiscount
      ? {
          listPrice,
          otherDiscount: {
            amount: values.discount,
            percent:
              listPrice > 0
                ? Math.round((values.discount / listPrice) * 100)
                : 0,
          },
          finalAmount,
        }
      : {
          finalAmount,
        },
    consultant: {
      name: consultant.fullName,
      initials: getInitials(consultant.fullName),
    },
    note: values.note.trim(),
    finalizedBy: {
      name: finalizedBy.fullName,
      initials: getInitials(finalizedBy.fullName),
    },
    finalizedAt: formatFinalizedAt(new Date()),
    form: {
      consultantId: values.consultantId,
      telesaleId: values.telesaleId || null,
      groupId: values.groupId,
      catalogServiceId: values.serviceId,
      unitPrice: values.unitPrice,
      vatPercent: values.vatPercent,
      vatAmount: values.vatAmount,
      unitPriceAfterVat: values.unitPriceAfterVat,
      quantity: values.quantity,
      discount: values.discount,
      treatmentCount: values.treatmentCount,
      expiryDate: values.expiryDate || null,
    },
  }
}
