import type {
  FollowUpSchedule,
  ClinicalAssessmentScale,
} from "../interfaces/StandardMedicalRecord"
import type {
  FollowUpScheduleApiResponse,
  PendingAssessmentApiResponse,
} from "../interfaces/StandardMedicalRecord"

export function mapToFollowUpSchedule(
  row: FollowUpScheduleApiResponse
): FollowUpSchedule {
  return {
    id: row.id,
    patientId: row.patientId,
    name: row.patientName,
    followUpAppointmentDate: row.followUpDate,
    rescheduledFollowUpDate: row.rescheduledFollowUpDate,
    rescheduleNote: row.rescheduleNote,
    effectiveFollowUpDate: row.effectiveFollowUpDate,
    physicianInCharge: row.physicianInCharge,
    facility: row.facilityLabel,
    status: row.scheduleStatusFe,
  }
}

export function mapToClinicalAssessment(
  row: PendingAssessmentApiResponse
): ClinicalAssessmentScale {
  return {
    id: row.id,
    patientId: row.patientId,
    name: row.patientName,
    appointmentDate: row.assessmentDate,
    followUpDate: row.followUpDate,
    physicianInCharge: row.physicianInCharge,
    result: row.assessmentResultFe,
    note: row.assessmentNote,
  }
}

// Map số FE → enum string gửi BE
const FE_RESULT_TO_API: Record<number, string> = {
  1: "GOOD_PROGRESS",
  2: "NORMAL",
  3: "NEED_CONSULTATION",
  4: "GOOD_PROGRESS_ALT",
  5: "CANCELLED",
}

export function mapFeResultToApi(feValue: number | string): string {
  const num = typeof feValue === "string" ? Number(feValue) : feValue
  return FE_RESULT_TO_API[num] ?? "NORMAL"
}
