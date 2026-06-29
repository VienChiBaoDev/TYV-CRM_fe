import type {
  CatalogServiceStatus,
  ServiceItemType,
} from "../types/treatment-service"

export interface ServiceGroupApi {
  id: string
  code: string
  name: string
  itemType: ServiceItemType
  _count: { services: number }
}

export interface CatalogServiceApi {
  id: string
  code: string
  name: string
  groupId: string
  itemType: ServiceItemType
  price: string
  alternatePrice: string
  unit: string
  status: CatalogServiceStatus
  minPriceVat: string | null
  maxPriceVat: string | null
  treatmentCount: number
  expiryDays: number | null
  note: string | null
}

export interface FetchCatalogServicesParams {
  groupId?: string
  search?: string
  status?: CatalogServiceStatus
  unit?: string
  itemType?: ServiceItemType
}
