import {
  CLINIC_BRANCHES,
  type ClinicBranchCode,
  type ClinicBranchLabel,
} from "@/constants/clinic-branches"
// Convert label to code
export function toClinicBranchCode(label: ClinicBranchLabel): ClinicBranchCode {
  const branch = CLINIC_BRANCHES.find((item) => item.label === label)
  if (!branch) {
    return CLINIC_BRANCHES[0].code
  }
  return branch.code
}
// Convert code to label
export function getBranchLabel(code: ClinicBranchCode): ClinicBranchLabel {
  const branch = CLINIC_BRANCHES.find((item) => item.code === code)
  if (!branch) {
    return CLINIC_BRANCHES[0].label
  }
  return branch.label
}
// Get emoji
export function getBranchEmoji(label: ClinicBranchLabel): string {
  const branch = CLINIC_BRANCHES.find((item) => item.label === label)
  return branch?.emoji ?? ""
}
