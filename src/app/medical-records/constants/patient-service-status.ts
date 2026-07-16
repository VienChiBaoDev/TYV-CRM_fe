export const PATIENT_SERVICE_STATUS = {
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
} as const

export type PatientServiceStatus =
  (typeof PATIENT_SERVICE_STATUS)[keyof typeof PATIENT_SERVICE_STATUS]

export function isPatientServiceActive(status: PatientServiceStatus): boolean {
  return status === PATIENT_SERVICE_STATUS.ACTIVE
}
