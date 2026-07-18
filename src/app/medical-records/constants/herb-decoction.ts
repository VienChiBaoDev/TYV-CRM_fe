export const HERB_DECOCTION_ORDER_OPTIONS = [
  { value: "Sắc trước", label: "Sắc trước" },
  { value: "Sắc thường", label: "Sắc thường" },
  { value: "Sắc sau", label: "Sắc sau" },
] as const

export const HERB_DECOCTION_PREP_OPTIONS = [
  { value: "Sắc sẵn", label: "Sắc sẵn" },
  { value: "Không sắc", label: "Không sắc" },
] as const

export type HerbDecoctionOrder =
  (typeof HERB_DECOCTION_ORDER_OPTIONS)[number]["value"]

export type HerbDecoctionPrep =
  (typeof HERB_DECOCTION_PREP_OPTIONS)[number]["value"]

export const DEFAULT_HERB_DECOCTION_ORDER: HerbDecoctionOrder = "Sắc thường"
export const DEFAULT_HERB_DECOCTION_PREP: HerbDecoctionPrep = "Không sắc"
