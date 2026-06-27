export const SERVICE_ITEM_TYPE = {
  SERVICE: "service",
  PRODUCT: "product",
} as const

export type ServiceItemType =
  (typeof SERVICE_ITEM_TYPE)[keyof typeof SERVICE_ITEM_TYPE]

export const SERVICE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const

export type ServiceStatus =
  (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS]

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
  status: ServiceStatus
  minPriceVat?: number
  maxPriceVat?: number
  treatmentCount?: number
  expiryDays?: number
  note?: string
}

export interface ServiceFilters {
  search: string
  status: "all" | ServiceStatus
  unit: string
  itemType: "all" | ServiceItemType
}
