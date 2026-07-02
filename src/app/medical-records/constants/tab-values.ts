export const MEDICAL_RECORD_TABS = {
  VISITS: "visits",
  SERVICES: "services",
  TREATMENT: "treatment",
} as const

export type MedicalRecordTab =
  (typeof MEDICAL_RECORD_TABS)[keyof typeof MEDICAL_RECORD_TABS]
