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

export function validatePatientAssignments(
  assignedDoctorIds: string[],
  assignedAssistantIds: string[]
): string | null {
  if (assignedDoctorIds.length === 0) {
    return 'Vui lòng chọn ít nhất một bác sĩ phụ trách'
  }
  if (assignedAssistantIds.length === 0) {
    return 'Vui lòng chọn ít nhất một trợ lý phụ trách'
  }
  return null
}
