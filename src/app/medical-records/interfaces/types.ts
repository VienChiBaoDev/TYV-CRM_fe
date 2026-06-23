export interface Herb {
  name: string
  weight: string
}

export interface Visit {
  id: number
  visitNumber: number
  title: string // e.g., "Khám đầu tiên", "Tái khám lần 1"
  date: string // "DD/MM/YYYY" or "DD/MM"
  doctor: string
  mode: "Online" | "Trực tiếp"
  location: string
  bloodPressure: string // e.g. "125/83"
  pulse: string // e.g. "83"
  symptoms: string
  pulseDiagnosis: {
    ta: string // Mạch tả
    huu: string // Mạch hữu
    bung: string // Bụng
  }
  prescriptionFormula: string // TIỂU SÀI HỒ GIA GIẢM
  prescriptionDosage: string // 7 THÁNG x 14 TÚI 150ML
  herbs: Herb[]
  clinicalImages?: string[] // array of base64 or object URLs
  labResults?: string
  status: "Khám đầu" | "Tái khám" | "Online" | "Cần TD" | "Kế hoạch"
}

export interface Patient {
  id: string
  name: string
  gender: "Nam" | "Nữ"
  age: number
  job: string
  phone: string
  address: string
  tags: string[]
  dietRestrictions: string[] // Kiêng
  metricVisitsCount: number
  metricTreatmentDays: number
  metricNextExamination: string
  avatarInitials: string
  visits: Visit[]
}
