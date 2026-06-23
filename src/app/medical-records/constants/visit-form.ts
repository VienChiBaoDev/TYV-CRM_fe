import type { Visit } from "@/app/medical-records/interfaces/types"

export const VISIT_STATUSES = [
  "Khám đầu",
  "Tái khám",
  "Online",
  "Cần TD",
  "Kế hoạch",
] as const satisfies readonly Visit["status"][]

export type VisitFormMode = "add" | "edit"

export function getDefaultVisitForm(): Partial<Visit> {
  return {
    title: "Tái khám định kỳ",
    date: new Date().toLocaleDateString("vi-VN"),
    doctor: "BS Phi Hưng",
    mode: "Trực tiếp",
    location: "Hàng Bông",
    bloodPressure: "120/80",
    pulse: "75",
    status: "Tái khám",
    symptoms: "",
    pulseDiagnosis: { ta: "", huu: "", bung: "" },
    prescriptionFormula: "TIỂU SÀI HỒ GIA GIẢM",
    prescriptionDosage: "7 THÁNG x 14 TÚI 150ML",
    herbs: [],
    clinicalImages: [],
    labResults: "",
  }
}
