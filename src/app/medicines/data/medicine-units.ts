export const MEDICINE_UNITS = [
  "Tất cả đơn vị",
  "g",
  "kg",
  "túi",
  "thang",
  "viên",
  "chai",
  "gói",
] as const

export const MEDICINE_UNIT_FORM_OPTIONS = MEDICINE_UNITS.filter(
  (unit) => unit !== "Tất cả đơn vị"
).map((unit) => ({ value: unit, label: unit }))
