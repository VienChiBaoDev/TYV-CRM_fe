export const MEDICAL_RECORD_TABS = {
  VISITS: "visits",
  TREATMENT: "treatment",
} as const

export type MedicalRecordTab =
  (typeof MEDICAL_RECORD_TABS)[keyof typeof MEDICAL_RECORD_TABS]
