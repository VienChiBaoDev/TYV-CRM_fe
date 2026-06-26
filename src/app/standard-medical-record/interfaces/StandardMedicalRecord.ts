import type { ClinicBranchCode } from "@/app/medical-records/data/patientService"

export interface FollowUpSchedule {
  id: string
  patientId: string
  name: string
  followUpAppointmentDate: string
  physicianInCharge: string
  facility: string
  status: number // 1 = đã đặt, 2 = chưa đặt
}

export interface ClinicalAssessmentScale {
  id: string
  patientId: string
  name: string
  appointmentDate: string
  followUpDate: string
  physicianInCharge: string
  result: number | null
  note: string | null
}

// --- API response types (khớp BE) ---
export interface FollowUpScheduleApiResponse {
  readonly id: string
  readonly patientId: string
  readonly patientName: string
  readonly patientCode: string
  readonly followUpDate: string
  readonly physicianInCharge: string
  readonly facility: ClinicBranchCode
  readonly facilityLabel: string
  readonly scheduleStatus: "SCHEDULED" | "NOT_SCHEDULED"
  readonly scheduleStatusFe: number
  readonly originatingVisitId: string
}
export interface PendingAssessmentApiResponse {
  readonly id: string
  readonly patientId: string
  readonly patientName: string
  readonly assessmentDate: string
  readonly followUpDate: string
  readonly physicianInCharge: string
  readonly assessmentResult: string | null
  readonly assessmentResultFe: number | null
  readonly assessmentNote: string | null
}
export interface ScheduleFollowUpPayload {
  scheduledAt: string
  endedAt?: string
  doctorName?: string
  note?: string
}
export interface SubmitAssessmentPayload {
  assessmentResult: string
  assessmentNote?: string
}
