export const SERVICE_ITEM_TYPE = {
  SERVICE: "SERVICE",
  PRODUCT: "PRODUCT",
} as const

export type ServiceItemType =
  (typeof SERVICE_ITEM_TYPE)[keyof typeof SERVICE_ITEM_TYPE]

export const CATALOG_SERVICE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const

export type CatalogServiceStatus =
  (typeof CATALOG_SERVICE_STATUS)[keyof typeof CATALOG_SERVICE_STATUS]

export interface ServiceGroup {
  id: string
  code: string
  name: string
  itemType: ServiceItemType
  serviceCount: number
}

export interface TreatmentService {
  id: string
  code: string
  name: string
  groupId: string
  itemType: ServiceItemType
  price: number
  alternatePrice: number
  unit: string
  status: CatalogServiceStatus
  minPriceVat?: number
  maxPriceVat?: number
  treatmentCount?: number
  expiryDays?: number
  note?: string
}

export interface ServiceFilters {
  search: string
  status: "all" | CatalogServiceStatus
  unit: string
  itemType: "all" | ServiceItemType
}
