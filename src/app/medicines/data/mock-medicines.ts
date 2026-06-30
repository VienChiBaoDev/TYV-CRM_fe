import type { Medicine } from "../types/medicine"

export const MOCK_MEDICINES: Medicine[] = [
  {
    id: "med-001",
    name: "Sài hồ",
    unit: "g",
    unitPrice: 500,
    category: "Thảo dược",
  },
  {
    id: "med-002",
    name: "Đương quy",
    unit: "g",
    unitPrice: 1200,
    category: "",
  },
  {
    id: "med-003",
    name: "Tiểu sài hồ gia giảm",
    unit: "túi",
    unitPrice: 350_000,
    category: "Bài thuốc",
  },
  {
    id: "med-004",
    name: "Bạch thược",
    unit: "g",
    unitPrice: 800,
  },
]
