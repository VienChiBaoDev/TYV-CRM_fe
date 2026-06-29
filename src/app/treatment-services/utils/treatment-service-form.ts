import type {
  ServiceItemType,
  TreatmentService,
} from "../types/treatment-service"
import {
  CATALOG_SERVICE_STATUS,
  SERVICE_ITEM_TYPE,
} from "../types/treatment-service"
import type { TreatmentServiceFormInput } from "../schemas/treatment-service-form"
import type { TreatmentServiceFormValues } from "../schemas/treatment-service-form"
import { treatmentServiceFormDefaultValues } from "../schemas/treatment-service-form"

const SERVICE_CODE_PREFIX = {
  [SERVICE_ITEM_TYPE.SERVICE]: "SV",
  [SERVICE_ITEM_TYPE.PRODUCT]: "PR",
} as const

export function generateServiceCode(
  services: TreatmentService[],
  itemType: ServiceItemType
): string {
  const prefix = SERVICE_CODE_PREFIX[itemType]
  const maxNumber = services
    .filter((service) => service.code.startsWith(prefix))
    .map((service) => Number.parseInt(service.code.slice(2), 10))
    .filter((value) => !Number.isNaN(value))
    .reduce((max, value) => Math.max(max, value), 0)

  return `${prefix}${String(maxNumber + 1).padStart(6, "0")}`
}

export function mapServiceToFormValues(
  service: TreatmentService
): TreatmentServiceFormInput {
  return {
    code: service.code,
    name: service.name,
    itemType: service.itemType,
    unit: service.unit,
    groupId: service.groupId,
    status: service.status,
    minPrice: service.price,
    maxPrice: service.alternatePrice,
    minPriceVat: service.minPriceVat ?? service.price,
    maxPriceVat: service.maxPriceVat ?? service.alternatePrice,
    expiryDays: service.expiryDays ?? 0,
    note: service.note ?? "",
  }
}

export function buildDefaultFormValues(
  services: TreatmentService[],
  defaultGroupId: string | null
): TreatmentServiceFormInput {
  const itemType = SERVICE_ITEM_TYPE.SERVICE

  return {
    ...treatmentServiceFormDefaultValues,
    code: generateServiceCode(services, itemType),
    groupId: defaultGroupId ?? "",
    itemType,
  }
}

export function mapFormValuesToService(
  values: TreatmentServiceFormValues,
  existing?: TreatmentService
): Omit<TreatmentService, "id"> {
  return {
    code: values.code,
    name: values.name.trim(),
    groupId: values.groupId,
    itemType: values.itemType,
    price: values.minPrice,
    alternatePrice: values.maxPrice,
    minPriceVat: values.minPriceVat,
    maxPriceVat: values.maxPriceVat,
    unit: values.unit,
    status: values.status ?? existing?.status ?? CATALOG_SERVICE_STATUS.ACTIVE,
    treatmentCount: 1,
    expiryDays: values.expiryDays,
    note: values.note.trim(),
  }
}
