import type { ClinicBranchCode } from "@/app/medical-records/data/patientService"

export interface FollowUpSchedule {
  id: string
  patientId: string
  name: string
  followUpAppointmentDate: string // hạn gốc
  rescheduledFollowUpDate: string | null
  rescheduleNote: string | null
  effectiveFollowUpDate: string // ngày dùng đặt nhanh
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
  readonly rescheduledFollowUpDate: string | null
  readonly rescheduleNote: string | null
  readonly effectiveFollowUpDate: string
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
  doctorId: string
  assistantId?: string
  doctorName?: string
  assistantName?: string
  note?: string
}
export interface SubmitAssessmentPayload {
  assessmentResult: string
  assessmentNote?: string
}

export interface RescheduleFollowUpPayload {
  rescheduledFollowUpDate: string
  note?: string
}
