import type {
  ClinicalAssessmentScale,
  FollowUpSchedule,
} from "../interfaces/StandardMedicalRecord"

export const standardMedicalRecords = [
  {
    id: "1",
    name: "John Doe",
    followUpAppointmentDate: "2026-01-01",
    physicianInCharge: "100000",
    facility: "Hospital A",
    status: "1",
  },
  {
    id: "2",
    name: "Jane Doe",
    followUpAppointmentDate: "2026-01-02",
    physicianInCharge: "200000",
    facility: "Hospital B",
    status: "2",
  },
] as FollowUpSchedule[]

export const clinicalAssessmentScales = [
  {
    id: "1",
    name: "John Doe",
    appointmentDate: "2026-01-01",
    physicianInCharge: "Nguyễn Văn A",
    result: "1",
    note: "Good",
  },
  {
    id: "2",
    name: "Jane Doe",
    appointmentDate: "2026-01-02",
    physicianInCharge: "Nguyễn Văn A",
    result: "2",
    note: "Good",
  },
  {
    id: "3",
    name: "John Doe",
    appointmentDate: "2026-01-03",
    physicianInCharge: "Nguyễn Văn A",
    result: "3",
    note: "Good",
  },
  {
    id: "4",
    name: "John Doe",
    appointmentDate: "2026-01-04",
    physicianInCharge: "Nguyễn Văn A",
    result: "4",
    note: "Good",
  },
  {
    id: "5",
    name: "John Doe",
    appointmentDate: "2026-01-05",
    physicianInCharge: "Nguyễn Văn B",
    result: "5",
    note: "Good",
  },
  {
    id: "6",
    name: "John Doe",
    appointmentDate: "2026-01-06",
    physicianInCharge: "Nguyễn Văn C",
    result: null,
    note: null,
  },
] as ClinicalAssessmentScale[]
