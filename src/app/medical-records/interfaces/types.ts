export interface Herb {
  name: string
  weight: string
}

export type ClinicalImageCategory =
  import("@/app/medical-records/constants/clinical-image").ClinicalImageCategory

export interface ClinicalImage {
  id: string
  imageUrl: string
  category: ClinicalImageCategory
  sortOrder: number
}

export type TreatmentStatus =
  | "Đang điều trị"
  | "Cần theo dõi"
  | "Kết thúc đợt"

export interface VisitFollowUpPlan {
  /** ISO date (yyyy-MM-dd) — maps to PatientFollowUp.followUpDate */
  followUpDate: string
  /** Days before follow-up to assess — BE derives assessmentDate */
  reminderDaysBefore: number
  /** Maps to Patient.customer_status when persisting */
  treatmentStatus: TreatmentStatus
}

export interface Visit {
  id: string
  visitNumber: number
  title: string // e.g., "Khám đầu tiên", "Tái khám lần 1"
  date: string // "DD/MM/YYYY" or "DD/MM"
  doctor: string
  mode: "Online" | "Trực tiếp"
  location: string
  bloodPressure: string // e.g. "125/83"
  pulse: string // e.g. "83"
  symptoms: string
  pulseDiagnosis: {
    ta: string // Mạch tả
    huu: string // Mạch hữu
    bung: string // Bụng
  }
  prescriptionFormula: string // TIỂU SÀI HỒ GIA GIẢM
  prescriptionDosage: string // 7 THÁNG x 14 TÚI 150ML
  herbs: Herb[]
  clinicalImages?: ClinicalImage[]
  labResults?: string
  status: "Khám đầu" | "Tái khám" | "Online" | "Cần TD" | "Kế hoạch"
  followUpPlan?: VisitFollowUpPlan
}

export interface Patient {
  id: string
  patientCode: string
  name: string
  gender: "Nam" | "Nữ"
  age: number
  job: string
  phone: string
  address: string
  tags: string[]
  dietRestrictions: string[] // Kiêng
  metricVisitsCount: number
  metricTreatmentDays: number
  metricNextExamination: string
  avatarInitials: string
  visits: Visit[]
}
