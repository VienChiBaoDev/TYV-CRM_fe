export interface AppointmentFormState {
  /** ISO yyyy-mm-dd của ngày được chọn, "" nếu chưa chọn */
  date: string
  hour: string
  minute: string
  doctorId: string
  assistantId: string
  /** Các trường dưới đây chưa có cột DB — chỉ nhập, chưa lưu */
  consultant: string
  service: string
  note: string
}

function pad(n: number): string {
  return String(n).padStart(2, "0")
}

const now = new Date()

export const defaultAppointmentForm: AppointmentFormState = {
  date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
  hour: pad(now.getHours()),
  minute: pad(now.getMinutes()),
  doctorId: "",
  assistantId: "",
  consultant: "",
  service: "",
  note: "",
}

export type SetAppointmentField = <K extends keyof AppointmentFormState>(
  key: K,
  value: AppointmentFormState[K]
) => void
