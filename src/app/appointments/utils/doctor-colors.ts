export interface DoctorColorStyle {
  border: string
  bg: string
  text: string
  dot: string
}

export const DOCTOR_COLOR_PALETTE: readonly DoctorColorStyle[] = [
  {
    border: "border-l-red-500",
    bg: "bg-red-50",
    text: "text-red-950",
    dot: "bg-red-500",
  },
  {
    border: "border-l-orange-500",
    bg: "bg-orange-50",
    text: "text-orange-950",
    dot: "bg-orange-500",
  },
  {
    border: "border-l-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-950",
    dot: "bg-amber-500",
  },
  {
    border: "border-l-lime-500",
    bg: "bg-lime-50",
    text: "text-lime-950",
    dot: "bg-lime-500",
  },
  {
    border: "border-l-green-500",
    bg: "bg-green-50",
    text: "text-green-950",
    dot: "bg-green-500",
  },
  {
    border: "border-l-teal-500",
    bg: "bg-teal-50",
    text: "text-teal-950",
    dot: "bg-teal-500",
  },
  {
    border: "border-l-cyan-500",
    bg: "bg-cyan-50",
    text: "text-cyan-950",
    dot: "bg-cyan-500",
  },
  {
    border: "border-l-sky-500",
    bg: "bg-sky-50",
    text: "text-sky-950",
    dot: "bg-sky-500",
  },
  {
    border: "border-l-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-950",
    dot: "bg-blue-500",
  },
  {
    border: "border-l-violet-500",
    bg: "bg-violet-50",
    text: "text-violet-950",
    dot: "bg-violet-500",
  },
  {
    border: "border-l-fuchsia-500",
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-950",
    dot: "bg-fuchsia-500",
  },
  {
    border: "border-l-rose-500",
    bg: "bg-rose-50",
    text: "text-rose-950",
    dot: "bg-rose-500",
  },
] as const

function hashDoctorName(doctorName: string): number {
  let hash = 0
  for (let i = 0; i < doctorName.length; i++) {
    hash = (hash * 31 + doctorName.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function getDoctorColor(doctorName: string): DoctorColorStyle {
  const index = hashDoctorName(doctorName) % DOCTOR_COLOR_PALETTE.length
  return DOCTOR_COLOR_PALETTE[index] ?? DOCTOR_COLOR_PALETTE[0]
}

/** Rút gọn tên bác sĩ cho ô lịch nhỏ — ưu tiên họ tên đệm viết tắt + tên. */
export function formatDoctorShortName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "BS"
  if (parts.length === 1) return `BS. ${parts[0]}`
  const givenName = parts[parts.length - 1]
  const initials = parts
    .slice(0, -1)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
  return `BS. ${initials}${givenName}`
}
