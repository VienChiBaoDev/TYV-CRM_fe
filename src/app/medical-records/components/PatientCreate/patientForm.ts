export interface PatientFormState {
  fullName: string
  gender: "MALE" | "FEMALE"
  phone: string
  /** Người dùng nhập dạng dd-mm-yyyy */
  birthDate: string
  address: string
  source: string
}

export const emptyPatientForm: PatientFormState = {
  fullName: "",
  gender: "MALE",
  phone: "",
  birthDate: "",
  address: "",
  source: "Khách Vãng Lai",
}

export type SetPatientField = <K extends keyof PatientFormState>(
  key: K,
  value: PatientFormState[K],
) => void
