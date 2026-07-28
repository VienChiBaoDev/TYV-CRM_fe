export interface PatientFormState {
  fullName: string
  gender: "MALE" | "FEMALE"
  phone: string
  /** Người dùng nhập dạng dd-mm-yyyy */
  birthDate: string
  address: string
  source: string
  assignedDoctorIds: string[]
  assignedAssistantIds: string[]
}

export const emptyPatientForm: PatientFormState = {
  fullName: "",
  gender: "MALE",
  phone: "",
  birthDate: "",
  address: "",
  source: "Khách Vãng Lai",
  assignedDoctorIds: [],
  assignedAssistantIds: [],
}

export type SetPatientField = <K extends keyof PatientFormState>(
  key: K,
  value: PatientFormState[K]
) => void
