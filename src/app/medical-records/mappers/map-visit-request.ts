import axios from "axios"
import type {
  TreatmentStatus,
  Visit,
  VisitFollowUpPlan,
  Herb,
} from "@/app/medical-records/interfaces/types"
import type { MedicalVisitApiResponse } from "@/app/medical-records/mappers/map-patient-response"

export interface CreateMedicalVisitApiPayload {
  visit: VisitBodyApiPayload
  followUpPlan?: FollowUpPlanApiPayload
}

export interface UpdateMedicalVisitApiPayload {
  visit?: VisitBodyApiPayload
  followUpPlan?: FollowUpPlanApiPayload | null
}

interface VisitBodyApiPayload {
  title: string
  visitDate: string
  doctorName: string
  mode: MedicalVisitApiResponse["mode"]
  location: string
  status: MedicalVisitApiResponse["status"]
  bloodPressure?: string
  pulse?: string
  symptoms?: string
  pulseDiagnosis?: {
    ta?: string
    huu?: string
    bung?: string
  }
  prescriptionFormula?: string
  prescriptionDosage?: string
  labResults?: string
  herbs?: VisitHerbApiPayload[]
}

interface VisitHerbApiPayload {
  name: string
  weight: string
  medicineId?: string
  unit?: string
  quantity?: number
  unitPrice?: number
  lineTotal?: number
  decoctionOrder?: string
  decoctionPrep?: string
}

interface FollowUpPlanApiPayload {
  followUpDate: string
  reminderDaysBefore: number
  treatmentStatus: "IN_TREATMENT" | "EXAMINING" | "COMPLETED"
}

const VISIT_MODE_TO_API: Record<Visit["mode"], MedicalVisitApiResponse["mode"]> =
  {
    Online: "ONLINE",
    "Trực tiếp": "IN_PERSON",
  }

const VISIT_STATUS_TO_API: Record<
  Visit["status"],
  MedicalVisitApiResponse["status"]
> = {
  "Khám đầu": "INITIAL_EXAM",
  "Tái khám": "FOLLOW_UP",
  Online: "ONLINE",
  "Cần TD": "NEED_ADJUSTMENT",
  "Kế hoạch": "PLANNED",
}

const TREATMENT_STATUS_TO_API: Record<
  TreatmentStatus,
  FollowUpPlanApiPayload["treatmentStatus"]
> = {
  "Đang điều trị": "IN_TREATMENT",
  "Cần theo dõi": "EXAMINING",
  "Kết thúc đợt": "COMPLETED",
}

export function parseViDateToIso(dateVi: string): string {
  const trimmed = dateVi.trim()
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (isoMatch) return trimmed

  const viMatch = /^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/.exec(trimmed)
  if (!viMatch) {
    throw new Error("Ngày khám không hợp lệ. Dùng định dạng DD/MM/YYYY.")
  }

  const day = viMatch[1].padStart(2, "0")
  const month = viMatch[2].padStart(2, "0")
  const year = viMatch[3] ?? String(new Date().getFullYear())

  return `${year}-${month}-${day}`
}

function mapFollowUpPlanToApi(
  plan: VisitFollowUpPlan
): FollowUpPlanApiPayload {
  return {
    followUpDate: plan.followUpDate,
    reminderDaysBefore: plan.reminderDaysBefore,
    treatmentStatus: TREATMENT_STATUS_TO_API[plan.treatmentStatus],
  }
}

function mapHerbToApi(herb: Herb): VisitHerbApiPayload {
  const payload: VisitHerbApiPayload = {
    name: herb.name.trim(),
    weight: herb.weight.trim(),
  }

  if (herb.medicineId) payload.medicineId = herb.medicineId
  if (herb.unit) payload.unit = herb.unit
  if (herb.quantity != null) payload.quantity = herb.quantity
  if (herb.unitPrice != null) payload.unitPrice = herb.unitPrice

  const lineTotal =
    herb.lineTotal ??
    (herb.quantity != null && herb.unitPrice != null
      ? herb.quantity * herb.unitPrice
      : undefined)
  if (lineTotal != null) payload.lineTotal = lineTotal
  if (herb.decoctionOrder) payload.decoctionOrder = herb.decoctionOrder
  if (herb.decoctionPrep) payload.decoctionPrep = herb.decoctionPrep

  return payload
}

function mapVisitBodyToApi(visit: Partial<Visit>): VisitBodyApiPayload {
  const mode = visit.mode ?? "Trực tiếp"
  const status = visit.status ?? "Tái khám"
  const dateSource = visit.date?.trim()

  if (!visit.title?.trim()) {
    throw new Error("Tiêu đề lần khám là bắt buộc.")
  }
  if (!dateSource) {
    throw new Error("Ngày khám là bắt buộc.")
  }
  if (!visit.doctor?.trim()) {
    throw new Error("Bác sĩ khám là bắt buộc.")
  }
  if (!visit.location?.trim()) {
    throw new Error("Địa điểm là bắt buộc.")
  }

  const pulseDiagnosis = visit.pulseDiagnosis
  const hasPulseDiagnosis =
    pulseDiagnosis?.ta || pulseDiagnosis?.huu || pulseDiagnosis?.bung

  return {
    title: visit.title.trim(),
    visitDate: parseViDateToIso(dateSource),
    doctorName: visit.doctor.trim(),
    mode: VISIT_MODE_TO_API[mode],
    location: visit.location.trim(),
    status: VISIT_STATUS_TO_API[status],
    bloodPressure: visit.bloodPressure?.trim() || undefined,
    pulse: visit.pulse?.trim() || undefined,
    symptoms: visit.symptoms?.trim() || undefined,
    pulseDiagnosis: hasPulseDiagnosis
      ? {
          ta: pulseDiagnosis?.ta?.trim() || undefined,
          huu: pulseDiagnosis?.huu?.trim() || undefined,
          bung: pulseDiagnosis?.bung?.trim() || undefined,
        }
      : undefined,
    prescriptionFormula: visit.prescriptionFormula?.trim() || undefined,
    prescriptionDosage: visit.prescriptionDosage?.trim() || undefined,
    labResults: visit.labResults?.trim() || undefined,
    herbs: visit.herbs?.length
      ? visit.herbs.map(mapHerbToApi)
      : undefined,
  }
}

export function mapVisitFormToCreatePayload(
  visit: Partial<Visit>
): CreateMedicalVisitApiPayload {
  const payload: CreateMedicalVisitApiPayload = {
    visit: mapVisitBodyToApi(visit),
  }

  if (visit.followUpPlan?.followUpDate) {
    payload.followUpPlan = mapFollowUpPlanToApi(visit.followUpPlan)
  }

  return payload
}

export function mapVisitFormToUpdatePayload(
  visit: Partial<Visit>
): UpdateMedicalVisitApiPayload {
  const payload: UpdateMedicalVisitApiPayload = {
    visit: mapVisitBodyToApi(visit),
  }

  if (visit.followUpPlan?.followUpDate) {
    payload.followUpPlan = mapFollowUpPlanToApi(visit.followUpPlan)
  } else {
    payload.followUpPlan = null
  }

  return payload
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (typeof message === "string") return message
    if (Array.isArray(message)) return message.join(", ")
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return "Không thể lưu phiếu khám. Vui lòng thử lại."
}
