export const CLINICAL_IMAGE_CATEGORIES = [
  "DIAGNOSIS",
  "LAB_RESULT",
  "OTHER",
] as const

export type ClinicalImageCategory =
  (typeof CLINICAL_IMAGE_CATEGORIES)[number]

export const CLINICAL_IMAGE_CATEGORY_LABELS: Record<
  ClinicalImageCategory,
  string
> = {
  DIAGNOSIS: "Thiết chẩn (Lưỡi / Mắt / Da dị ứng)",
  LAB_RESULT: "Xét nghiệm / Kết quả",
  OTHER: "Ảnh lâm sàng khác",
}

export const CLINICAL_IMAGE_ZONE_CONFIG: Record<
  ClinicalImageCategory,
  { icon: string; uploadTitle: string; uploadHint: string }
> = {
  DIAGNOSIS: {
    icon: "👅",
    uploadTitle: "Ảnh thiết chẩn (Lưỡi)",
    uploadHint: "Kéo thả ảnh hoặc click để tải lên",
  },
  LAB_RESULT: {
    icon: "🧪",
    uploadTitle: "KQ xét nghiệm / Siêu âm",
    uploadHint: "Kéo thả ảnh hoặc click để tải lên",
  },
  OTHER: {
    icon: "📷",
    uploadTitle: "Thêm ảnh khác",
    uploadHint: "Kéo thả ảnh hoặc click để tải lên",
  },
}
