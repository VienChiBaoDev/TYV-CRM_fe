export const MEDICAL_RECORD_TABS = {
  VISITS: "visits",
  SERVICES: "services",
  PAYMENTS: "payments",
  TREATMENT: "treatment",
  MEDICAL_CASE: "medical-case",
} as const

export type MedicalRecordTab =
  (typeof MEDICAL_RECORD_TABS)[keyof typeof MEDICAL_RECORD_TABS]
