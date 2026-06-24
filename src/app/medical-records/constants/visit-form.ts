import type {
  TreatmentStatus,
  Visit,
  VisitFollowUpPlan,
} from "@/app/medical-records/interfaces/types"

export const VISIT_STATUSES = [
  "Khám đầu",
  "Tái khám",
  "Online",
  "Cần TD",
  "Kế hoạch",
] as const satisfies readonly Visit["status"][]

export const REMINDER_DAYS_OPTIONS = [3, 7, 14] as const

export const TREATMENT_STATUS_OPTIONS = [
  "Đang điều trị",
  "Cần theo dõi",
  "Kết thúc đợt",
] as const satisfies readonly TreatmentStatus[]

export type VisitFormMode = "add" | "edit"

export function getDefaultFollowUpPlan(): VisitFollowUpPlan {
  return {
    followUpDate: "",
    reminderDaysBefore: 3,
    treatmentStatus: "Đang điều trị",
  }
}

export function computeAssessmentDateIso(
  followUpDateIso: string,
  reminderDaysBefore: number
): string | null {
  if (!followUpDateIso) return null

  const [year, month, day] = followUpDateIso.split("-").map(Number)
  if (!year || !month || !day) return null

  const followUp = new Date(year, month - 1, day)
  if (Number.isNaN(followUp.getTime())) return null

  followUp.setDate(followUp.getDate() - reminderDaysBefore)

  const y = followUp.getFullYear()
  const m = String(followUp.getMonth() + 1).padStart(2, "0")
  const d = String(followUp.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function formatIsoDateToVi(isoDate: string): string {
  const [year, month, day] = isoDate.split("-")
  if (!year || !month || !day) return isoDate
  return `${day}/${month}/${year}`
}

export function getDefaultVisitForm(): Partial<Visit> {
  return {
    title: "Tái khám định kỳ",
    date: new Date().toLocaleDateString("vi-VN"),
    doctor: "BS Phi Hưng",
    mode: "Trực tiếp",
    location: "Hàng Bông",
    bloodPressure: "120/80",
    pulse: "75",
    status: "Tái khám",
    symptoms: "",
    pulseDiagnosis: { ta: "", huu: "", bung: "" },
    prescriptionFormula: "TIỂU SÀI HỒ GIA GIẢM",
    prescriptionDosage: "7 THÁNG x 14 TÚI 150ML",
    herbs: [],
    clinicalImages: [],
    labResults: "",
    followUpPlan: getDefaultFollowUpPlan(),
  }
}
