export type {
  AssignedStaff,
  CreatePatientPayload,
  FetchPatientsParams,
  Gender,
  PatientApi as Patient,
  UpdatePatientPayload,
} from "@/app/medical-records/services/patient-api"

export {
  createPatient,
  fetchPatientById as getPatientById,
  fetchPatients as getPatients,
  updatePatient,
} from "@/app/medical-records/services/patient-api"
