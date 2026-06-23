export interface FollowUpSchedule {
  id: string
  name: string
  followUpAppointmentDate: string
  physicianInCharge: string
  facility: string
  status: number | string
}

export interface ClinicalAssessmentScale {
  id: string
  name: string
  appointmentDate: string
  physicianInCharge: string
  result: string | number
  note: string
}
