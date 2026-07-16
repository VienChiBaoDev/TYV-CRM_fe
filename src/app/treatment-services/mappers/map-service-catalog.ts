import type {
  CatalogServiceApi,
  ServiceGroupApi,
} from "../interfaces/treatment-services.interfaces"
import type { TreatmentServiceFormValues } from "../schemas/treatment-service-form"
import {
  CATALOG_SERVICE_STATUS,
  type ServiceGroup,
  type TreatmentService,
} from "../types/treatment-service"

// export const ITEM_TYPE_FROM_API = {
//   SERVICE: SERVICE_ITEM_TYPE.SERVICE,
//   PRODUCT: SERVICE_ITEM_TYPE.PRODUCT,
// } as const

// // as const để TypeScript biết rằng đây là một object constant
// export const ITEM_TYPE_TO_API = {
//   [SERVICE_ITEM_TYPE.SERVICE]: "SERVICE",
//   [SERVICE_ITEM_TYPE.PRODUCT]: "PRODUCT",
// } as const

export function mapServiceGroupFromApi(group: ServiceGroupApi): ServiceGroup {
  return {
    id: group.id,
    code: group.code,
    name: group.name,
    itemType: group.itemType,
    serviceCount: group._count.services,
  }
}

export function mapCatalogServiceFromApi(
  service: CatalogServiceApi
): TreatmentService {
  return {
    id: service.id,
    code: service.code,
    name: service.name,
    groupId: service.groupId,
    itemType: service.itemType,
    price: Number(service.price),
    alternatePrice: Number(service.alternatePrice),
    unit: service.unit,
    status:
      service.status === "ACTIVE"
        ? CATALOG_SERVICE_STATUS.ACTIVE
        : CATALOG_SERVICE_STATUS.INACTIVE,
    minPriceVat: service.minPriceVat ? Number(service.minPriceVat) : undefined,
    maxPriceVat: service.maxPriceVat ? Number(service.maxPriceVat) : undefined,
    treatmentCount: service.treatmentCount,
    expiryDays: service.expiryDays ?? undefined,
    note: service.note ?? undefined,
  }
}

export function mapFormValuesToApiPayload(
  values: TreatmentServiceFormValues
): Omit<CatalogServiceApi, "id"> {
  return {
    code: values.code,
    name: values.name.trim(),
    groupId: values.groupId,
    itemType: values.itemType,
    price: String(values.minPrice),
    alternatePrice: String(values.maxPrice),
    minPriceVat: String(values.minPriceVat),
    maxPriceVat: String(values.maxPriceVat),
    unit: values.unit,
    status: values.status,
    treatmentCount: 1,
    expiryDays: values.expiryDays,
    note: values.note.trim() || null,
  }
}
